<?php
session_start();
require_once("Database.class.php");
$db = new Database();
$messageId = $_REQUEST["id"];
$userId = isset($_SESSION["user"]) ? $_SESSION["user"]["id"] : -1;
$db->deleteMessage($messageId, $userId);