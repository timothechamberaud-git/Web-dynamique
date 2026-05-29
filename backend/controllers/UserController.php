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
}
?>
