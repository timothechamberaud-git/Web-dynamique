<?php
class Database {
    // Paramètres de connexion classiques pour WAMP/XAMPP
    private $host = "localhost";
    private $db_name = "mercato_nova";
    private $username = "root";
    private $password = "";
    public $conn;

    // Méthode pour obtenir la connexion à la base de données
    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch(PDOException $exception) {
            echo "Erreur de connexion : " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>