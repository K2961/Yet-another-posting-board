<?php
require_once("Database.class.php");
$database = new Database();
$messages = $database->getMessages(1);
$response = json_encode($messages);
header("Content-type: application/json");
echo $response;