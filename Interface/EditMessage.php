<?php
session_start();
$userId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : -1;
if ($userId === -1)
{
	exit();
}

require_once("Database.class.php");
$db = new Database();
$messageId = $_REQUEST["id"];
$text = $_REQUEST["text"];
$db->editMessage($messageId, $userId, $text);