import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Le sport sous<br/>toutes ses <span className="highlight">formes.</span></h1>
          <p>Équipements neufs, enchères de collection et négociations directes : une expérience hybride unique.</p>
          <Link to="/catalogue">
            <button className="btn-primary">EXPLORER LE CATALOGUE</button>
          </Link>
        </div>
        <div className="hero-image">
          {/* Using a placeholder for the sport equipment image from the screenshot */}
          <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop" alt="Sport Life" />
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon text-green">⚡</div>
          <h3>Achat Immédiat</h3>
          <p>Articles neufs et essentiels. Commandez en un clic pour une performance immédiate.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon text-green">🔨</div>
          <h3>Enchères Live</h3>
          <p>Trésors historiques et vintage. Accédez à l'exclusivité en quelques secondes.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon text-green">🤝</div>
          <h3>Négociations</h3>
          <p>Matériel premium d'occasion. Échangez directement avec le vendeur.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
