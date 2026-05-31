import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSignalements, getAllUsersAdmin, getAllProductsAdmin, deleteUserAdmin, deleteProductAdmin } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Settings, Power } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('signalements');

  const loadData = async () => {
    setLoading(true);
    const [resSig, resUsr, resProd] = await Promise.all([
      getSignalements(),
      getAllUsersAdmin(),
      getAllProductsAdmin()
    ]);
    if (resSig?.status === 'success') setSignalements(resSig.data);
    if (resUsr?.status === 'success') setUsers(resUsr.data);
    if (resProd?.status === 'success') setProducts(resProd.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const handleDeleteUser = async (numU) => {
    if (window.confirm("Bannir définitivement cet utilisateur ?")) {
      const res = await deleteUserAdmin(numU);
      if (res && res.status === 'success') {
        alert("Utilisateur banni.");
        loadData();
      } else {
        alert(res?.message || "Erreur");
      }
    }
  };

  const handleDeleteProduct = async (numProd) => {
    if (window.confirm("Supprimer définitivement ce produit ?")) {
      const res = await deleteProductAdmin(numProd);
      if (res && res.status === 'success') {
        alert("Produit supprimé.");
        loadData();
      } else {
        alert(res?.message || "Erreur");
      }
    }
  };

  if (loading) return <div className="loading">Chargement du panneau admin...</div>;

  const buyers = users.filter(u => u.Role !== 'admin' && u.Role !== 'vendeur');
  const sellers = users.filter(u => u.Role === 'vendeur');

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
        
        <div className="admin-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '30px', marginTop: '20px' }}>
          <button className={activeTab === 'signalements' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('signalements')}>Signalements</button>
          <button className={activeTab === 'acheteurs' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('acheteurs')}>Utilisateurs ({buyers.length})</button>
          <button className={activeTab === 'vendeurs' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('vendeurs')}>Vendeurs ({sellers.length})</button>
          <button className={activeTab === 'produits' ? 'btn-primary' : 'btn-secondary'} onClick={() => setActiveTab('produits')}>Produits ({products.length})</button>
        </div>

        {activeTab === 'signalements' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Type d'alerte</th><th>Cible</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {signalements.map((sig, idx) => (
                <tr key={idx}>
                  <td>#REF{sig.ID}</td>
                  <td>{sig.TypeAlerte}</td>
                  <td>{sig.UtilisateurCible}</td>
                  <td>{new Date(sig.DateSignalement).toLocaleString()}</td>
                  <td className="text-red">À TRAITER</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'acheteurs' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nom</th><th>Email</th><th>Inscription</th><th>Action</th></tr>
            </thead>
            <tbody>
              {buyers.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.NumU}</td>
                  <td>{u.Prenom} {u.Nom}</td>
                  <td>{u.Email}</td>
                  <td>{new Date(u.DateInscription).toLocaleDateString()}</td>
                  <td><button onClick={() => handleDeleteUser(u.NumU)} style={{color:'red', cursor:'pointer', border:'none', background:'none'}}>Bannir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'vendeurs' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Nom (Vendeur)</th><th>Email</th><th>Inscription</th><th>Action</th></tr>
            </thead>
            <tbody>
              {sellers.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.NumU}</td>
                  <td>{u.Prenom} {u.Nom}</td>
                  <td>{u.Email}</td>
                  <td>{new Date(u.DateInscription).toLocaleDateString()}</td>
                  <td><button onClick={() => handleDeleteUser(u.NumU)} style={{color:'red', cursor:'pointer', border:'none', background:'none'}}>Bannir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'produits' && (
          <table className="admin-table">
            <thead>
              <tr><th>ID Prod</th><th>Titre</th><th>Type</th><th>Vendeur</th><th>Statut</th><th>Action</th></tr>
            </thead>
            <tbody>
              {products.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.NumProd}</td>
                  <td>{p.Titre}</td>
                  <td>{p.TypeTransaction}</td>
                  <td>{p.Vendeur}</td>
                  <td>{p.StatutVente}</td>
                  <td><button onClick={() => handleDeleteProduct(p.NumProd)} style={{color:'red', cursor:'pointer', border:'none', background:'none'}}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
