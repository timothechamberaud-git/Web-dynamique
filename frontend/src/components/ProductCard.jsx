import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  // Use a fallback image depending on the title if image is missing from DB
  const getImage = (title) => {
    if (title.toLowerCase().includes('maillot')) return 'https://images.unsplash.com/photo-1580087433276-6134b22db74a?q=80&w=400&auto=format&fit=crop';
    if (title.toLowerCase().includes('vélo') || title.toLowerCase().includes('velo')) return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400&auto=format&fit=crop';
    if (title.toLowerCase().includes('raquette')) return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=400&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=400&auto=format&fit=crop'; // default
  };

  const getBadgeType = (type) => {
    switch(type?.toLowerCase()) {
      case 'enchere': return 'ENCHÈRE LIVE';
      case 'negociation': return 'NÉGOCIABLE';
      default: return 'ACHAT DIRECT';
    }
  };

  return (
    <Link to={`/produit/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img src={product.image || getImage(product.titre || product.title || '')} alt={product.titre || product.title} />
      </div>
      <div className="product-info">
        <h3>{product.titre || product.title}</h3>
        <p className="price">{Number(product.prix || product.price).toFixed(2)} €</p>
        <div className="badge">{getBadgeType(product.type_vente || product.type)}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
