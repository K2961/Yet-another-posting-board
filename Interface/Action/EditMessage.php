<?php
session_start();
$userId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : -1;
if ($userId === -1)
{
	exit();
}

require_once("Database.class.php");
$database = new Database();
$messageId = $_REQUEST["id"];
$text = $_REQUEST["text"];
$result = $database->editMessage($messageId, $userId, $text);
$response = json_encode($result);
header("Content-type: application/json");
echo $response;
