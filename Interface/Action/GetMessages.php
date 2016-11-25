<?php
require_once("Database.class.php");
$database = new Database();
$topicId = $_REQUEST["topicId"];
$messages = $database->getMessages($topicId);
$response = json_encode($messages);
header("Content-type: application/json");
echo $response;