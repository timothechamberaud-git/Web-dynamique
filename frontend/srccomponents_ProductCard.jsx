import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // On isolera le CSS spécifique ici plus tard si besoin

const ProductCard = ({ product }) => {
  // Fonction pour définir la couleur du badge selon le type de vente
  const getBadgeStyle = (type) => {
    switch(type) {
      case 'enchere': return { backgroundColor: '#e74c3c', color: 'white' }; // Rouge urgence
      case 'negociation': return { backgroundColor: '#3498db', color: 'white' }; // Bleu premium
      case 'achat': default: return { backgroundColor: '#2ecc71', color: 'white' }; // Vert classique
    }
  };

  return (
    <article className="product-card" style={{ 
      border: '1px solid #eaeaea', 
      borderRadius: '8px', 
      padding: '1.5rem',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      
      {/* En-tête de la carte avec Titre et Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>{product.title}</h3>
        <span style={{ 
          padding: '0.3rem 0.6rem', 
          borderRadius: '20px', 
          fontSize: '0.8rem',
          fontWeight: 'bold',
          ...getBadgeStyle(product.type)
        }}>
          {product.type.toUpperCase()}
        </span>
      </div>

      {/* Image (Placeholder en attendant les vrais assets) */}
      <div style={{ height: '150px', backgroundColor: '#f9f9f9', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#aaa' }}>Image: {product.image}</span>
      </div>

      {/* Prix et Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <strong style={{ fontSize: '1.4rem' }}>{product.price.toFixed(2)} €</strong>
        
        {/* Lien dynamique vers la fiche détail */}
        <Link 
          to={`/produit/${product.id}`} 
          style={{ 
            backgroundColor: '#000', 
            color: '#fff', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
        >
          Voir le détail
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
