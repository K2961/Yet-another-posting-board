<?php
require_once("Database.class.php");
$db = new Database();
$name = $_POST["name"];
$password = $_POST["password"];
$avatarUrl = "Test.png";
$db->addUser($name, $password, $avatarUrl);