import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsFromDatabase } from '../services/api';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductsFromDatabase();
        const found = data.find(p => String(p.id) === String(id));
        setProduct(found);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!product) return <div className="empty">Produit introuvable.</div>;

  const getImage = (title) => {
    if (title.toLowerCase().includes('maillot')) return 'https://images.unsplash.com/photo-1580087433276-6134b22db74a?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('vélo') || title.toLowerCase().includes('velo')) return 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('raquette')) return 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=600&auto=format&fit=crop';
    if (title.toLowerCase().includes('jordan') || title.toLowerCase().includes('chaussure')) return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop';
    return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop';
  };

  const isEnchere = product.type_vente?.toLowerCase() === 'enchere';
  const isNego = product.type_vente?.toLowerCase() === 'negociation';

  const handleAction = () => {
    if (isEnchere) {
      alert("Enchère simulée avec succès !");
    } else if (isNego) {
      navigate(`/nego/${product.id}`);
    } else {
      addToCart(product);
      alert(`${product.titre} a été ajouté au panier !`);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="page-header">DÉTAIL PRODUIT : {product.type_vente?.toUpperCase() || 'ACHAT DIRECT'}</div>
      
      <div className="detail-grid">
        <div className="detail-image-box">
          <img src={product.image || getImage(product.titre)} alt={product.titre} />
        </div>
        
        <div className="detail-info">
          <h1>{product.titre}</h1>
          <p className="subtitle">État : {product.etat || 'Neuf'}. Vendeur : {product.vendeur || 'Boutique Nova'}</p>
          
          <div className="price-box">
            <div className="price-info">
              <span className="label">Prix Actuel</span>
              <span className="value">{Number(product.prix).toFixed(2)} €</span>
            </div>
            {isEnchere && (
              <div className="time-info text-green">
                <span className="label">Fin dans</span>
                <span className="value">02:14:55</span>
              </div>
            )}
          </div>
          
          <button 
            className={isEnchere ? "btn-success btn-full" : "btn-primary btn-full"}
            onClick={handleAction}
          >
            {isEnchere ? "Enchérir" : isNego ? "Négocier avec le vendeur" : "Ajouter au panier"}
          </button>

          <div className="description-section">
            <h4>DESCRIPTION</h4>
            <p>Une pièce historique et essentielle. Livrée avec garantie d'authenticité Mercato Nova.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
