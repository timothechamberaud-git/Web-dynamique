<?php
class Commande {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Créer une commande et insérer les produits du panier
    public function creerCommande($numU_Acheteur, $total, $panier) {
        try {
            // 1. On démarre une "Transaction" (on bloque la base de données temporairement)
            $this->conn->beginTransaction();

            // 2. Création de la commande globale
            $queryCmd = "INSERT INTO COMMANDE (NumU_Acheteur, MontantTotal) VALUES (:numU, :total)";
            $stmtCmd = $this->conn->prepare($queryCmd);
            $stmtCmd->bindParam(":numU", $numU_Acheteur);
            $stmtCmd->bindParam(":total", $total);
            $stmtCmd->execute();

            // On récupère le Numéro de la commande qu'on vient tout juste de créer
            $numCmd = $this->conn->lastInsertId();

            // 3. Insertion de chaque produit dans la table CONTIENT
            $queryContient = "INSERT INTO CONTIENT (NumCmd, NumProd, Quantite, PrixUnit) VALUES (:numCmd, :numProd, :quantite, :prixUnitaire)";
            $stmtContient = $this->conn->prepare($queryContient);

            // On fait une boucle sur le panier envoyé par le Frontend
            foreach ($panier as $item) {
                $stmtContient->bindParam(":numCmd", $numCmd);
                $stmtContient->bindParam(":numProd", $item->NumProd);
                $stmtContient->bindParam(":quantite", $item->Quantite);
                $stmtContient->bindParam(":prixUnitaire", $item->Prix);
                $stmtContient->execute();
                
                // Ajouter une notification au vendeur
                $notif = "INSERT INTO NOTIFICATION (TypeNotif, Contenu, NumU_Cible, Lien, Lu) 
                          SELECT 'Vente', 'Un de vos produits a été acheté en direct !', NumU_Vendeur, CONCAT('/produit/', :numProd2), 0 
                          FROM PRODUIT WHERE NumProd = :numProd LIMIT 1";
                $stmtNotif = $this->conn->prepare($notif);
                $stmtNotif->bindParam(":numProd", $item->NumProd);
                $stmtNotif->bindParam(":numProd2", $item->NumProd);
                $stmtNotif->execute();
            }

            // 4. Si tout s'est bien passé, on valide la transaction définitivement
            $this->conn->commit();
            return true;

        } catch (Exception $e) {
            // S'il y a eu un bug (ex: produit inexistant), on annule absolument tout
            $this->conn->rollBack();
            return false;
        }
    }
}
?>