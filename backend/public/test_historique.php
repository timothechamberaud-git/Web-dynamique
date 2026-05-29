<?php
require_once '../config/Database.php';
require_once '../controllers/NegociationController.php';

$db = new Database();
$conn = $db->getConnection();
$controller = new NegociationController($conn);

$controller->getHistorique(10);
