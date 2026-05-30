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
                    "prix" => isset($PrixActuelCalc) ? $PrixActuelCalc : $PrixBase,
                    "categorie" => $NomCat,
                    "vendeur" => $NomVendeur,
                    "NumU_Vendeur" => $NumU_Vendeur,
                    "StatutVente" => $StatutVente,
                    "PhotoUrl" => isset($PhotoUrl) ? $PhotoUrl : null
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

    public function ajouter() {
        $data = json_decode(file_get_contents("php://input"));
        if (!empty($data->Titre) && !empty($data->PrixBase) && !empty($data->NumU_Vendeur) && !empty($data->TypeTransaction)) {
            $query = "INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur, PhotoUrl) 
                      VALUES (:titre, :etat, :type_transaction, :prix, :numCat, :numU_Vendeur, :photoUrl)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":titre", $data->Titre);
            $stmt->bindParam(":etat", $data->Etat);
            $stmt->bindParam(":type_transaction", $data->TypeTransaction);
            $stmt->bindParam(":prix", $data->PrixBase);
            $cat = !empty($data->NumCat) ? $data->NumCat : 1;
            $stmt->bindParam(":numCat", $cat);
            $stmt->bindParam(":numU_Vendeur", $data->NumU_Vendeur);
            $photo = !empty($data->PhotoUrl) ? $data->PhotoUrl : null;
            $stmt->bindParam(":photoUrl", $photo);
            
            if ($stmt->execute()) {
                $numProd = $this->db->lastInsertId();
                if ($data->TypeTransaction === 'enchere') {
                    $queryEnc = "INSERT INTO ENCHERE (DateFin, PrixActuel, NumProd) VALUES (DATE_ADD(NOW(), INTERVAL 5 MINUTE), :prix, :numProd)";
                    $stmtEnc = $this->db->prepare($queryEnc);
                    $stmtEnc->bindParam(":prix", $data->PrixBase);
                    $stmtEnc->bindParam(":numProd", $numProd);
                    $stmtEnc->execute();
                }
                http_response_code(201);
                echo json_encode(["status" => "success", "message" => "Produit ajouté."]);
            } else {
                http_response_code(503);
                echo json_encode(["status" => "error", "message" => "Erreur lors de l'ajout."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Données incomplètes."]);
        }
    }
}
?>