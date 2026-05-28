import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const NegoRoom = () => {
  // Dans la version finale, productId servira à récupérer l'historique via PHP
  // const { productId } = useParams(); 
  
  // --- SIMULATION DES DONNÉES (Mock) ---
  const productInfo = {
    title: "Raquette Pro Stock - Jannik Sinner (Modèle Tour)",
    seller: "ProTennis_Collection",
    basePrice: 1200.00
  };

  const [messages, setMessages] = useState([
    { id: 1, sender: 'seller', text: 'Bonjour, la raquette est en parfait état, cordage neuf.', type: 'chat', time: '10:00' },
    { id: 2, sender: 'buyer', text: 'Bonjour, je suis très intéressé. Est-ce que le grip est d\'origine ?', type: 'chat', time: '10:05' },
    { id: 3, sender: 'seller', text: 'Oui, 100% d\'origine. Je suis ouvert à la discussion.', type: 'chat', time: '10:12' }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll vers le bas de la conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(scrollToBottom, [messages]);

  // Fonction d'envoi d'un message classique
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'buyer',
      text: inputText,
      type: 'chat',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  // Fonction d'envoi d'une offre financière
  const handleSendOffer = (e) => {
    e.preventDefault();
    if (!offerAmount || isNaN(offerAmount)) return;

    const newOffer = {
      id: Date.now(),
      sender: 'buyer',
      amount: parseFloat(offerAmount),
      type: 'offer',
      status: 'pending', // En attente de la réponse du vendeur
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newOffer]);
    setOfferAmount('');
  };

  return (
    <div className="nego-room-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* En-tête de la salle */}
      <div style={{ padding: '1.5rem', backgroundColor: '#000', color: '#fff', borderRadius: '8px 8px 0 0' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Salle de Négociation</h2>
        <p style={{ margin: '0.5rem 0 0 0', color: '#eaeaea' }}>
          {productInfo.title} | Vendeur : {productInfo.seller}
        </p>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Prix initial : {productInfo.basePrice.toFixed(2)} €</p>
      </div>

      {/* Zone des messages */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #eaeaea', 
        borderTop: 'none',
        padding: '1.5rem',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ 
            alignSelf: msg.sender === 'buyer' ? 'flex-end' : 'flex-start',
            maxWidth: '70%'
          }}>
            {msg.type === 'chat' ? (
              // Bulle de chat classique
              <div style={{
                backgroundColor: msg.sender === 'buyer' ? '#000' : '#fff',
                color: msg.sender === 'buyer' ? '#fff' : '#000',
                border: msg.sender === 'buyer' ? 'none' : '1px solid #ccc',
                padding: '0.8rem 1.2rem',
                borderRadius: msg.sender === 'buyer' ? '15px 15px 0 15px' : '15px 15px 15px 0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {msg.text}
              </div>
            ) : (
              // Bulle de proposition financière
              <div style={{
                backgroundColor: '#f1c40f', // Jaune pour démarquer l'offre
                color: '#000',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                NOUVELLE OFFRE : {msg.amount.toFixed(2)} €
                <div style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: '0.5rem' }}>
                  Statut : En attente du vendeur
                </div>
              </div>
            )}
            <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '0.2rem', textAlign: msg.sender === 'buyer' ? 'right' : 'left' }}>
              {msg.time}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div style={{ 
        border: '1px solid #eaeaea', 
        borderTop: 'none',
        borderRadius: '0 0 8px 8px', 
        padding: '1.5rem',
        backgroundColor: '#fff'
      }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Écrivez votre message..." 
            style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0 1.5rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Envoyer
          </button>
        </form>

        <form onSubmit={handleSendOffer} style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
          <input 
            type="number" 
            value={offerAmount}
            onChange={(e) => setOfferAmount(e.target.value)}
            placeholder="Montant de votre offre (€)" 
            style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button type="submit" style={{ padding: '0 1.5rem', backgroundColor: '#f1c40f', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Faire une offre
          </button>
        </form>
      </div>

    </div>
  );
};

export default NegoRoom;
