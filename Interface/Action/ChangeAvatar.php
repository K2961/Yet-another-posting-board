<?php
session_start();
$userId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : -1;
if ($userId === -1)
{
	exit();
}

require_once("Database.class.php");
$database = new Database();
$avatarUrl = $_REQUEST["avatarUrl"];
$result = $database->changeAvatar($userId, $avatarUrl);
$response = json_encode($result);
header("Content-type: application/json");
echo $response;
