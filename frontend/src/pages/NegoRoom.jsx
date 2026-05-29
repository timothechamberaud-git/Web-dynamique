import React from 'react';
import './NegoRoom.css';

const NegoRoom = () => {
  return (
    <div className="nego-page">
      <div className="page-header">SALLE DE NÉGOCIATION</div>
      
      <div className="nego-container">
        <div className="nego-header">
          <div className="product-summary">
            <div className="product-thumb"></div>
            <div>
              <h3>Vélo Trek Emonda Carbon</h3>
              <p>Vendeur: Jean_Expert_75</p>
            </div>
          </div>
          <button className="btn-success">ACCEPTER L'OFFRE (1 450 €)</button>
        </div>
        
        <div className="chat-window">
          <div className="message received">
            <p>Bonjour, je propose 1 300 € pour ce vélo.</p>
          </div>
          <div className="message sent">
            <p>Bonjour. C'est un peu bas au vu des options. Je propose 1 500 €</p>
          </div>
          <div className="message received offer">
            <p><strong>Offre proposée : 1 450.00 €</strong><br/>C'est ma dernière proposition.</p>
          </div>
        </div>
        
        <div className="chat-input-area">
          <input type="text" className="text-input" placeholder="Écrire un message..." />
          <input type="number" className="offer-input" placeholder="Offre (€)" />
          <button className="btn-primary">ENVOYER</button>
        </div>
      </div>
    </div>
  );
};

export default NegoRoom;
