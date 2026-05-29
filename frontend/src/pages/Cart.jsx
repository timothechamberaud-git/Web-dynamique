import React from 'react';
import './Cart.css';

const Cart = () => {
  return (
    <div className="cart-page">
      <div className="page-header">VOTRE PANIER</div>
      
      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-item">
            <div className="item-image"></div>
            <div className="item-details">
              <h3>Raquette Wilson Pro</h3>
              <p>Taille L3 | Achat Direct</p>
            </div>
            <div className="item-price">89,00 €</div>
          </div>
          <div className="cart-item lighter">
            <div className="item-image"></div>
            <div className="item-details">
              <h3>Lot 12 Balles Golf</h3>
              <p>Neuf</p>
            </div>
            <div className="item-price">25,00 €</div>
          </div>
        </div>
        
        <div className="cart-summary">
          <h3>Résumé</h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>114,00 €</span>
          </div>
          <div className="summary-row text-green">
            <span>Livraison</span>
            <span>Gratuit</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>114,00 €</span>
          </div>
          <button className="btn-primary btn-full">PAYER LA COMMANDE</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
