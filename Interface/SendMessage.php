<?php
session_start();
require_once("Database.class.php");
$db = new Database();
$topicId = 1;
$userId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : 1;
$text = $_REQUEST["msg"];
$db->sendMessage($topicId, $userId, $text);