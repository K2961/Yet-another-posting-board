<?php
require_once("Database.class.php");
$database = new Database();

$database->deleteAll();

$root = $database->addForum("Root");

$admin = $database->addUser("Admin", "INSERTPASSWORDHERE", "Test.png");

$database->addModerator($admin["id"], $root["id"]);
