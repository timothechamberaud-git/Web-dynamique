// Ce fichier remplacera apiMock.js lors de l'intégration finale avec le Backend PHP

// URL de base de notre API REST (à adapter selon la configuration de votre serveur local)
const API_BASE_URL = 'http://localhost/Mercato-Nova/backend/public/api';

export const getProductsFromDatabase = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Erreur de connexion à l'API PHP :", error);
    throw error;
  }
};

// La future fonction pour lancer une enchère vers la base de données MySQL
export const placeBid = async (productId, amount) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/bid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ bid_amount: amount })
    });
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la soumission de l'enchère :", error);
    throw error;
  }
};
