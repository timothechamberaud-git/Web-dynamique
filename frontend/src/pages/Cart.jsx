import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { validerCommande } from '../services/api';
import './Cart.css';

const Cart = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth(); // We need user info to place order

  const handlePay = async () => {
    if (cart.length === 0) return;
    if (!user) {
      alert("Vous devez être connecté pour commander.");
      navigate('/login');
      return;
    }
    
    try {
      const commandeData = {
        NumU_Acheteur: user.id,
        Total: getCartTotal(),
        Panier: cart.map(item => ({
          NumProd: item.id || item.NumProd,
          Quantite: item.quantity || 1,
          Prix: item.prix || item.price
        }))
      };
      
      const res = await validerCommande(commandeData);
      if (res && res.status === 'success') {
        alert("Paiement simulé avec succès ! Votre commande a été validée.");
        clearCart();
        navigate('/dashboard');
      } else {
        alert("Erreur lors de la validation: " + (res?.message || "Inconnue"));
      }
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const total = getCartTotal();

  const getImage = (id) => {
    return `/images/product_${id}.png`;
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
                <div className="item-image" style={{ backgroundImage: `url(${getImage(item.id || item.NumProd)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
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
