import React, { useState, useEffect } from 'react';

const Countdown = ({ productId, initialPrice, endTime }) => {
  const [currentPrice, setCurrentPrice] = useState(initialPrice);
  const [timeLeft, setTimeLeft] = useState('');
  const [flashEffect, setFlashEffect] = useState(false);

  // 1. Logique du chronomètre (mise à jour de l'UI chaque seconde)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date();
      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        // Formatage pour toujours avoir 2 chiffres (ex: 02:14:55)
        setTimeLeft(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeLeft('Enchère terminée');
      }
    };

    calculateTimeLeft(); // Appel initial immédiat
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // Nettoyage de l'intervalle si le composant est démonté
    return () => clearInterval(timer);
  }, [endTime]);

  // 2. Logique du Polling HTTP (vérification des nouvelles offres)
  useEffect(() => {
    const pollPrice = async () => {
      try {
        // Le jour J, cet appel remplacera la simulation :
        // const response = await fetch(`/api/products/${productId}/price`);
        // const data = await response.json();
        
        // --- SIMULATION POUR LE DÉVELOPPEMENT FRONT ---
        // On simule une chance sur 3 qu'un utilisateur ait surenchéri
        const someoneBid = Math.random() > 0.6; 
        
        if (someoneBid) {
          const randomIncrease = Math.floor(Math.random() * 20) + 5;
          
          setCurrentPrice(prevPrice => {
            const newPrice = prevPrice + randomIncrease;
            // Déclenche l'effet de surbrillance (Flash UI)
            setFlashEffect(true);
            setTimeout(() => setFlashEffect(false), 1500);
            return newPrice;
          });
        }
      } catch (error) {
        console.error("Erreur lors du polling du prix :", error);
      }
    };

    // On interroge le serveur (ou la simulation) toutes les 5 secondes
    const intervalId = setInterval(pollPrice, 5000);
    
    return () => clearInterval(intervalId);
  }, [productId]);

  return (
    <div className="countdown-container" style={{
      padding: '2rem',
      backgroundColor: '#FAFAFA',
      border: '1px solid #EAEAEA',
      borderRadius: '8px',
      textAlign: 'center',
      maxWidth: '350px',
      margin: '0 auto'
    }}>
      <h4 style={{ color: '#555', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Fin de l'enchère dans
      </h4>
      <div style={{ color: '#e74c3c', fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
        {timeLeft}
      </div>
      
      <div style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginTop: '1rem',
        color: flashEffect ? '#e74c3c' : '#000',
        transition: 'color 0.4s ease-in-out' // Animation fluide pour le flash
      }}>
        Prix Actuel : {currentPrice.toFixed(2)} €
      </div>
      
      <button style={{
        marginTop: '2rem',
        padding: '1rem 2rem',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        width: '100%',
        transition: 'background-color 0.2s'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
      onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
      >
        Enchérir
      </button>
    </div>
  );
};

export default Countdown;
