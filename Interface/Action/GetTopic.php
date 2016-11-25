<?php
require_once("Database.class.php");
$database = new Database();
$id = $_REQUEST["id"];
$response = json_encode($database->getTopic($id));
header("Content-type: application/json");
echo $response;