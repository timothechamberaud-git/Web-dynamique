<?php
class Utilisateur {
    private $conn;
    private $table_name = "UTILISATEUR";

    // Propriétés correspondant aux colonnes de ta table SQL
    public $NumU;
    public $Nom;
    public $Prenom;
    public $Email;
    public $Role;
    public $MotDePasse;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. MÉTHODE POUR S'INSCRIRE (Créer un utilisateur)
    public function inscrire() {
        // Requête SQL d'insertion
        $query = "INSERT INTO " . $this->table_name . " 
                  SET Nom = :nom, Prenom = :prenom, Email = :email, Role = :role, MotDePasse = :motdepasse";

        $stmt = $this->conn->prepare($query);

        // Sécurisation des données (protection contre les failles XSS)
        $this->nom = htmlspecialchars(strip_tags($this->Nom));
        $this->prenom = htmlspecialchars(strip_tags($this->Prenom));
        $this->email = htmlspecialchars(strip_tags($this->Email));
        $this->role = htmlspecialchars(strip_tags($this->Role));
        
        // Hachage du mot de passe pour la sécurité (BCRYPT)
        $mot_de_passe_hashe = password_hash($this->MotDePasse, PASSWORD_BCRYPT);

        // Liaison des variables (Protection contre les injections SQL)
        $stmt->bindParam(":nom", $this->nom);
        $stmt->bindParam(":prenom", $this->prenom);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":role", $this->role);
        $stmt->bindParam(":motdepasse", $mot_de_passe_hashe);

        // Exécution de la requête
        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    // 2. MÉTHODE POUR LA CONNEXION (Chercher un utilisateur par son Email)
    public function lireParEmail() {
        $query = "SELECT NumU, Nom, Prenom, Email, Role, MotDePasse 
                  FROM " . $this->table_name . " 
                  WHERE Email = :email 
                  LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        
        $this->email = htmlspecialchars(strip_tags($this->Email));
        $stmt->bindParam(":email", $this->email);
        
        $stmt->execute();
        
        // Renvoie une ligne si l'utilisateur existe
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>