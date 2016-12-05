<?php
session_start();
$moderatorUserId = isset($_SESSION["user"]) ? (int)$_SESSION["user"]["id"] : -1;
if ($moderatorUserId === -1)
{
	exit();
}

require_once("Database.class.php");
$database = new Database();
$targetUserId = $_REQUEST["id"];
$database->unbanUser($targetUserId, 1, $moderatorUserId);