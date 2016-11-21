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
    
    function sendMessage($topicId, $userId, $text)
    {
        $query = <<<SQL
        INSERT INTO Message(TopicId, UserId, Text, Posted)
        VALUES (:topicId, :userId, :text, NOW());
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':topicId', $topicId, PDO::PARAM_INT);
        $statement->bindValue(':userId', $userId, PDO::PARAM_INT);
        $statement->bindValue(':text', $text, PDO::PARAM_STR);
        $statement->execute();
    }
    
    function editMessage($messageId, $userId, $text)
    {
        $query = <<<SQL
        UPDATE Message
        SET Text = :text
        WHERE Id = :messageId AND UserId = :userId;
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':messageId', $messageId, PDO::PARAM_INT);
        $statement->bindValue(':userId', $userId, PDO::PARAM_INT);
        $statement->bindValue(':text', $text, PDO::PARAM_STR);
        $statement->execute();
    }
    
    function deleteMessage($messageId, $userId)
    {
        $query = <<<SQL
        DELETE FROM Message 
        WHERE Id = :messageId AND UserId = :userId;
SQL;
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':messageId', $messageId, PDO::PARAM_INT);
        $statement->bindValue(':userId', $userId, PDO::PARAM_INT);
        $statement->execute();
    }
    
    function getTopic($topicId)
    {
        $topic = array();
        $statement = $this->pdo->query("SELECT * FROM Topic WHERE Id=$topicId");
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
        {
            $topic["title"] = $row["Title"];
        }
        return $topic;
    }
    
    function getMessages($topicId)
    {
        $messages = array();
        $statement = $this->pdo->query("SELECT * FROM Message ORDER BY Posted DESC");
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
        {
            $userId = $row["UserId"];
            $user = $this->getUser($userId);

            $messages[] = array (
                "id" => $row["Id"],
                "avatar" => $user["AvatarUrl"],
                "userName" => $user["Name"],
                "text" => $row["Text"],
                "posted" => $row["Posted"]
            );
        }
        return $messages;
    }
    
    function getUser($userId)
    {
        $statement = $this->pdo->query("SELECT * FROM User WHERE Id=$userId");
        if ($row = $statement->fetch(PDO::FETCH_ASSOC))
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
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->bindValue(':password', $password, PDO::PARAM_STR);
        $statement->bindValue(':avatarUrl', $avatarUrl, PDO::PARAM_STR);
        $statement->execute();
		
		return $this->authenticateUser($name, $password);
    }
    
    function authenticateUser($name, $password)
    {
        $query = <<<SQL
        SELECT * FROM User
        WHERE Name=:name AND Password=:password
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->bindValue(':password', $password, PDO::PARAM_STR);
        $statement->execute();
        
        if ($row = $statement->fetch())
        {
            $user = array(
                "id" => $row["Id"],
                "name" => $row["Name"]
            );
            return $user;
        }
        return null;
        
    }
}