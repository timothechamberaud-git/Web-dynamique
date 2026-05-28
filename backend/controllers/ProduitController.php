<?php
require_once '../models/Produit.php';

class ProduitController {
    private $db;
    private $produit;

    public function __construct($db) {
        $this->db = $db;
        $this->produit = new Produit($this->db);
    }

    // Récupérer et formater la liste des produits
    public function getProduits() {
        $stmt = $this->produit->lireTous();
        $num = $stmt->rowCount();

        if($num > 0) {
            $produits_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                
                $produit_item = array(
                    "id" => $NumProd,
                    "titre" => $Titre,
                    "etat" => $Etat,
                    "type_vente" => $TypeTransaction,
                    "prix" => $PrixBase,
                    "categorie" => $NomCat,
                    "vendeur" => $NomVendeur
                );
                array_push($produits_arr, $produit_item);
            }

            http_response_code(200);
            echo json_encode(["status" => "success", "data" => $produits_arr]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Aucun produit trouvé."]);
        }
    }
}
?>