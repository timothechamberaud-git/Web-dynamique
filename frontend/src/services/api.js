// src/services/api.js
// Configuration de l'API locale. Assurez-vous que l'URL correspond à votre serveur local.
// Par défaut, nous utilisons l'URL classique pour WAMP/XAMPP avec le dossier du projet.
const API_BASE_URL = 'http://localhost/Web-dynamique/backend/public/index.php';

export const getProductsFromDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/produits`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Erreur de connexion à l'API PHP :", error);
    throw error;
  }
};

export const placeBid = async (productId, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enchere`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ produit_id: productId, montant: amount })
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la soumission de l'enchère :", error);
    throw error;
  }
};
