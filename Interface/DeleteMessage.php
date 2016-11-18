<?php
require_once("Database.class.php");
$db = new Database();
$messageId = $_REQUEST["id"];
$db->deleteMessage($messageId);