import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    achats: 0,
    encheres_suivies: 0,
    negociations: 0,
    mes_ventes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadStats = async () => {
      const res = await getUserStats(user.id);
      if (res && res.status === 'success') {
        setStats(res.data);
      }
      setLoading(false);
    };

    loadStats();
  }, [user, navigate]);

  if (loading) return <div className="loading">Chargement du dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <span className="subtitle">MON DASHBOARD</span>
        <div className="user-info-section">
          <div className="user-avatar"></div>
          <div className="user-details">
            <h2>Bonjour, {user?.prenom}</h2>
            <p>Membre Premium depuis 2026</p>
          </div>
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

      <div className="dashboard-actions">
        <h3>Accès rapides</h3>
        <div className="action-buttons">
          <Link to="/catalogue" className="btn-secondary">Explorer les Enchères</Link>
          <Link to="/catalogue" className="btn-primary">Poursuivre mes Négociations</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
