<?php
require_once "Database.class.php";
$database = new Database();
$name = $_POST["name"];
if ($name === "Admin") // Dirty hack, remove later.
	exit();

$password = $_POST["password"];
$avatarUrl = "Test.png";
$result = $database->addUser($name, $password, $avatarUrl);
if (isset($result["user"]))
{
    session_start();
    $_SESSION["user"] = $result["user"];
    $response = json_encode($result);
    header('Content-type: application/json');
    echo $response;
	exit();
}