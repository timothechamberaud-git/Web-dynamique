<?php
require_once '../models/Utilisateur.php';

class AuthController {
    private $db;
    private $utilisateur;

    public function __construct($db) {
        $this->db = $db;
        $this->utilisateur = new Utilisateur($this->db);
    }

    // 1. INSCRIPTION
    public function register() {
        // Récupérer les données envoyées en JSON (depuis React ou Postman)
        $data = json_decode(file_get_contents("php://input"));

        // Vérifier que les champs obligatoires ne sont pas vides
        if(!empty($data->Nom) && !empty($data->Prenom) && !empty($data->Email) && !empty($data->MotDePasse)) {
            
            // Assigner les valeurs au modèle
            $this->utilisateur->Nom = $data->Nom;
            $this->utilisateur->Prenom = $data->Prenom;
            $this->utilisateur->Email = $data->Email;
            $this->utilisateur->Role = isset($data->Role) ? $data->Role : 'client'; // Par défaut : client
            $this->utilisateur->MotDePasse = $data->MotDePasse;

            // Tenter l'inscription
            if($this->utilisateur->inscrire()) {
                http_response_code(201); // 201 = Created
                echo json_encode(["status" => "success", "message" => "Utilisateur créé avec succès."]);
            } else {
                http_response_code(503); // 503 = Service Unavailable (ou erreur SQL, ex: email déjà pris)
                echo json_encode(["status" => "error", "message" => "Impossible de créer l'utilisateur. L'email existe peut-être déjà."]);
            }
        } else {
            http_response_code(400); // 400 = Bad Request
            echo json_encode(["status" => "error", "message" => "Données incomplètes."]);
        }
    }

    // 2. CONNEXION
    public function login() {
        $data = json_decode(file_get_contents("php://input"));

        if(!empty($data->Email) && !empty($data->MotDePasse)) {
            
            $this->utilisateur->Email = $data->Email;
            // On cherche l'utilisateur en base de données
            $row = $this->utilisateur->lireParEmail();

            // Si l'email existe, on vérifie le mot de passe avec password_verify()
            if($row && password_verify($data->MotDePasse, $row['MotDePasse'])) {
                http_response_code(200); // 200 = OK
                
                // On renvoie les infos de l'utilisateur (SAUF le mot de passe bien sûr !)
                echo json_encode([
                    "status" => "success",
                    "message" => "Connexion réussie.",
                    "user" => [
                        "id" => $row['NumU'],
                        "nom" => $row['Nom'],
                        "prenom" => $row['Prenom'],
                        "email" => $row['Email'],
                        "role" => $row['Role']
                    ]
                ]);
            } else {
                // Mauvais email OU mauvais mot de passe (on ne précise pas lequel pour des raisons de sécurité)
                http_response_code(401); // 401 = Unauthorized
                echo json_encode(["status" => "error", "message" => "Identifiants incorrects."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Veuillez fournir un email et un mot de passe."]);
        }
    }
}
?>