<?php
require_once '../models/Negociation.php';

class NegociationController {
    private $db;
    private $nego;

    public function __construct($db) {
        $this->db = $db;
        $this->nego = new Negociation($this->db);
    }

    // Créer un salon
    public function initier() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->NumProd) && !empty($data->NumU_Acheteur)) {
            $numNego = $this->nego->creerSalon($data->NumProd, $data->NumU_Acheteur);
            if($numNego) {
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "Salon créé.", "NumNego" => $numNego]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Impossible de créer le salon."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données incomplètes."]);
        }
    }

    // Envoyer un message
    public function message() {
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->NumNego) && !empty($data->NumU) && !empty($data->Contenu)) {
            $montantProp = isset($data->MontantProp) ? $data->MontantProp : null;
            if($this->nego->envoyerMessage($data->NumNego, $data->NumU, $data->Contenu, $montantProp)) {
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "Message envoyé."]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Erreur lors de l'envoi."]);
            }
        }
    }

    // Lire les messages (GET)
    public function getHistorique($numNego) {
        // Get NumProd for this nego
        $query = "SELECT NumProd FROM NEGOCIATION WHERE NumNego = :id";
        $stmtProd = $this->db->prepare($query);
        $stmtProd->bindParam(":id", $numNego);
        $stmtProd->execute();
        $numProd = null;
        if($row = $stmtProd->fetch(PDO::FETCH_ASSOC)) {
            $numProd = $row['NumProd'];
        }

        $stmt = $this->nego->lireMessages($numNego);
        $messages = array();
        
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($messages, $row);
        }
        
        http_response_code(200);
        echo json_encode(["status" => "success", "data" => $messages, "NumProd" => $numProd]);
    }
}
?>