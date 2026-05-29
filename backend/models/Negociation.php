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

    // Accepter une offre (Etape 1 : Accord sur le prix, en attente de paiement)
    public function accepterOffre($numNego, $montantAccepte, $numU_Accepteur) {
        $this->conn->beginTransaction();
        try {
            // 1. Update Nego status
            $q1 = "UPDATE NEGOCIATION SET Statut = 'acceptee' WHERE NumNego = :numNego";
            $s1 = $this->conn->prepare($q1);
            $s1->bindParam(":numNego", $numNego);
            $s1->execute();

            // 2. Add a system message to the Nego (to save the amount for the payment step)
            $msg = "Offre de " . $montantAccepte . " € acceptée ! En attente du paiement de l'acheteur.";
            // We use MontantProp to store the accepted amount cleanly for the frontend/backend to retrieve
            $q5 = "INSERT INTO MESSAGE_NEGO (NumNego, NumU_Expediteur, Contenu, MontantProp) VALUES (:numNego, :accepteur, :msg, :montant)";
            $s5 = $this->conn->prepare($q5);
            $s5->bindParam(":numNego", $numNego);
            $s5->bindParam(":accepteur", $numU_Accepteur);
            $s5->bindParam(":msg", $msg);
            $s5->bindParam(":montant", $montantAccepte);
            $s5->execute();

            // 3. Notify the OTHER party
            $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu)
                      SELECT 'Négociation', 'Une offre a été acceptée ! Le paiement est en attente.', 
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

    // Payer une offre acceptée (Etape 2 : Création de la commande)
    public function payerOffre($numNego, $montantPaye, $numU_Acheteur) {
        $this->conn->beginTransaction();
        try {
            // 1. Check if nego is 'acceptee' and belongs to this buyer
            $qCheck = "SELECT NumProd FROM NEGOCIATION WHERE NumNego = :numNego AND NumU_Acheteur = :acheteur AND Statut = 'acceptee'";
            $sCheck = $this->conn->prepare($qCheck);
            $sCheck->bindParam(":numNego", $numNego);
            $sCheck->bindParam(":acheteur", $numU_Acheteur);
            $sCheck->execute();
            if(!($negoInfo = $sCheck->fetch(PDO::FETCH_ASSOC))) {
                return false;
            }
            $numProd = $negoInfo['NumProd'];

            // 2. Update Nego status
            $q1 = "UPDATE NEGOCIATION SET Statut = 'payee' WHERE NumNego = :numNego";
            $s1 = $this->conn->prepare($q1);
            $s1->bindParam(":numNego", $numNego);
            $s1->execute();

            // 3. Insert into COMMANDE
            $q3 = "INSERT INTO COMMANDE (NumU_Acheteur, MontantTotal) VALUES (:acheteur, :montant)";
            $s3 = $this->conn->prepare($q3);
            $s3->bindParam(":acheteur", $numU_Acheteur);
            $s3->bindParam(":montant", $montantPaye);
            $s3->execute();
            $numCmd = $this->conn->lastInsertId();

            // 4. Insert into CONTIENT
            $q4 = "INSERT INTO CONTIENT (NumCmd, NumProd, Quantite, PrixUnit) VALUES (:cmd, :prod, 1, :montant)";
            $s4 = $this->conn->prepare($q4);
            $s4->bindParam(":cmd", $numCmd);
            $s4->bindParam(":prod", $numProd);
            $s4->bindParam(":montant", $montantPaye);
            $s4->execute();

            // 5. Add a system message
            $msg = "Le paiement de " . $montantPaye . " € a été validé ! Vente conclue définitivement.";
            $q5 = "INSERT INTO MESSAGE_NEGO (NumNego, NumU_Expediteur, Contenu) VALUES (:numNego, :acheteur, :msg)";
            $s5 = $this->conn->prepare($q5);
            $s5->bindParam(":numNego", $numNego);
            $s5->bindParam(":acheteur", $numU_Acheteur);
            $s5->bindParam(":msg", $msg);
            $s5->execute();

            // 6. Notify the seller
            $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu)
                      SELECT 'Vente Conclue', 'Votre produit a été payé suite à une négociation !', 
                             p.NumU_Vendeur, CONCAT('/nego/', :numNego2), 0 
                      FROM NEGOCIATION n JOIN PRODUIT p ON n.NumProd = p.NumProd 
                      WHERE NumNego = :numNego3 LIMIT 1";
            $s6 = $this->conn->prepare($notif);
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