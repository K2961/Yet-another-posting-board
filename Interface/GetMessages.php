<?php
require_once("Database.class.php");
$db = new Database();
$messages = $db->getMessages(1);
$response = json_encode($messages);
header('Content-type: application/json');
echo $response;