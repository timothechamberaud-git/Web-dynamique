<?php
require_once '../models/Commande.php';

class CommandeController {
    private $db;
    private $commande;

    public function __construct($db) {
        $this->db = $db;
        $this->commande = new Commande($this->db);
    }

    public function validerPanier() {
        // Récupération du JSON
        $data = json_decode(file_get_contents("php://input"));
        
        // On vérifie que le front nous envoie bien l'acheteur, le total, et un panier rempli
        if(!empty($data->NumU_Acheteur) && !empty($data->Total) && !empty($data->Panier) && is_array($data->Panier)) {
            
            // Appel du modèle
            if($this->commande->creerCommande($data->NumU_Acheteur, $data->Total, $data->Panier)) {
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "Commande validée avec succès."]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Erreur critique lors de la validation de la commande."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données du panier incomplètes."]);
        }
    }
}
?>