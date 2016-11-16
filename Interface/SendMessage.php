<?php
require_once("Database.class.php");
$db = new Database();
$text = $_REQUEST["msg"];
$db->sendMessage(1, $text);