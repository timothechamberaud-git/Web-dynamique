<?php
// Autoriser React à communiquer avec l'API (CORS)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion des requêtes "Preflight" (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Connexion BDD
require_once '../config/Database.php';
$database = new Database();
$db = $database->getConnection();

// Analyse de l'URL pour trouver la route demandée
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);
$endpoint = end($uri);
$method = $_SERVER['REQUEST_METHOD'];

// --- ROUTES DE L'API ---

// GET /produits -> Catalogue
if ($endpoint === 'produits' && $method === 'GET') {
    require_once '../controllers/ProduitController.php';
    $controller = new ProduitController($db);
    $controller->getProduits();
} 
// POST /register -> Inscription
elseif ($endpoint === 'register' && $method === 'POST') {
    require_once '../controllers/AuthController.php';
    $controller = new AuthController($db);
    $controller->register();
} 
// POST /login -> Connexion
elseif ($endpoint === 'login' && $method === 'POST') {
    require_once '../controllers/AuthController.php';
    $controller = new AuthController($db);
    $controller->login();
} 
// Erreur 404 -> Route non trouvée
else {
    http_response_code(404);
    echo json_encode([
        "status" => "error", 
        "message" => "Route introuvable."
    ]);
}
?>