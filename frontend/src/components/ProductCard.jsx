import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const getImage = (product) => {
    if (product.PhotoUrl) return product.PhotoUrl;
    return `/images/product_${product.id || product.NumProd}.png`;
  };

  const getBadgeType = (type) => {
    switch(type?.toLowerCase()) {
      case 'enchere': return 'ENCHÈRE LIVE';
      case 'nego': 
      case 'negociation': return 'NÉGOCIABLE';
      default: return 'ACHAT DIRECT';
    }
  };

  return (
    <Link to={`/produit/${product.id}`} className="product-card">
      <div className="product-image-container">
        <img src={getImage(product)} alt={product.titre || product.title} />
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3>{product.titre || product.title}</h3>
          <p className="product-type">
            {product.type_vente === 'enchere' ? 'Enchère' : 
             product.type_vente === 'nego' ? 'Négociation' : 
             'Achat immédiat'}
          </p>
        </div>
        <p className="price">{Number(product.prix || product.price).toFixed(2)} €</p>
        <div className="badge">{getBadgeType(product.type_vente || product.type)}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
