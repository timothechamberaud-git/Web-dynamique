<?php
try {
    $db = new PDO('mysql:host=localhost;dbname=mercato_nova', 'root', '');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $hash = password_hash('password123', PASSWORD_BCRYPT);
    $stmt = $db->prepare("UPDATE UTILISATEUR SET MotDePasse = :hash WHERE Email='admin@nova.com'");
    $stmt->execute(['hash' => $hash]);
    echo "Password updated successfully.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
