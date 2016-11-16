<?php
require_once("/home/K1533/php_dbconfig/YAPB-DB-Init.php");
$db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASSWORD);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
$stmt = $db->query('SELECT * FROM Message');

$messages = array();

while($row = $stmt->fetch(PDO::FETCH_ASSOC)) 
{
    $messages[] = array (
        "avatar" => "test.png",
        "text" => $row["Text"]
    );
}

$response = json_encode($messages);
header('Content-type: application/json');
echo $response;
?>