import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsFromDatabase, initNego, getHistoriqueNego, postNegoMessage, accepterOffreNego, payerNego } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './NegoRoom.css';

const NegoRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [negoId, setNegoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [negoStatus, setNegoStatus] = useState('en_cours');
  const [negoAcheteurId, setNegoAcheteurId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadRoom = async () => {
      try {
        setNegoId(id); // id is now NumNego
        
        // Load messages and NumProd
        const histRes = await getHistoriqueNego(id);
        if (histRes && histRes.status === 'success') {
          setMessages(histRes.data);
          if (histRes.Statut) setNegoStatus(histRes.Statut);
          if (histRes.NumU_Acheteur) setNegoAcheteurId(histRes.NumU_Acheteur);
          
          // Now fetch the product using NumProd
          if (histRes.NumProd) {
            const data = await getProductsFromDatabase();
            const found = data.find(p => String(p.id) === String(histRes.NumProd) || String(p.NumProd) === String(histRes.NumProd));
            setProduct(found);
          } else {
            // Unlikely to happen, but safe fallback
            setProduct({ titre: 'Produit Inconnu', prix: 'N/A' });
          }
        }
      } catch (error) {
        console.error("Erreur Nego Room :", error);
      } finally {
        setLoading(false);
      }
    };
    loadRoom();
  }, [id, user, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !offerAmount) return;

    try {
      const payload = {
        NumNego: negoId,
        NumU: user.id,
        Contenu: newMessage || `Nouvelle offre de ${offerAmount} €`,
        MontantProp: offerAmount ? Number(offerAmount) : null
      };
      
      const res = await postNegoMessage(payload);
      if (res && res.status === 'success') {
        // Optimistic UI update
        setMessages([...messages, {
          NumMsg: Date.now(),
          Contenu: payload.Contenu,
          NumU_Expediteur: user.id,
          MontantProp: offerAmount || null,
          DateMsg: new Date().toISOString()
        }]);
        setNewMessage('');
        setOfferAmount('');
      } else {
        alert("Erreur lors de l'envoi.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const handleAccept = async (montant) => {
    if (window.confirm(`Accepter cette offre de ${Number(montant).toFixed(2)} € ? Le produit sera réservé en attente de paiement.`)) {
      try {
        const res = await accepterOffreNego({ NumNego: negoId, MontantAccepte: montant, NumU_Accepteur: user.id });
        if (res.status === 'success') {
          alert('Offre acceptée ! En attente du paiement.');
          window.location.reload();
        } else {
          alert("Erreur lors de l'acceptation.");
        }
      } catch (err) {
        alert("Erreur réseau.");
      }
    }
  };

  const handlePayer = async (montant) => {
    if (window.confirm(`Confirmer le paiement de ${Number(montant).toFixed(2)} € pour finaliser la commande ?`)) {
      try {
        const res = await payerNego({ NumNego: negoId, MontantPaye: montant, NumU_Acheteur: user.id });
        if (res.status === 'success') {
          alert('Paiement validé ! Vente conclue.');
          window.location.reload();
        } else {
          alert("Erreur lors du paiement.");
        }
      } catch (err) {
        alert("Erreur réseau.");
      }
    }
  };

  const getLastOfferAmount = () => {
    const lastOffer = messages.slice().reverse().find(m => m.MontantProp);
    return lastOffer ? lastOffer.MontantProp : 0;
  };

  if (loading) return <div className="loading">Connexion à la salle...</div>;
  if (!product) return <div className="empty">Produit introuvable.</div>;

  return (
    <div className="nego-room-page">
      <div className="nego-header">
        <h2>Salle de Négociation</h2>
        <p>Produit : <strong>{product.titre}</strong> (Prix initial : {product.prix} €)</p>
      </div>

      <div className="nego-chatbox">
        {messages.length === 0 ? (
          <p className="empty-chat">Aucun message pour le moment. Brisez la glace !</p>
        ) : (
          messages.map((msg, idx) => {
            const currentUserId = user?.id || user?.NumU;
            const isMe = String(msg.NumU_Expediteur) === String(currentUserId);
            return (
              <div key={idx} className={`chat-message ${isMe ? 'message-me' : 'message-other'}`}>
                <div className="msg-content">{msg.Contenu}</div>
                {msg.MontantProp && (
                  <div className="msg-offer">
                    Offre : {Number(msg.MontantProp).toFixed(2)} €
                    {!isMe && negoStatus === 'en_cours' && (
                      <button 
                        onClick={() => handleAccept(msg.MontantProp)} 
                        className="btn-success" 
                        style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem', borderRadius: '4px' }}
                      >
                        Accepter
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {negoStatus === 'en_cours' && (
        <form className="nego-input-area" onSubmit={handleSendMessage}>
          <input 
            type="number" 
            placeholder="Faire une offre (€)" 
            className="offer-input"
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Votre message..." 
            className="text-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="btn-primary">Envoyer</button>
        </form>
      )}
      
      {negoStatus === 'acceptee' && (
        <div className="nego-input-area" style={{ justifyContent: 'center', backgroundColor: '#eaf4ea', border: '1px solid #4caf50' }}>
          {String(user?.id || user?.NumU) === String(negoAcheteurId) ? (
            <button 
              onClick={() => handlePayer(getLastOfferAmount())} 
              className="btn-success" 
              style={{ fontSize: '1.2rem', padding: '15px 30px' }}
            >
              Procéder au paiement ({Number(getLastOfferAmount()).toFixed(2)} €)
            </button>
          ) : (
            <p style={{ color: '#4caf50', fontWeight: 'bold', margin: 0 }}>Offre acceptée. En attente du paiement de l'acheteur...</p>
          )}
        </div>
      )}

      {negoStatus === 'payee' && (
        <div className="nego-input-area" style={{ justifyContent: 'center', backgroundColor: '#e0f7fa', border: '1px solid #00acc1' }}>
          <p style={{ color: '#00acc1', fontWeight: 'bold', margin: 0 }}>Vente conclue et payée !</p>
        </div>
      )}
    </div>
  );
};

export default NegoRoom;
