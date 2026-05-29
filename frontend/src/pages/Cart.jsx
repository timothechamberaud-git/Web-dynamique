import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handlePay = () => {
    if (cart.length === 0) return;
    alert("Paiement simulé avec succès ! Votre commande a été validée.");
    clearCart();
    navigate('/catalogue');
  };

  const total = getCartTotal();

  const getImage = (title) => {
    if (title.toLowerCase().includes('maillot')) return 'https://images.unsplash.com/photo-1580087433276-6134b22db74a?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('vélo') || title.toLowerCase().includes('velo')) return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('raquette')) return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('jordan') || title.toLowerCase().includes('chaussure')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop';
  };

  return (
    <div className="cart-page">
      <div className="page-header">VOTRE PANIER</div>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{ color: 'var(--text-light)' }}>Votre panier est vide.</p>
          ) : (
            cart.map((item, index) => (
              <div key={item.id || index} className={`cart-item ${index % 2 !== 0 ? 'lighter' : ''}`}>
                <div className="item-image" style={{ backgroundImage: `url(${getImage(item.titre)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="item-details">
                  <h3>{item.titre}</h3>
                  <p>{item.etat || 'Neuf'} | {item.type_vente === 'achat' ? 'Achat Direct' : 'Achat'}</p>
                </div>
                <div className="item-price">
                  {item.quantity > 1 && <span style={{ fontSize: '0.9rem', marginRight: '10px' }}>{item.quantity}x</span>}
                  {Number(item.prix || item.price).toFixed(2)} €
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="cart-summary">
          <h3>Résumé</h3>
          <div className="summary-row">
            <span>Sous-total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <div className="summary-row text-green">
            <span>Livraison</span>
            <span>Gratuit</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{total.toFixed(2)} €</span>
          </div>
          <button 
            className="btn-primary btn-full" 
            onClick={handlePay}
            disabled={cart.length === 0}
            style={{ opacity: cart.length === 0 ? 0.5 : 1, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            PAYER LA COMMANDE
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
