<?php
class Enchere {
    private $conn;
    private $table_name = "ENCHERE";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Récupérer l'enchère d'un produit
    public function lireParProduit($numProd) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE NumProd = :numProd";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":numProd", $numProd);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Placer une offre (dans la table OFFRE)
    public function placerOffre($numEnchere, $numU, $montant) {
        $query = "INSERT INTO OFFRE (NumEnchere, NumU_Acheteur, Montant) VALUES (:numEnchere, :numU, :montant)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":numEnchere", $numEnchere);
        $stmt->bindParam(":numU", $numU);
        $stmt->bindParam(":montant", $montant);
        return $stmt->execute();
    }
}
?>