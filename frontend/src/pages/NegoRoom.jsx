import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsFromDatabase, initNego, getHistoriqueNego, postNegoMessage } from '../services/api';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadRoom = async () => {
      try {
        const data = await getProductsFromDatabase();
        const found = data.find(p => String(p.id) === String(id));
        setProduct(found);

        if (found) {
          // Initialize or get the negotiation room
          const initRes = await initNego({ NumProd: found.id, NumU_Acheteur: user.id });
          if (initRes && initRes.status === 'success') {
            setNegoId(initRes.NumNego);
            
            // Load messages
            const histRes = await getHistoriqueNego(initRes.NumNego);
            if (histRes && histRes.status === 'success') {
              setMessages(histRes.data);
            }
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
        Contenu: newMessage || `Nouvelle offre de ${offerAmount} €`
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
            const isMe = String(msg.NumU_Expediteur) === String(user.id);
            return (
              <div key={idx} className={`chat-message ${isMe ? 'message-me' : 'message-other'}`}>
                <div className="msg-content">{msg.Contenu}</div>
                {msg.MontantProp && (
                  <div className="msg-offer">Offre : {Number(msg.MontantProp).toFixed(2)} €</div>
                )}
              </div>
            );
          })
        )}
      </div>

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
    </div>
  );
};

export default NegoRoom;
