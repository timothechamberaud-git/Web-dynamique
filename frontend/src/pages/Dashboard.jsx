import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserStats, getSuiviEncheres, getSuiviNegos, getMesVentes, updateProfile, deleteProduit } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ achats: 0, encheres_suivies: 0, negociations: 0, mes_ventes: 0 });
  const [encheres, setEncheres] = useState([]);
  const [negos, setNegos] = useState([]);
  const [ventes, setVentes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ Nom: '', Prenom: '', Email: '' });

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

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setProfileData({ Nom: user.nom || '', Prenom: user.prenom || '', Email: user.email || '' });
    loadData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ NumU: user.id, ...profileData });
      if (res && res.status === 'success') {
        updateUser(res.user);
        setIsEditingProfile(false);
        alert("Profil mis à jour avec succès !");
      } else {
        alert(res?.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      alert("Erreur réseau.");
    }
  };

  const handleDeleteProduit = async (numProd) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const res = await deleteProduit({ NumProd: numProd, NumU: user.id });
        if (res && res.status === 'success') {
          alert("Produit supprimé avec succès.");
          loadData(); // Recharger les données
        } else {
          alert(res?.message || "Erreur lors de la suppression.");
        }
      } catch (error) {
        alert("Erreur réseau.");
      }
    }
  };

  if (loading) return <div className="loading">Chargement du dashboard...</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <span className="subtitle">MON DASHBOARD</span>
        <div className="user-info-section" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className="user-avatar"></div>
            <div className="user-details">
              {!isEditingProfile ? (
                <>
                  <h2>Bonjour, {user?.prenom} {user?.nom}</h2>
                  <p>{user?.email}</p>
                  <button onClick={() => setIsEditingProfile(true)} className="btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', marginTop: '5px' }}>Modifier mon profil</button>
                </>
              ) : (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <input type="text" value={profileData.Prenom} onChange={e => setProfileData({...profileData, Prenom: e.target.value})} placeholder="Prénom" required />
                  <input type="text" value={profileData.Nom} onChange={e => setProfileData({...profileData, Nom: e.target.value})} placeholder="Nom" required />
                  <input type="email" value={profileData.Email} onChange={e => setProfileData({...profileData, Email: e.target.value})} placeholder="Email" required />
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="submit" className="btn-primary" style={{ padding: '5px 10px' }}>Enregistrer</button>
                    <button type="button" onClick={() => setIsEditingProfile(false)} className="btn-secondary" style={{ padding: '5px 10px' }}>Annuler</button>
                  </div>
                </form>
              )}
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
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Link to={`/produit/${v.NumProd}`} className="btn-secondary">Voir</Link>
                    <button onClick={() => handleDeleteProduit(v.NumProd)} className="btn-secondary" style={{ color: '#ff4d4f', borderColor: '#ff4d4f' }}>Supprimer</button>
                  </div>
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
