<?php
class UserController {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function getStats($userId) {
        // 1. Achats (Nombre de commandes)
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM COMMANDE WHERE NumU_Acheteur = :uid");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        $achats = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 2. Enchères suivies (Nombre d'enchères distinctes sur lesquelles l'user a fait une offre)
        $stmt = $this->db->prepare("SELECT COUNT(DISTINCT NumEnchere) as count FROM OFFRE WHERE NumU_Acheteur = :uid");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        $encheres = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 3. Négociations (où il est acheteur OU vendeur du produit)
        $stmt = $this->db->prepare("SELECT COUNT(DISTINCT n.NumNego) as count 
                                    FROM NEGOCIATION n 
                                    JOIN PRODUIT p ON n.NumProd = p.NumProd 
                                    WHERE n.NumU_Acheteur = :uid OR p.NumU_Vendeur = :uid");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        $negociations = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        // 4. Mes Ventes (Nombre de produits créés par l'user)
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM PRODUIT WHERE NumU_Vendeur = :uid");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        $ventes = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

        http_response_code(200);
        echo json_encode([
            "status" => "success", 
            "data" => [
                "achats" => $achats,
                "encheres_suivies" => $encheres,
                "negociations" => $negociations,
                "mes_ventes" => $ventes
            ]
        ]);
    }

    public function getNotifications($userId) {
        $stmt = $this->db->prepare("SELECT * FROM NOTIFICATION WHERE NumU_Cible = :uid ORDER BY DateNotif DESC");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        
        $notifications = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $notifications[] = $row;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $notifications]);
    }

    public function markNotificationsAsRead($userId) {
        $stmt = $this->db->prepare("UPDATE NOTIFICATION SET Lu = TRUE WHERE NumU_Cible = :uid");
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        
        http_response_code(200);
        echo json_encode(["status" => "success"]);
    }

    public function getSuiviEncheres($userId) {
        $query = "SELECT DISTINCT e.NumEnchere, p.Titre, e.PrixActuel, p.NumProd 
                  FROM ENCHERE e
                  JOIN PRODUIT p ON e.NumProd = p.NumProd
                  JOIN OFFRE o ON o.NumEnchere = e.NumEnchere
                  WHERE o.NumU_Acheteur = :uid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        
        $encheres = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $encheres[] = $row;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $encheres]);
    }

    public function getSuiviNegos($userId) {
        $query = "SELECT n.NumNego, p.Titre, p.PrixBase, n.Statut, p.NumProd 
                  FROM NEGOCIATION n
                  JOIN PRODUIT p ON n.NumProd = p.NumProd
                  WHERE n.NumU_Acheteur = :uid OR p.NumU_Vendeur = :uid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        
        $negos = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $negos[] = $row;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $negos]);
    }

    public function getMesVentes($userId) {
        $query = "SELECT p.NumProd, p.Titre, p.TypeTransaction, p.PrixBase 
                  FROM PRODUIT p
                  WHERE p.NumU_Vendeur = :uid";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":uid", $userId);
        $stmt->execute();
        
        $ventes = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $ventes[] = $row;
        }

        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $ventes]);
    }
    public function updateProfile() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->NumU) && !empty($data->Nom) && !empty($data->Prenom) && !empty($data->Email)) {
            $query = "UPDATE UTILISATEUR SET Nom = :nom, Prenom = :prenom, Email = :email WHERE NumU = :numU";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":nom", $data->Nom);
            $stmt->bindParam(":prenom", $data->Prenom);
            $stmt->bindParam(":email", $data->Email);
            $stmt->bindParam(":numU", $data->NumU);
            
            if ($stmt->execute()) {
                // Récupérer l'utilisateur complet pour conserver le rôle
                $stmtGet = $this->db->prepare("SELECT NumU as id, Nom as nom, Prenom as prenom, Email as email, Role as role FROM UTILISATEUR WHERE NumU = :numU");
                $stmtGet->bindParam(":numU", $data->NumU);
                $stmtGet->execute();
                $fullUser = $stmtGet->fetch(PDO::FETCH_ASSOC);

                http_response_code(200);
                echo json_encode([
                    "status" => "success", 
                    "message" => "Profil mis à jour.",
                    "user" => $fullUser
                ]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Impossible de mettre à jour le profil."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données incomplètes."]);
        }
    }
}
?>
