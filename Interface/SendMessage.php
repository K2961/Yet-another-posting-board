<?php
session_start();
$userId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : -1;
if ($userId === -1)
{
	exit();
}

require_once("Database.class.php");
$database = new Database();
$topicId = 1;
$text = $_REQUEST["msg"];
$database->sendMessage($topicId, $userId, $text);