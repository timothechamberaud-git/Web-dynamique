import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Countdown from '../components/Countdown';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Le jour de l'intégration, cela deviendra : await fetch(`/api/products/${id}`)
      setTimeout(() => {
        setProduct({
          id: id,
          title: "Maillot Officiel FC Barcelone Dédicacé",
          description: "Maillot de match authentique du Barça. Une pièce de collection rare, idéale pour les passionnés du jeu catalan et les analystes des performances au Camp Nou.",
          price: 250.00,
          type: "enchere", // Change ceci en "achat" ou "negociation" pour tester les autres affichages
          endTime: "2026-05-30T21:00:00Z",
          seller: "Catalunya_Memorabilia",
          stock: 1
        });
        setLoading(false);
      }, 400); 
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Chargement des détails...</div>;
  if (!product) return <div style={{ padding: '2rem', textAlign: 'center' }}>Produit introuvable.</div>;

  return (
    <div className="product-detail-container" style={{ 
      padding: '2rem', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      display: 'flex', 
      gap: '3rem',
      flexWrap: 'wrap' 
    }}>
      
      {/* Colonne de gauche : Visuel du produit */}
      <div style={{ 
        flex: '1 1 400px', 
        backgroundColor: '#F5F5F7', 
        height: '450px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '12px' 
      }}>
        <span style={{ color: '#aaa', fontSize: '1.2rem' }}>[Visuel : {product.title}]</span>
      </div>

      {/* Colonne de droite : Informations et Call-to-Action */}
      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            color: '#888' 
          }}>
            Vendeur : {product.seller}
          </span>
          <h1 style={{ fontSize: '2.2rem', margin: '0.5rem 0 1rem 0', lineHeight: '1.2' }}>
            {product.title}
          </h1>
          <p style={{ color: '#444', fontSize: '1.1rem', lineHeight: '1.6' }}>
            {product.description}
          </p>
        </div>

        <div style={{ marginTop: 'auto' }}>
          
          {/* SCÉNARIO 1 : ACHAT IMMÉDIAT */}
          {product.type === 'achat' && (
            <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>{product.price.toFixed(2)} €</h2>
              <button style={{ 
                width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', 
                border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' 
              }}>
                Ajouter au panier
              </button>
            </div>
          )}

          {/* SCÉNARIO 2 : ENCHÈRE */}
          {product.type === 'enchere' && (
            <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
              <Countdown 
                productId={product.id} 
                initialPrice={product.price} 
                endTime={product.endTime} 
              />
            </div>
          )}

          {/* SCÉNARIO 3 : NÉGOCIATION */}
          {product.type === 'negociation' && (
            <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
              <h2 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0' }}>
                {product.price.toFixed(2)} € <span style={{fontSize: '1rem', color: '#666', fontWeight: 'normal'}}>(Prix de base)</span>
              </h2>
              <Link to={`/negociation/${product.id}`} style={{ 
                display: 'block', textAlign: 'center', width: '100%', padding: '1rem', 
                backgroundColor: '#3498db', color: '#fff', borderRadius: '6px', 
                fontSize: '1.1rem', textDecoration: 'none', fontWeight: 'bold' 
              }}>
                Ouvrir un salon de négociation privé
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
