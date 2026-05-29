import React, { useState, useEffect } from 'react';
import { getProductsFromDatabase } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Catalogue.css';

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProductsFromDatabase();
        setProducts(data.filter(p => p.StatutVente === 'disponible'));
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="catalogue">
      <div className="page-header">CATALOGUE DE RECHERCHE</div>
      
      <div className="catalogue-layout">
        <aside className="sidebar">
          <div className="filter-group">
            <h4>SPORTS</h4>
            <label><input type="checkbox" defaultChecked /> Football</label>
            <label><input type="checkbox" /> Tennis</label>
            <label><input type="checkbox" /> Fitness</label>
          </div>
          
          <div className="filter-group">
            <h4>TYPE DE VENTE</h4>
            <label><input type="checkbox" defaultChecked /> Enchères</label>
            <label><input type="checkbox" /> Achat Direct</label>
          </div>
        </aside>

        <div className="product-grid">
          {loading ? (
            <div className="loading">Chargement du catalogue...</div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="empty">Aucun produit trouvé.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
