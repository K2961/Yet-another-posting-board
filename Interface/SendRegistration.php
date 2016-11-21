<?php
require_once("Database.class.php");
$db = new Database();
$name = $_POST["name"];
$password = $_POST["password"];
$avatarUrl = "Test.png";
$user = $db->addUser($name, $password, $avatarUrl);
if ($user !== null)
{
    session_start();
    $_SESSION["user"] = $user;
    $response = json_encode($user);
    header('Content-type: application/json');
    echo $response;
}