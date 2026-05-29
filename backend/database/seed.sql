USE mercato_nova;

-- Insérer des catégories
INSERT INTO CATEGORIE (NomCat) VALUES ('Football'), ('Cyclisme'), ('Tennis'), ('Golf'), ('Basketball') ON DUPLICATE KEY UPDATE NomCat=NomCat;

-- Insérer un utilisateur vendeur et un acheteur
INSERT IGNORE INTO UTILISATEUR (Nom, Prenom, Email, Role, MotDePasse) VALUES 
('Expert_75', 'Jean', 'jean@expert.com', 'vendeur', 'password123'),
('Nova', 'Acheteur', 'acheteur@nova.com', 'client', 'password123');

-- Insérer des produits
-- 1. Maillot Vintage (Enchère)
INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
('Maillot Vintage 98', 'Neuf', 'enchere', 145.00, 1, 1);

-- 2. Vélo Trek Carbon (Négociation)
INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
('Vélo Trek Emonda Carbon', 'Très bon', 'negociation', 1200.00, 2, 1);

-- 3. Raquette Wilson Pro (Achat direct)
INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
('Raquette Wilson Pro', 'Neuf', 'achat', 89.00, 3, 1);

-- 4. Lot 12 Balles Golf (Achat direct)
INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
('Lot 12 Balles Golf', 'Neuf', 'achat', 25.00, 4, 1);

-- 5. Air Jordan 1 (Enchère)
INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
('Nike Air Jordan 1 "Vintage 85"', 'Sous vide', 'enchere', 850.00, 5, 1);

-- Insérer des enchères pour les produits correspondants
INSERT INTO ENCHERE (DateFin, PrixActuel, NumProd) VALUES 
(DATE_ADD(NOW(), INTERVAL 2 HOUR), 145.00, 1),
(DATE_ADD(NOW(), INTERVAL 5 DAY), 850.00, 5);

-- Insérer une négociation pour le vélo
INSERT INTO NEGOCIATION (Statut, NumU_Acheteur, NumProd) VALUES 
('en_cours', 2, 2);

-- Insérer quelques messages de négociation (NumNego = 1)
INSERT INTO MESSAGE_NEGO (Contenu, NumNego, NumU_Expediteur) VALUES 
('Bonjour, je propose 1 300 € pour ce vélo.', 1, 2),
('Bonjour. C''est un peu bas au vu des options. Je propose 1 500 €', 1, 1);

INSERT INTO MESSAGE_NEGO (Contenu, MontantProp, NumNego, NumU_Expediteur) VALUES 
('C''est ma dernière proposition.', 1450.00, 1, 2);
