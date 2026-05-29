<?php
class Negociation {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // 1. Créer ou récupérer un salon de négociation
    public function creerSalon($numProd, $numAcheteur) {
        // Vérifier si une négociation existe déjà
        $check = "SELECT NumNego FROM NEGOCIATION WHERE NumProd = :numProd AND NumU_Acheteur = :numAcheteur LIMIT 1";
        $stmtCheck = $this->conn->prepare($check);
        $stmtCheck->bindParam(":numProd", $numProd);
        $stmtCheck->bindParam(":numAcheteur", $numAcheteur);
        $stmtCheck->execute();
        
        if ($row = $stmtCheck->fetch(PDO::FETCH_ASSOC)) {
            return $row['NumNego'];
        }
        
        // Sinon créer un nouveau salon
        $query = "INSERT INTO NEGOCIATION (NumProd, NumU_Acheteur, Statut) VALUES (:numProd, :numAcheteur, 'en_cours')";
        $stmt = $this->conn->prepare($query);
        
        $stmt->bindParam(":numProd", $numProd);
        $stmt->bindParam(":numAcheteur", $numAcheteur);
        
        if($stmt->execute()) {
            return $this->conn->lastInsertId();
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
            if ($stmt->execute()) {
                // Notifier l'autre partie
                $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu)
                          SELECT 'Négociation', 'Nouveau message ou offre dans votre salle de négociation', 
                                 IF(NumU_Acheteur = :expediteur, p.NumU_Vendeur, NumU_Acheteur), 
                                 CONCAT('/nego/', NumNego), 0 
                          FROM NEGOCIATION n JOIN PRODUIT p ON n.NumProd = p.NumProd 
                          WHERE NumNego = :numNego LIMIT 1";
                $stmtNotif = $this->conn->prepare($notif);
                $stmtNotif->bindParam(":expediteur", $numU);
                $stmtNotif->bindParam(":numNego", $numNego);
                $stmtNotif->execute();
                return true;
            }
            return false;
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