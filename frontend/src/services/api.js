const API_BASE_URL = 'http://localhost/Web-dynamique/backend/public/index.php';

export const getProductsFromDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/produits`);
    if (!response.ok) throw new Error('Erreur de requête API');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Erreur de connexion à l'API PHP :", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur de connexion login :", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    throw error;
  }
};

export const getEnchere = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enchere?produit=${productId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching enchère:", error);
    return null;
  }
};

export const postOffre = async (offreData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enchere`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offreData)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur post offre:", error);
    throw error;
  }
};

export const initNego = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nego/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur init nego:", error);
    throw error;
  }
};

export const getHistoriqueNego = async (negoId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nego/historique?id=${negoId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching historique nego:", error);
    return null;
  }
};

export const postNegoMessage = async (msgData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/nego/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur post message nego:", error);
    throw error;
  }
};

export const getUserStats = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/dashboard?id=${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching stats:", error);
    return null;
  }
};

export const getNotifications = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/notifications?id=${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching notifs:", error);
    return null;
  }
};

export const markNotificationsAsRead = async (userId) => {
  try {
    await fetch(`${API_BASE_URL}/user/notifications/read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId })
    });
  } catch (error) {
    console.error("Erreur marking notifs:", error);
  }
};

export const getSignalements = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/signalements`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching signalements:", error);
    return null;
  }
};

export const getSuiviEncheres = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/suivi-encheres?id=${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching suivi encheres:", error);
    return null;
  }
};

export const getSuiviNegos = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/suivi-negos?id=${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching suivi negos:", error);
    return null;
  }
};

export const getMesVentes = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/mes-ventes?id=${userId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Erreur fetching mes ventes:", error);
    return null;
  }
};

export const postProduit = async (produitData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/produits/ajouter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(produitData)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur ajout produit:", error);
    throw error;
  }
};

export const validerCommande = async (commandeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/panier/valider`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commandeData)
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur validation commande:", error);
    throw error;
  }
};
