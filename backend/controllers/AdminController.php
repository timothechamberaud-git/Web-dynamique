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
}
?>
