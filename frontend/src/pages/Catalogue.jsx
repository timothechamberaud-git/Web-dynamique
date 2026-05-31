import React, { useState, useEffect } from 'react';
import { getProductsFromDatabase } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Catalogue.css';

const Catalogue = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProductsFromDatabase();
        const disp = data.filter(p => p.StatutVente === 'disponible');
        setAllProducts(disp);
        setFilteredProducts(disp);
      } catch (error) {
        console.error("Erreur API :", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    let result = allProducts;
    if (searchQuery.trim() !== '') {
      result = result.filter(p => (p.titre || p.Titre || '').toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (selectedSports.length > 0) {
      result = result.filter(p => selectedSports.includes(p.categorie));
    }
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type_vente));
    }
    setFilteredProducts(result);
  }, [searchQuery, selectedSports, selectedTypes, allProducts]);

  const handleSportToggle = (sport) => {
    setSelectedSports(prev => prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]);
  };

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const availableSports = [...new Set(allProducts.map(p => p.categorie))];
  const availableTypes = [...new Set(allProducts.map(p => p.type_vente))];

  const typeLabels = {
    'enchere': 'Enchères',
    'immediat': 'Achat Direct',
    'nego': 'Négociation'
  };

  return (
    <div className="catalogue">
      <div className="page-header">CATALOGUE DE RECHERCHE</div>
      
      <div className="catalogue-search-bar" style={{ padding: '20px 40px', backgroundColor: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Rechercher un produit (ex: vélo, maillot...)" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '600px', padding: '12px 20px', borderRadius: '30px', border: '1px solid var(--border)', fontSize: '1rem', outline: 'none' }}
        />
      </div>
      
      <div className="catalogue-layout">
        <aside className="sidebar">
          <div className="filter-group">
            <h4>SPORTS</h4>
            {availableSports.map(sport => (
              <label key={sport}>
                <input 
                  type="checkbox" 
                  checked={selectedSports.includes(sport)}
                  onChange={() => handleSportToggle(sport)} 
                /> 
                {sport}
              </label>
            ))}
            {availableSports.length === 0 && <span style={{fontSize: '12px', color: '#999'}}>Aucun sport</span>}
          </div>
          
          <div className="filter-group">
            <h4>TYPE DE VENTE</h4>
            {availableTypes.map(type => (
              <label key={type}>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)} 
                /> 
                {typeLabels[type] || type}
              </label>
            ))}
            {availableTypes.length === 0 && <span style={{fontSize: '12px', color: '#999'}}>Aucun type</span>}
          </div>
        </aside>

        <div className="product-grid">
          {loading ? (
            <div className="loading">Chargement du catalogue...</div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="empty">Aucun produit ne correspond à vos filtres.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
