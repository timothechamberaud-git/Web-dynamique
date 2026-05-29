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

// GET /enchere?produit=X -> Voir l'enchère
elseif ($endpoint === 'enchere' && $method === 'GET') {
    require_once '../controllers/EnchereController.php';
    $controller = new EnchereController($db);
    $controller->getEnchere($_GET['produit']);
}
// POST /enchere -> Placer une offre
elseif ($endpoint === 'enchere' && $method === 'POST') {
    require_once '../controllers/EnchereController.php';
    $controller = new EnchereController($db);
    $controller->postOffre();
}
// POST /nego/init -> Créer un salon de négociation
elseif ($endpoint === 'init' && strpos($_SERVER['REQUEST_URI'], '/nego/init') !== false && $method === 'POST') {
    require_once '../controllers/NegociationController.php';
    $controller = new NegociationController($db);
    $controller->initier();
}
// POST /nego/message -> Envoyer un message
elseif ($endpoint === 'message' && strpos($_SERVER['REQUEST_URI'], '/nego/message') !== false && $method === 'POST') {
    require_once '../controllers/NegociationController.php';
    $controller = new NegociationController($db);
    $controller->message();
}
// GET /nego/historique?id=X -> Récupérer les messages d'un salon
elseif ($endpoint === 'historique' && strpos($_SERVER['REQUEST_URI'], '/nego/historique') !== false && $method === 'GET') {
    require_once '../controllers/NegociationController.php';
    $controller = new NegociationController($db);
    $controller->getHistorique($_GET['id']);
}

// POST /commande/valider -> Transformer le panier en commande
elseif ($endpoint === 'valider' && strpos($_SERVER['REQUEST_URI'], '/commande/valider') !== false && $method === 'POST') {
    require_once '../controllers/CommandeController.php';
    $controller = new CommandeController($db);
    $controller->validerPanier();
}
// GET /user/dashboard?id=X -> Stats Utilisateur
elseif ($endpoint === 'dashboard' && strpos($_SERVER['REQUEST_URI'], '/user/dashboard') !== false && $method === 'GET') {
    require_once '../controllers/UserController.php';
    $controller = new UserController($db);
    $controller->getStats($_GET['id'] ?? 0);
}
// GET /user/notifications?id=X -> Notifications Utilisateur
elseif ($endpoint === 'notifications' && strpos($_SERVER['REQUEST_URI'], '/user/notifications') !== false && $method === 'GET') {
    require_once '../controllers/UserController.php';
    $controller = new UserController($db);
    $controller->getNotifications($_GET['id'] ?? 0);
}
// POST /user/notifications/read -> Marquer comme lu
elseif ($endpoint === 'read' && strpos($_SERVER['REQUEST_URI'], '/user/notifications/read') !== false && $method === 'POST') {
    require_once '../controllers/UserController.php';
    $controller = new UserController($db);
    $data = json_decode(file_get_contents("php://input"));
    $controller->markNotificationsAsRead($data->id ?? 0);
}
// GET /admin/signalements -> Panneau Admin
elseif ($endpoint === 'signalements' && strpos($_SERVER['REQUEST_URI'], '/admin/signalements') !== false && $method === 'GET') {
    require_once '../controllers/AdminController.php';
    $controller = new AdminController($db);
    $controller->getSignalements();
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