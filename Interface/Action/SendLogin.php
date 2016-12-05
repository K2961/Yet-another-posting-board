<?php
require_once("Database.class.php");
$database = new Database();
$name = $_POST["name"];
$password = $_POST["password"];
$user = $database->authenticateUser($name, $password);
if ($user !== null)
{
    session_start();
    $_SESSION["user"] = $user;
}
$response = json_encode($user);
header("Content-type: application/json");
echo $response;
exit();
