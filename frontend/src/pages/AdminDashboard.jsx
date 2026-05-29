import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSignalements } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Settings, Power } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadData = async () => {
      const res = await getSignalements();
      if (res && res.status === 'success') {
        setSignalements(res.data);
      }
      setLoading(false);
    };

    loadData();
  }, [user, navigate]);

  if (loading) return <div className="loading">Chargement du panneau admin...</div>;

  const getActionColor = (action) => {
    if (action === 'SUSPENDRE') return 'text-red';
    if (action === 'MÉRITE EXAMEN') return 'text-green';
    return 'text-gray';
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2 className="admin-brand">ADMIN - MERCATO NOVA.</h2>
        <div className="admin-icons">
          <Settings />
          <Power onClick={() => { logout(); navigate('/'); }} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div className="admin-content">
        <span className="subtitle">MODÉRATION & GESTION DU SYSTÈME</span>
        
        <div className="admin-info-box">
          <div className="big-number">
            <h1>{String(signalements.length).padStart(2, '0')}</h1>
            <span>Signalements<br/>prioritaires</span>
          </div>
          <div className="admin-desc">
            <p>Interface de surveillance globale des flux transactionnels. Ce panneau permet aux administrateurs d'intervenir sur les litiges d'enchères et de modérer les messages de négociation inappropriés.</p>
            <h4>UTILISATEURS</h4>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type d'alerte</th>
              <th>Utilisateur cible</th>
              <th>Date du signalement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {signalements.map((sig, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'row-light' : 'row-dark'}>
                <td>#REF{sig.ID}</td>
                <td>{sig.TypeAlerte}</td>
                <td>{sig.UtilisateurCible}</td>
                <td>{new Date(sig.DateSignalement).toLocaleString('fr-FR', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
                })}</td>
                <td className={`action-cell ${getActionColor(sig.Action)}`}>{sig.Action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
