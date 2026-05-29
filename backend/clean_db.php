<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=mercato_nova;charset=utf8mb4', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Disable foreign key checks
    $db->exec("SET FOREIGN_KEY_CHECKS = 0;");
    
    // Empty all transactional tables
    $tables = ['SIGNALEMENT', 'NOTIFICATION', 'CONTIENT', 'COMMANDE', 'MESSAGE_NEGO', 'NEGOCIATION', 'OFFRE', 'ENCHERE', 'PRODUIT'];
    foreach ($tables as $table) {
        $db->exec("TRUNCATE TABLE $table;");
    }
    
    // Keep Categories, but maybe empty Users except Admin
    $db->exec("DELETE FROM UTILISATEUR WHERE Email != 'admin@nova.com';");
    $db->exec("ALTER TABLE UTILISATEUR AUTO_INCREMENT = 2;");
    
    // Re-enable foreign key checks
    $db->exec("SET FOREIGN_KEY_CHECKS = 1;");
    
    echo "Database cleaned and ready for production.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
