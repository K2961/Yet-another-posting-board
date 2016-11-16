<?php
require_once("PathInit.php");
require_once(DB_INIT_PATH);
$db = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASSWORD);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

function getAvatar($db, $userID)
{
    $statement = $db->query("SELECT AvatarUrl FROM User WHERE Id=$userID");
    $avatar = "missing.png";
    while ($row = $statement->fetch(PDO::FETCH_ASSOC))
    {
        $avatar = $row;
    }
    return $avatar;
}

$messages = array();
$statement = $db->query('SELECT * FROM Message');
while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
{
    $userId = $row["UserId"];
    $avatar = getAvatar($db, $userId);
    
    $messages[] = array (
        "avatar" => $avatar,
        "text" => $row["Text"]
    );
}

$response = json_encode($messages);
header('Content-type: application/json');
echo $response;