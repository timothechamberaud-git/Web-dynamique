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
}
?>