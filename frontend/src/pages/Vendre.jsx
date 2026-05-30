import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postProduit } from '../services/api';
import './Vendre.css';

const Vendre = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    Titre: '',
    Etat: 'Neuf',
    TypeTransaction: 'achat',
    PrixBase: '',
    NumCat: 1,
    PhotoUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...formData,
        NumU_Vendeur: user.id,
        PrixBase: Number(formData.PrixBase),
        NumCat: Number(formData.NumCat)
      };
      
      const res = await postProduit(payload);
      if (res && res.status === 'success') {
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Erreur lors de la mise en vente.');
      }
    } catch (err) {
      setError('Erreur réseau.');
    }
    setLoading(false);
  };

  return (
    <div className="vendre-page">
      <div className="vendre-container">
        <h2 className="vendre-title">METTRE UN PRODUIT EN VENTE</h2>
        <p className="vendre-subtitle">Remplissez les informations ci-dessous pour proposer votre article à la communauté Mercato Nova.</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="vendre-form">
          <div className="form-group">
            <label>Titre de l'article</label>
            <input 
              type="text" 
              name="Titre" 
              placeholder="Ex: Vélo Trek Vintage" 
              value={formData.Titre} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Catégorie</label>
              <select name="NumCat" value={formData.NumCat} onChange={handleChange}>
                <option value="1">Vélos & Cyclisme</option>
                <option value="2">Maillots & Vêtements</option>
                <option value="3">Équipements Sportifs</option>
                <option value="4">Autre</option>
              </select>
            </div>
            <div className="form-group">
              <label>État de l'article</label>
              <select name="Etat" value={formData.Etat} onChange={handleChange}>
                <option value="Neuf">Neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Usagé">Usagé</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Type de vente</label>
              <select name="TypeTransaction" value={formData.TypeTransaction} onChange={handleChange}>
                <option value="achat">Achat immédiat (Prix fixe)</option>
                <option value="enchere">Enchère (7 jours)</option>
                <option value="nego">Négociation (Offres libres)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Prix de base (€)</label>
              <input 
                type="number" 
                name="PrixBase" 
                placeholder="Ex: 150" 
                min="1" 
                step="0.01"
                value={formData.PrixBase} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Lien de l'image (URL) - Optionnel</label>
            <input 
              type="url" 
              name="PhotoUrl" 
              placeholder="Ex: https://exemple.com/image.jpg" 
              value={formData.PhotoUrl} 
              onChange={handleChange} 
            />
          </div>

          <div className="form-info">
            <p><strong>Note concernant les images :</strong> Collez directement le lien (URL) d'une image trouvée sur internet. Si vous laissez ce champ vide, une image par défaut sera automatiquement attribuée.</p>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
            {loading ? 'Création en cours...' : 'CONFIRMER LA MISE EN VENTE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Vendre;
