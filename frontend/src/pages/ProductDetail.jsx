import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsFromDatabase, getEnchere, postOffre } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enchereData, setEnchereData] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProductsFromDatabase();
        const found = data.find(p => String(p.id) === String(id));
        setProduct(found);

        if (found && found.type_vente?.toLowerCase() === 'enchere') {
          const ench = await getEnchere(found.id);
          if (ench && ench.status === 'success') {
            setEnchereData(ench.data);
          }
        }
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) return <div className="loading">Chargement...</div>;
  if (!product) return <div className="empty">Produit introuvable.</div>;

  const getImage = (pid) => {
    return `/images/product_${pid}.png`;
  };

  const isEnchere = product.type_vente?.toLowerCase() === 'enchere';
  const isNego = product.type_vente?.toLowerCase() === 'negociation';
  const currentPrice = isEnchere && enchereData ? enchereData.PrixActuel : product.prix;

  const handleAction = async () => {
    if (isEnchere) {
      if (!user) {
        alert("Vous devez être connecté pour enchérir.");
        navigate('/login');
        return;
      }
      const montant = prompt(`Entrez votre enchère (actuellement à ${currentPrice} €):`);
      if (montant && Number(montant) > Number(currentPrice)) {
        try {
          const response = await postOffre({
            NumEnchere: enchereData.NumEnchere,
            NumU: user.id,
            Montant: Number(montant)
          });
          if (response.status === 'success') {
            alert("Enchère placée avec succès !");
            setEnchereData({ ...enchereData, PrixActuel: Number(montant) });
          } else {
            alert(response.message || "Erreur lors de l'enchère.");
          }
        } catch (error) {
          alert("Erreur réseau.");
        }
      } else if (montant) {
        alert(`Votre enchère doit être supérieure à ${currentPrice} €`);
      }
    } else if (isNego) {
      if (!user) {
        alert("Vous devez être connecté pour négocier.");
        navigate('/login');
        return;
      }
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
          <img src={getImage(product.id || product.NumProd)} alt={product.titre} />
        </div>
        
        <div className="detail-info">
          <h1>{product.titre}</h1>
          <p className="subtitle">État : {product.etat || 'Neuf'}. Vendeur : {product.vendeur || 'Boutique Nova'}</p>
          
          <div className="price-box">
            <div className="price-info">
              <span className="label">Prix Actuel</span>
              <span className="value">{Number(currentPrice).toFixed(2)} €</span>
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
