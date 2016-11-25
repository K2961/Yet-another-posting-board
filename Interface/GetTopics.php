<?php
require_once("Database.class.php");
$database = new Database();
$response = json_encode($database->getTopics());
header("Content-type: application/json");
echo $response;