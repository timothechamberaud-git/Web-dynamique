<?php
require_once __DIR__ . '/backend/config/Database.php';
require_once __DIR__ . '/backend/controllers/NegociationController.php';

$db = new Database();
$conn = $db->getConnection();
$controller = new NegociationController($conn);

$controller->getHistorique(10);
