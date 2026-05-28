import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../services/apiMock';
import ProductCard from '../components/ProductCard'; // <-- Ton nouvel import

const Catalogue = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement du catalogue Mercato Nova...</div>;

  return (
    <div className="catalogue-container" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Catalogue des équipements</h2>
      
      {/* Remplacement du code en dur par l'appel à ton composant */}
      <div className="product-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalogue;
