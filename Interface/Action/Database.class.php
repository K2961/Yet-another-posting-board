<?php
require_once("PathConfig.php");
require_once(DATABASE_INIT_PATH);
require_once(PASSWORD_LIB_PATH);

class Database
{
    private $pdo;
	private $passwordLib;
    
    function __construct()
    {
        $this->pdo = new PDO("mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8", DB_USER, DB_PASSWORD);
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
		
		$this->passwordLib = new PasswordLib\PasswordLib();
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
    
    function getTopics()
    {
        $topics = array();
        $statement = $this->pdo->query("SELECT * FROM Topic");
        while ($topic = $statement->fetch(PDO::FETCH_ASSOC)) 
        {
			$userId = $topic["UserId"];
            $user = $this->getUser($userId);
			
			$messages = $this->getMessages($topic["Id"]);
			$lastPost = $topic["Posted"];
			if (count($messages) > 0)
			{
				$lastPost = $messages[0]["posted"];
			}
			
            $topics[] = array(
				"id" => $topic["Id"],
                "title" => $topic["Title"],
				"userName" => $user["Name"],
				"posted" => $topic["Posted"],
				"lastPost" => $lastPost
            );
        }
        return $topics;
    }
    
	function sendTopic($userId, $title)
    {
        $query = <<<SQL
        INSERT INTO Topic(UserId, ParentId, Title, Posted)
        VALUES (:userId, NULL, :title, NOW());
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':userId', $userId, PDO::PARAM_INT);
        $statement->bindValue(':title', $title, PDO::PARAM_STR);
        $statement->execute();
    }
	
	function deleteTopic($id, $userId)
	{
		$query = <<<SQL
		SELECT * FROM Topic
		WHERE Id = :id AND UserId = :userId;
SQL;
		
		$statement = $this->pdo->prepare($query);
		$statement->bindValue(":id", $id, PDO::PARAM_INT);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->execute();
		
		$topicMatchesUser = $statement->fetch(PDO::FETCH_ASSOC);
		if ($topicMatchesUser)
		{
			$query = <<<SQL
			DELETE FROM Message
			WHERE TopicId = :id;
SQL;
			
			$statement = $this->pdo->prepare($query);
			$statement->bindValue(":id", $id, PDO::PARAM_INT);
			$statement->execute();
			
			$query = <<<SQL
			DELETE FROM Topic
			WHERE Id = :id;
SQL;
			
			$statement = $this->pdo->prepare($query);
			$statement->bindValue(":id", $id, PDO::PARAM_INT);
			$statement->execute();
		}
	}
	
    function getMessages($topicId)
    {
        $messages = array();
		
		$query = <<<SQL
		SELECT * FROM Message
		WHERE TopicId = :topicId
		ORDER BY Posted DESC;
SQL;
		
		$statement = $this->pdo->prepare($query);
		$statement->bindValue(":topicId", $topicId, PDO::PARAM_STR);
		$statement->execute();
		
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
		$passwordHash = $this->passwordLib->createPasswordHash($password,  '$2a$', array('cost' => 12));
		
        $query = <<<SQL
        INSERT INTO User(Name, Password, AvatarUrl, Joined)
        VALUES (:name, :password, :avatarUrl, NOW());
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->bindValue(':password', $passwordHash, PDO::PARAM_STR);
        $statement->bindValue(':avatarUrl', $avatarUrl, PDO::PARAM_STR);
        $statement->execute();
		
		return $this->authenticateUser($name, $password);
    }
    
    function authenticateUser($name, $password)
    {
        $query = <<<SQL
        SELECT * FROM User
        WHERE Name=:name;
SQL;
        
        $statement = $this->pdo->prepare($query);
        $statement->bindValue(':name', $name, PDO::PARAM_STR);
        $statement->execute();
		
		$row = $statement->fetch(PDO::FETCH_ASSOC);
		
        if ($this->passwordLib->verifyPasswordHash($password, $row["Password"]))
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