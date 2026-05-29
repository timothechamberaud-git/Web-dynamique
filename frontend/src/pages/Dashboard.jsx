import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats, getSuiviEncheres, getSuiviNegos, getMesVentes } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ achats: 0, encheres_suivies: 0, negociations: 0, mes_ventes: 0 });
  const [encheres, setEncheres] = useState([]);
  const [negos, setNegos] = useState([]);
  const [ventes, setVentes] = useState([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      const [resStats, resEnch, resNego, resVentes] = await Promise.all([
        getUserStats(user.id),
        getSuiviEncheres(user.id),
        getSuiviNegos(user.id),
        getMesVentes(user.id)
      ]);

      if (resStats?.status === 'success') setStats(resStats.data);
      if (resEnch?.status === 'success') setEncheres(resEnch.data);
      if (resNego?.status === 'success') setNegos(resNego.data);
      if (resVentes?.status === 'success') setVentes(resVentes.data);
      
      setLoading(false);
    };

    loadData();
  }, [user, navigate]);

  if (loading) return <div className="loading">Chargement du dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <span className="subtitle">MON DASHBOARD</span>
        <div className="user-info-section" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="user-avatar"></div>
            <div className="user-details">
              <h2>Bonjour, {user?.prenom}</h2>
              <p>Membre Premium depuis 2026</p>
            </div>
          </div>
          <Link to="/vendre" className="btn-primary" style={{ height: 'fit-content', padding: '15px 30px' }}>
            + Mettre un produit en vente
          </Link>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{String(stats.achats).padStart(2, '0')}</h3>
          <span>ACHATS</span>
        </div>
        <div className="stat-card">
          <h3>{String(stats.encheres_suivies).padStart(2, '0')}</h3>
          <span>ENCHÈRES SUIVIES</span>
        </div>
        <div className="stat-card highlight">
          <h3>{String(stats.negociations).padStart(2, '0')}</h3>
          <span>NÉGOCIATIONS</span>
        </div>
        <div className="stat-card">
          <h3>{String(stats.mes_ventes).padStart(2, '0')}</h3>
          <span>MES VENTES</span>
        </div>
      </div>

      <div className="tracking-sections">
        
        <div className="tracking-section">
          <h3>Enchères suivies ({encheres.length})</h3>
          {encheres.length === 0 ? <p>Aucune enchère suivie.</p> : (
            <div className="tracking-list">
              {encheres.map(e => (
                <div key={e.NumEnchere} className="tracking-item">
                  <div className="tracking-info">
                    <h4>{e.Titre}</h4>
                    <p>Prix actuel : <strong>{e.PrixActuel} €</strong></p>
                  </div>
                  <Link to={`/produit/${e.NumProd}`} className="btn-secondary">Voir l'enchère</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tracking-section">
          <h3>Mes Négociations ({negos.length})</h3>
          {negos.length === 0 ? <p>Aucune négociation en cours.</p> : (
            <div className="tracking-list">
              {negos.map(n => (
                <div key={n.NumNego} className="tracking-item">
                  <div className="tracking-info">
                    <h4>{n.Titre}</h4>
                    <p>Statut : <span style={{color: 'var(--secondary)'}}>{n.Statut}</span></p>
                  </div>
                  <Link to={`/nego/${n.NumNego}`} className="btn-primary">Rejoindre la salle</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="tracking-section">
          <h3>Mes Ventes (Produits en ligne) ({ventes.length})</h3>
          {ventes.length === 0 ? <p>Vous n'avez pas de produits en vente.</p> : (
            <div className="tracking-list">
              {ventes.map(v => (
                <div key={v.NumProd} className="tracking-item">
                  <div className="tracking-info">
                    <h4>{v.Titre}</h4>
                    <p>Type : {v.TypeTransaction.toUpperCase()} | Prix de base : {v.PrixBase} €</p>
                  </div>
                  <Link to={`/produit/${v.NumProd}`} className="btn-secondary">Voir la page</Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
