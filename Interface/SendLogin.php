<?php
require_once("Database.class.php");
$db = new Database();
$name = $_REQUEST["name"];
$password = $_REQUEST["password"];
$user = $db->authenticateUser($name, $password);
if ($user !== null)
{
    $response = json_encode($user);
    header('Content-type: application/json');
    echo $response;
}