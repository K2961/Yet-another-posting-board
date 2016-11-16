<?php
require_once("/home/K1533/php_dbconfig/YAPB-DB-Init.php");
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