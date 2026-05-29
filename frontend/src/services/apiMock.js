// Données simulées pour le développement Frontend autonome
const mockProducts = [
  {
    id: "1",
    title: "Maillot Officiel FC Barcelone Dédicacé",
    description: "Maillot de match authentique du Barça. Une pièce de collection rare, idéale pour les passionnés du jeu catalan et les analystes des performances au Camp Nou.",
    price: 250.00,
    type: "enchere",
    endTime: "2026-05-30T21:00:00Z",
    seller: "Catalunya_Memorabilia",
    image: "barca-jersey.png"
  },
  {
    id: "2",
    title: "Vélo Trek Emonda Carbon",
    description: "Vélo de course ultra-léger. Parfait état, transmission Shimano Ultegra.",
    price: 1200.00,
    type: "negociation",
    seller: "Jean_Expert_75",
    image: "trek-bike.png"
  },
  {
    id: "3",
    title: "Lot 12 Balles de Tennis Head Pro",
    description: "Tubes sous pression, balles neuves pour surface dure ou terre battue.",
    price: 25.00,
    type: "achat",
    stock: 45,
    image: "tennis-balls.png"
  }
];

// Simule la récupération de tout le catalogue (avec un délai réseau de 500ms)
export const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockProducts);
    }, 500);
  });
};

// Simule la récupération d'un seul produit par son ID
export const fetchProductById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockProducts.find(p => p.id === id);
      if (product) {
        resolve(product);
      } else {
        reject(new Error("Produit non trouvé"));
      }
    }, 400);
  });
};
