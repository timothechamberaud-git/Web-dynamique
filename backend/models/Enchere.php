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
        
        if ($stmt->execute()) {
            // Ajouter une notification au vendeur
            $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu) 
                      SELECT 'Nouvelle Enchère', CONCAT('Nouvelle offre de ', :montant, ' € sur votre enchère.'), p.NumU_Vendeur, CONCAT('/produit/', p.NumProd), 0 
                      FROM ENCHERE e JOIN PRODUIT p ON e.NumProd = p.NumProd 
                      WHERE e.NumEnchere = :numEnchere LIMIT 1";
            $stmtNotif = $this->conn->prepare($notif);
            $stmtNotif->bindParam(":montant", $montant);
            $stmtNotif->bindParam(":numEnchere", $numEnchere);
            $stmtNotif->execute();
            
            return true;
        }
        return false;
    }
}
?>