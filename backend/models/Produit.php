<?php
class Produit {
    private $conn;
    private $table_name = "PRODUIT";

    // Propriétés de l'objet correspondant aux colonnes de ta table
    public $NumProd;
    public $Titre;
    public $Etat;
    public $TypeTransaction;
    public $PrixBase;
    public $NumCat;
    public $NumU_Vendeur;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Méthode pour récupérer tous les produits
    public function lireTous() {
        $query = "SELECT p.*, c.NomCat, u.Nom AS NomVendeur 
                  FROM " . $this->table_name . " p
                  LEFT JOIN CATEGORIE c ON p.NumCat = c.NumCat
                  LEFT JOIN UTILISATEUR u ON p.NumU_Vendeur = u.NumU
                  ORDER BY p.NumProd DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>