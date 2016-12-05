<?php
session_start();
$session = array();

$user = array(
	"id" => -1,
	"name" => "",
	"bans" => array()
);
if (isset($_SESSION["user"]))
{
	$user = $_SESSION["user"];
}
$session["user"] = $user;

$response = json_encode($session);
header("Content-type: application/json");
echo $response;
exit();
