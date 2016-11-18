<?php
require_once("PathInit.php");
require_once(DB_INIT_PATH);

class Database
{
    private $pdo;
    
    function __construct()
    {
        $this->pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASSWORD);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
    
    function sendMessage($userId, $text)
    {
        $query = <<<SQL
        INSERT INTO Message(TopicId, UserId, Text, Posted)
        VALUES (:userid, 1, :text, NOW());
SQL;
        
        $result = $this->pdo->prepare($query);
        $result->bindValue(':userid', $userId, PDO::PARAM_INT);
        $result->bindValue(':text', $text, PDO::PARAM_STR);
        $result->execute();
    }
    
    function deleteMessage($messageId)
    {
        $query = <<<SQL
        DELETE FROM Message 
        WHERE Id = :id;
SQL;
        $result = $this->pdo->prepare($query);
        $result->bindValue(':id', $messageId, PDO::PARAM_INT);
        $result->execute();
    }
    
    function getTopic($topicId)
    {
        $topic = array();
        $statement = $this->pdo->query("SELECT * FROM Topic WHERE Id='$topicId'");
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
        {
            $topic["title"] = $row["Title"];
        }
        return $topic;
    }
    
    function getMessages($topicId)
    {
        $messages = array();
        $statement = $this->pdo->query("SELECT * FROM Message");
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
        {
            $userId = $row["UserId"];
            $user = $this->getUser($userId);

            $messages[] = array (
                "id" => $row["Id"],
                "avatar" => $user["AvatarUrl"],
                "userName" => $user["Name"],
                "text" => $row["Text"],
                "posted" => $row["Posted"],
            );
        }
        return $messages;
    }
    
    function getUser($userID)
    {
        $statement = $this->pdo->query("SELECT * FROM User WHERE Id=$userID");
        while ($row = $statement->fetch(PDO::FETCH_ASSOC))
        {
            return $row;
        }
        return null;
    }
    
    function addUser($name, $password, $avatarUrl)
    {
        $query = <<<SQL
        INSERT INTO User(Name, Password, AvatarUrl, Joined)
        VALUES (:name, :password, :avatarUrl, NOW());
SQL;
        
        $result = $this->pdo->prepare($query);
        $result->bindValue(':name', $name, PDO::PARAM_STR);
        $result->bindValue(':password', $password, PDO::PARAM_STR);
        $result->bindValue(':avatarUrl', $avatarUrl, PDO::PARAM_STR);
        $result->execute();
    }
}