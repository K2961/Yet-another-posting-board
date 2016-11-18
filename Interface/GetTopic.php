<?php
require_once("Database.class.php");
$db = new Database();
$response = json_encode($db->getTopic(1));
header('Content-type: application/json');
echo $response;