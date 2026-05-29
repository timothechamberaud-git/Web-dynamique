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
                    "StatutVente" => $StatutVente
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
            $query = "INSERT INTO PRODUIT (Titre, Etat, TypeTransaction, PrixBase, NumCat, NumU_Vendeur) 
                      VALUES (:titre, :etat, :type_transaction, :prix, :numCat, :numU_Vendeur)";
            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":titre", $data->Titre);
            $stmt->bindParam(":etat", $data->Etat);
            $stmt->bindParam(":type_transaction", $data->TypeTransaction);
            $stmt->bindParam(":prix", $data->PrixBase);
            // Default to category 1 if not provided
            $cat = !empty($data->NumCat) ? $data->NumCat : 1;
            $stmt->bindParam(":numCat", $cat);
            $stmt->bindParam(":numU_Vendeur", $data->NumU_Vendeur);
            
            if ($stmt->execute()) {
                $numProd = $this->db->lastInsertId();
                if ($data->TypeTransaction === 'enchere') {
                    $dateFin = date('Y-m-d H:i:s', strtotime('+7 days'));
                    $queryEnc = "INSERT INTO ENCHERE (DateFin, PrixActuel, NumProd) VALUES (:dateFin, :prix, :numProd)";
                    $stmtEnc = $this->db->prepare($queryEnc);
                    $stmtEnc->bindParam(":dateFin", $dateFin);
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