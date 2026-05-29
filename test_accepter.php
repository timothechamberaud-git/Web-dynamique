<?php
require_once __DIR__ . '/backend/config/Database.php';
require_once __DIR__ . '/backend/models/Negociation.php';

$db = new Database();
$conn = $db->getConnection();
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$nego = new Negociation($conn);
$res = $nego->accepterOffre(10, 600, 1);
var_dump($res);
