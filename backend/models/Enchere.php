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
        $enchere = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($enchere) {
            // Get winner
            $qWinner = "SELECT NumU_Acheteur, Montant FROM OFFRE WHERE NumEnchere = :ne ORDER BY Montant DESC LIMIT 1";
            $sWinner = $this->conn->prepare($qWinner);
            $sWinner->bindParam(":ne", $enchere['NumEnchere']);
            $sWinner->execute();
            if ($winner = $sWinner->fetch(PDO::FETCH_ASSOC)) {
                $enchere['WinnerId'] = $winner['NumU_Acheteur'];
                $enchere['WinnerMontant'] = $winner['Montant'];
            }

            // Check if paid
            $qPaid = "SELECT COUNT(*) as c FROM CONTIENT WHERE NumProd = :np";
            $sPaid = $this->conn->prepare($qPaid);
            $sPaid->bindParam(":np", $numProd);
            $sPaid->execute();
            $enchere['IsPaid'] = $sPaid->fetch(PDO::FETCH_ASSOC)['c'] > 0;
        }

        return $enchere;
    }

    // Placer une offre (dans la table OFFRE)
    public function placerOffre($numEnchere, $numU, $montant) {
        try {
            $this->conn->beginTransaction();

            $query = "INSERT INTO OFFRE (NumEnchere, NumU_Acheteur, Montant) VALUES (:numEnchere, :numU, :montant)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":numEnchere", $numEnchere);
            $stmt->bindParam(":numU", $numU);
            $stmt->bindParam(":montant", $montant);
            
            if ($stmt->execute()) {
                // Update PrixActuel in ENCHERE
                $qUpdate = "UPDATE ENCHERE SET PrixActuel = :montant WHERE NumEnchere = :numEnchere";
                $sUpdate = $this->conn->prepare($qUpdate);
                $sUpdate->bindParam(":montant", $montant);
                $sUpdate->bindParam(":numEnchere", $numEnchere);
                $sUpdate->execute();

                // Ajouter une notification au vendeur
                $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu) 
                          SELECT 'Nouvelle Enchère', CONCAT('Nouvelle offre de ', :montant, ' € sur votre enchère.'), p.NumU_Vendeur, CONCAT('/produit/', p.NumProd), 0 
                          FROM ENCHERE e JOIN PRODUIT p ON e.NumProd = p.NumProd 
                          WHERE e.NumEnchere = :numEnchere LIMIT 1";
                $stmtNotif = $this->conn->prepare($notif);
                $stmtNotif->bindParam(":montant", $montant);
                $stmtNotif->bindParam(":numEnchere", $numEnchere);
                $stmtNotif->execute();
                
                $this->conn->commit();
                return true;
            }
            $this->conn->rollBack();
            return false;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function payerEnchere($numEnchere, $numU, $numProd, $montant) {
        try {
            $this->conn->beginTransaction();

            // 1. Check if the user is actually the winner
            $qWinner = "SELECT NumU_Acheteur, Montant FROM OFFRE WHERE NumEnchere = :ne ORDER BY Montant DESC LIMIT 1";
            $sWinner = $this->conn->prepare($qWinner);
            $sWinner->bindParam(":ne", $numEnchere);
            $sWinner->execute();
            $winner = $sWinner->fetch(PDO::FETCH_ASSOC);

            if (!$winner || $winner['NumU_Acheteur'] != $numU) {
                throw new Exception("L'utilisateur n'est pas le gagnant.");
            }

            // 2. Check if already paid
            $qPaid = "SELECT COUNT(*) as c FROM CONTIENT WHERE NumProd = :np";
            $sPaid = $this->conn->prepare($qPaid);
            $sPaid->bindParam(":np", $numProd);
            $sPaid->execute();
            if ($sPaid->fetch(PDO::FETCH_ASSOC)['c'] > 0) {
                throw new Exception("L'enchère est déjà payée.");
            }

            // 3. Insert COMMANDE
            $stmtCmd = $this->conn->prepare("INSERT INTO COMMANDE (NumU_Acheteur, MontantTotal) VALUES (:numU, :montant)");
            $stmtCmd->bindParam(":numU", $numU);
            $stmtCmd->bindParam(":montant", $montant);
            $stmtCmd->execute();
            $numCmd = $this->conn->lastInsertId();

            // 4. Insert CONTIENT
            $stmtCont = $this->conn->prepare("INSERT INTO CONTIENT (NumCmd, NumProd, PrixUnit) VALUES (:numCmd, :numProd, :prix)");
            $stmtCont->bindParam(":numCmd", $numCmd);
            $stmtCont->bindParam(":numProd", $numProd);
            $stmtCont->bindParam(":prix", $montant);
            $stmtCont->execute();

            // 5. Notify the seller
            $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu) 
                      SELECT 'Enchère Payée', CONCAT('L\'acheteur a payé ', :montant, ' € pour l\'enchère.'), p.NumU_Vendeur, CONCAT('/produit/', p.NumProd), 0 
                      FROM PRODUIT p WHERE p.NumProd = :numProd LIMIT 1";
            $stmtNotif = $this->conn->prepare($notif);
            $stmtNotif->bindParam(":montant", $montant);
            $stmtNotif->bindParam(":numProd", $numProd);
            $stmtNotif->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            file_put_contents(__DIR__ . '/../public/error_log.txt', date('[Y-m-d H:i:s] ') . $e->getMessage() . "\n", FILE_APPEND);
            return false;
        }
    }
}
?>