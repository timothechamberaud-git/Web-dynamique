<?php
require_once '../models/Enchere.php';

class EnchereController {
    private $db;
    private $enchere;

    public function __construct($db) {
        $this->db = $db;
        $this->enchere = new Enchere($this->db);
    }

    public function getEnchere($numProd) {
        $data = $this->enchere->lireParProduit($numProd);
        if($data) {
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Aucune enchère trouvée."]);
        }
    }

    public function postOffre() {
        $data = json_decode(file_get_contents("php://input"));
        if($this->enchere->placerOffre($data->NumEnchere, $data->NumU, $data->Montant)) {
            echo json_encode(["status" => "success", "message" => "Offre placée."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Erreur lors de l'offre."]);
        }
    }

    public function payer() {
        $data = json_decode(file_get_contents("php://input"));
        file_put_contents(__DIR__ . '/../public/error_log.txt', date('[Y-m-d H:i:s] ') . json_encode($data) . "\n", FILE_APPEND);
        if(!empty($data->NumEnchere) && !empty($data->NumU) && !empty($data->NumProd) && !empty($data->Montant)) {
            if($this->enchere->payerEnchere($data->NumEnchere, $data->NumU, $data->NumProd, $data->Montant)) {
                echo json_encode(["status" => "success", "message" => "Enchère payée."]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Erreur lors du paiement."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données incomplètes."]);
        }
    }
}
?>