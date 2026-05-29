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
    public function envoyerMessage($numNego, $numU, $contenu, $montantProp = null) {
        $query = "INSERT INTO MESSAGE_NEGO (NumNego, NumU_Expediteur, Contenu, MontantProp) VALUES (:numNego, :numU, :contenu, :montantProp)";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":numNego", $numNego);
        $stmt->bindParam(":numU", $numU);
        $stmt->bindParam(":contenu", $contenu);
        $stmt->bindParam(":montantProp", $montantProp);
        
        try {
            return $stmt->execute();
        } catch(PDOException $e) {
            return false;
        }
    }

    // 3. Récupérer les messages d'un salon
    public function lireMessages($numNego) {
        $query = "SELECT * FROM MESSAGE_NEGO WHERE NumNego = :numNego ORDER BY DateMsg ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":numNego", $numNego);
        try {
            $stmt->execute();
        } catch(PDOException $e) {
            // handle silently
        }
        return $stmt;
    }
}
?>