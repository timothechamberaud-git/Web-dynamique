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
        $query = "SELECT m.*, u.Nom as Expediteur 
                  FROM MESSAGE_NEGO m 
                  JOIN UTILISATEUR u ON m.NumU_Expediteur = u.NumU 
                  WHERE m.NumNego = :numNego 
                  ORDER BY m.DateMsg ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":numNego", $numNego);
        $stmt->execute();
        
        return $stmt;
    }

    // Accepter une offre
    public function accepterOffre($numNego, $montantAccepte, $numU_Accepteur) {
        $this->conn->beginTransaction();
        try {
            // 1. Update Nego status
            $q1 = "UPDATE NEGOCIATION SET Statut = 'acceptee' WHERE NumNego = :numNego";
            $s1 = $this->conn->prepare($q1);
            $s1->bindParam(":numNego", $numNego);
            $s1->execute();

            // 2. Fetch nego details
            $q2 = "SELECT NumProd, NumU_Acheteur FROM NEGOCIATION WHERE NumNego = :numNego";
            $s2 = $this->conn->prepare($q2);
            $s2->bindParam(":numNego", $numNego);
            $s2->execute();
            $negoInfo = $s2->fetch(PDO::FETCH_ASSOC);
            $numProd = $negoInfo['NumProd'];
            $acheteur = $negoInfo['NumU_Acheteur'];

            // 3. Insert into COMMANDE
            $q3 = "INSERT INTO COMMANDE (NumU_Acheteur, MontantTotal) VALUES (:acheteur, :montant)";
            $s3 = $this->conn->prepare($q3);
            $s3->bindParam(":acheteur", $acheteur);
            $s3->bindParam(":montant", $montantAccepte);
            $s3->execute();
            $numCmd = $this->conn->lastInsertId();

            // 4. Insert into CONTIENT
            $q4 = "INSERT INTO CONTIENT (NumCmd, NumProd, Quantite, PrixUnitaire) VALUES (:cmd, :prod, 1, :montant)";
            $s4 = $this->conn->prepare($q4);
            $s4->bindParam(":cmd", $numCmd);
            $s4->bindParam(":prod", $numProd);
            $s4->bindParam(":montant", $montantAccepte);
            $s4->execute();

            // 5. Add a system message to the Nego
            $msg = "Offre de " . $montantAccepte . " € acceptée ! Le produit a été vendu.";
            $q5 = "INSERT INTO MESSAGE_NEGO (NumNego, NumU_Expediteur, Contenu) VALUES (:numNego, :accepteur, :msg)";
            $s5 = $this->conn->prepare($q5);
            $s5->bindParam(":numNego", $numNego);
            $s5->bindParam(":accepteur", $numU_Accepteur);
            $s5->bindParam(":msg", $msg);
            $s5->execute();

            // 6. Notify the OTHER party
            $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu)
                      SELECT 'Négociation', 'Une offre a été acceptée dans votre salle !', 
                             IF(NumU_Acheteur = :accepteur, p.NumU_Vendeur, NumU_Acheteur), 
                             CONCAT('/nego/', :numNego2), 0 
                      FROM NEGOCIATION n JOIN PRODUIT p ON n.NumProd = p.NumProd 
                      WHERE NumNego = :numNego3 LIMIT 1";
            $s6 = $this->conn->prepare($notif);
            $s6->bindParam(":accepteur", $numU_Accepteur);
            $s6->bindParam(":numNego2", $numNego);
            $s6->bindParam(":numNego3", $numNego);
            $s6->execute();

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
?>