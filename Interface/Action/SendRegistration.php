<?php
require_once "Database.class.php";
$database = new Database();
$name = $_POST["name"];
$password = $_POST["password"];
$avatarUrl = "Test.png";
$user = $database->addUser($name, $password, $avatarUrl);
if ($user !== null)
{
    session_start();
    $_SESSION["user"] = $user;
    $response = json_encode($user);
    header('Content-type: application/json');
    echo $response;
}