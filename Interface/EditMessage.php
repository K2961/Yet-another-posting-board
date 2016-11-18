<?php
require_once("Database.class.php");
$db = new Database();
$messageId = $_REQUEST["id"];
$text = $_REQUEST["text"];
$db->editMessage($messageId, $text);