<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=mercato_nova;charset=utf8mb4', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    
    // Clear everything
    $tables = ['UTILISATEUR', 'CATEGORIE', 'PRODUIT', 'ENCHERE', 'NEGOCIATION', 'MESSAGE_NEGO', 'OFFRE', 'CONTIENT', 'COMMANDE', 'SIGNALEMENT', 'NOTIFICATION'];
    foreach ($tables as $table) {
        $db->exec("TRUNCATE TABLE $table;");
    }
    
    // Seed Users with EXACT IDs
    $hash = password_hash('password123', PASSWORD_BCRYPT);
    $db->exec("INSERT INTO UTILISATEUR (NumU, Nom, Prenom, Email, Role, MotDePasse) VALUES 
        (1, 'Expert_75', 'Jean', 'jean@expert.com', 'vendeur', '$hash'),
        (2, 'Nova', 'Acheteur', 'acheteur@nova.com', 'client', '$hash'),
        (3, 'Admin', 'Super', 'admin@nova.com', 'admin', '$hash')
    ");
    
    // Seed Categories
    $db->exec("INSERT INTO CATEGORIE (NumCat, NomCat) VALUES 
        (1, 'Football'), (2, 'Cyclisme'), (3, 'Tennis'), (4, 'Golf'), (5, 'Basketball')
    ");
    
    // Seed Products
    $db->exec("INSERT INTO PRODUIT (NumProd, Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) VALUES 
        (1, 'Maillot Vintage 98', 'Neuf', 'enchere', 145.00, 1, 1),
        (2, 'Vélo Trek Emonda Carbon', 'Très bon', 'nego', 1200.00, 2, 1),
        (3, 'Raquette Wilson Pro', 'Neuf', 'achat', 89.00, 3, 1),
        (4, 'Lot 12 Balles Golf', 'Neuf', 'achat', 25.00, 4, 1),
        (5, 'Nike Air Jordan 1 \"Vintage 85\"', 'Sous vide', 'enchere', 850.00, 5, 1)
    ");
    
    // Seed Auctions
    $db->exec("INSERT INTO ENCHERE (NumEnchere, DateFin, PrixActuel, NumProd) VALUES 
        (1, DATE_ADD(NOW(), INTERVAL 2 HOUR), 145.00, 1),
        (2, DATE_ADD(NOW(), INTERVAL 5 DAY), 850.00, 5)
    ");
    
    // Seed Negociation
    $db->exec("INSERT INTO NEGOCIATION (NumNego, Statut, NumU_Acheteur, NumProd) VALUES 
        (1, 'en_cours', 2, 2)
    ");
    
    // Seed Messages Nego
    $db->exec("INSERT INTO MESSAGE_NEGO (Contenu, NumNego, NumU_Expediteur) VALUES 
        ('Bonjour, je propose 1 300 € pour ce vélo.', 1, 2),
        ('Bonjour. C''est un peu bas au vu des options. Je propose 1 500 €', 1, 1)
    ");
    $db->exec("INSERT INTO MESSAGE_NEGO (Contenu, MontantProp, NumNego, NumU_Expediteur) VALUES 
        ('C''est ma dernière proposition.', 1450.00, 1, 2)
    ");

    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    
    echo "Base de donnees restauree avec succes !";
} catch (Exception $e) {
    echo "Erreur : " . $e->getMessage();
}
?>
