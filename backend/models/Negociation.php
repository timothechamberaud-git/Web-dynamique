<?php
class Negociation {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. Créer un salon de négociation
    public function creerSalon($numProd, $numAcheteur) {
        $query = "INSERT INTO NEGOCIATION (NumProd, NumU_Acheteur, Statut) VALUES (:numProd, :numAcheteur, 'En cours')";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":numProd", $numProd);
        $stmt->bindParam(":numAcheteur", $numAcheteur);
        
        if($stmt->execute()) {
            return $this->conn->lastInsertId(); // Renvoie le NumNego créé
        }
        return false;
    }

    // 2. Envoyer un message dans un salon
    public function envoyerMessage($numNego, $numU, $contenu) {
        $query = "INSERT INTO MESSAGE (NumNego, NumU, Contenu) VALUES (:numNego, :numU, :contenu)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":numNego", $numNego);
        $stmt->bindParam(":numU", $numU);
        $stmt->bindParam(":contenu", $contenu);
        
        return $stmt->execute();
    }

    // 3. Récupérer les messages d'un salon
    public function lireMessages($numNego) {
        $query = "SELECT * FROM MESSAGE WHERE NumNego = :numNego ORDER BY DateEnvoi ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":numNego", $numNego);
        $stmt->execute();
        return $stmt;
    }
}
?>