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

    // 1. Lire tous les produits avec les détails du vendeur et de la catégorie
    public function lireTous() {
        $query = "SELECT p.*, c.NomCat, v.Nom as NomVendeur,
                  CASE
                    WHEN EXISTS (SELECT 1 FROM CONTIENT WHERE NumProd = p.NumProd) THEN 'vendu'
                    WHEN EXISTS (SELECT 1 FROM NEGOCIATION WHERE NumProd = p.NumProd AND Statut IN ('acceptee', 'payee')) THEN 'vendu'
                    WHEN p.TypeTransaction = 'enchere' AND EXISTS (SELECT 1 FROM ENCHERE WHERE NumProd = p.NumProd AND DateFin < NOW()) THEN 'enchere_terminee'
                    ELSE 'disponible'
                  END as StatutVente,
                  COALESCE((SELECT PrixActuel FROM ENCHERE WHERE NumProd = p.NumProd), p.PrixBase) as PrixActuelCalc
                  FROM " . $this->table_name . " p
                  JOIN CATEGORIE c ON p.NumCat = c.NumCat
                  JOIN UTILISATEUR v ON p.NumU_Vendeur = v.NumU
                  ORDER BY p.NumProd DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
}
?>