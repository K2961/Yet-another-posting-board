<?php
require_once("Database.class.php");
$database = new Database();
$name = $_POST["name"];
$password = $_POST["password"];
$result = $database->authenticateUser($name, $password);
if ($result !== null)
{
    session_start();
    $_SESSION["user"] = $result["user"];
}
$response = json_encode($result);
header("Content-type: application/json");
echo $response;
exit();
