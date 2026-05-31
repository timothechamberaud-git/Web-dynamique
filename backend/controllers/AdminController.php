<?php
class AdminController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getSignalements() {
        $query = "SELECT s.NumSig as ID, s.TypeAlerte, u.Prenom as UtilisateurCible, s.DateSignalement, s.Statut as Action
                  FROM SIGNALEMENT s
                  JOIN UTILISATEUR u ON s.NumU_Cible = u.NumU
                  ORDER BY s.DateSignalement DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        
        $signalements = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $signalements[] = $row;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $signalements]);
    }
    public function getAllUsers() {
        $query = "SELECT NumU, Nom, Prenom, Email, Role, DateInscription FROM UTILISATEUR ORDER BY DateInscription DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $users = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $users[] = $row;
        }
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $users]);
    }

    public function getAllProducts() {
        $query = "SELECT p.NumProd, p.Titre, p.TypeTransaction, p.PrixBase, p.StatutVente, u.Prenom as Vendeur
                  FROM PRODUIT p
                  JOIN UTILISATEUR u ON p.NumU_Vendeur = u.NumU
                  ORDER BY p.NumProd DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $products = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $products[] = $row;
        }
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $products]);
    }

    public function deleteUser() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->NumU)) {
            // Attention: il faut gérer les clés étrangères. Pour l'urgence, on désactive les foreign keys temporairement ou on supprime en cascade.
            $this->db->exec("SET FOREIGN_KEY_CHECKS = 0");
            
            $stmt = $this->db->prepare("DELETE FROM UTILISATEUR WHERE NumU = :numU");
            $stmt->bindParam(":numU", $data->NumU);
            if ($stmt->execute()) {
                $this->db->exec("SET FOREIGN_KEY_CHECKS = 1");
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Utilisateur banni."]);
                return;
            }
            $this->db->exec("SET FOREIGN_KEY_CHECKS = 1");
        }
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Erreur suppression utilisateur."]);
    }

    public function deleteProduct() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->NumProd)) {
            $this->db->exec("SET FOREIGN_KEY_CHECKS = 0");
            
            $stmt = $this->db->prepare("DELETE FROM PRODUIT WHERE NumProd = :numProd");
            $stmt->bindParam(":numProd", $data->NumProd);
            if ($stmt->execute()) {
                $this->db->exec("SET FOREIGN_KEY_CHECKS = 1");
                http_response_code(200);
                echo json_encode(["status" => "success", "message" => "Produit supprimé."]);
                return;
            }
            $this->db->exec("SET FOREIGN_KEY_CHECKS = 1");
        }
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Erreur suppression produit."]);
    }
}
?>
