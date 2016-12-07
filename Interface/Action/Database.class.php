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
		if ($this->isUserBannedFromTopic($userId, $topicId))
		{
			return array("result" => "banned");
		}

		$query = <<<SQL
		INSERT INTO Message(TopicId, UserId, Text, Posted)
		VALUES (:topicId, :userId, :text, NOW());
SQL;
		$statement = $this->pdo->prepare($query);
		$statement->bindValue(':topicId', $topicId, PDO::PARAM_INT);
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->bindValue(':text', $text, PDO::PARAM_STR);
		$statement->execute();
		return array("result" => "success");
	}
	
	function editMessage($messageId, $userId, $text)
	{
		if ($this->isUserBannedFromMessage($userId, $messageId))
		{
			return array("result" => "banned");
		}
		else if ($this->isUserOwnerOfMessage($userId, $messageId)
				|| $this->isUserModeratorOfMessage($userId, $messageId))
		{
			$query = <<<SQL
			UPDATE Message
			SET Text = :text
			WHERE Id = :messageId;
SQL;
			$statement = $this->pdo->prepare($query);
			$statement->bindValue(':messageId', $messageId, PDO::PARAM_INT);
			$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
			$statement->bindValue(':text', $text, PDO::PARAM_STR);
			$statement->execute();
			return array("result" => "success");
		}
		return array("result" => "error");
	}
	
	function deleteMessage($messageId, $userId)
	{
		if ($this->isUserBannedFromMessage($userId, $messageId))
		{
			return array("result" => "banned");
		}		
		else if ($this->isUserOwnerOfMessage($userId, $messageId)
				|| $this->isUserModeratorOfMessage($userId, $messageId))
		{
			$query = <<<SQL
			DELETE FROM Message 
			WHERE Id = :messageId
			AND UserId = :userId;
SQL;
			$statement = $this->pdo->prepare($query);
			$statement->bindValue(':messageId', $messageId, PDO::PARAM_INT);
			$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
			$statement->execute();
			return array("result" => "success");
		}
		return array("result" => "error");
	}
	
	function getTopic($id)
	{
		$query = <<<SQL
		SELECT * FROM Topic 
		WHERE Id = :id;
SQL;
		$statement = $this->pdo->prepare($query);
		$statement->bindValue(':id', $id, PDO::PARAM_INT);
		$statement->execute();

		if ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
		{
			return $this->getTopicFromRow($row);
		}
		return array("result" => "error");
	}
	
	function getTopics()
	{
		$topics = array();
		$statement = $this->pdo->query("SELECT * FROM Topic");
		while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
		{
			$topics[] = $this->getTopicFromRow($row);
		}
		return $topics;
	}
	
	function getTopicFromRow($row)
	{
		$userId = $row["UserId"];
		$user = $this->getUser($userId);

		$messages = $this->getMessages($row["Id"]);
		$lastPost = $row["Posted"];
		if (count($messages) > 0)
		{
			$lastPost = $messages[0]["posted"];
		}

		return array(
			"id" => $row["Id"],
			"title" => $row["Title"],
			"userName" => $user["Name"],
			"posted" => $row["Posted"],
			"lastPost" => $lastPost
		);
	}
	
	function sendTopic($userId, $forumId, $title)
	{
		if ($this->isUserBannedFromForum($userId, $forumId))
		{
			return array("result" => "banned");
		}

		$query = <<<SQL
		INSERT INTO Topic(UserId, ForumId, Title, Posted)
		VALUES (:userId, :forumId, :title, NOW());
SQL;
		$statement = $this->pdo->prepare($query);
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->bindValue(':forumId', $forumId, PDO::PARAM_INT);
		$statement->bindValue(':title', $title, PDO::PARAM_STR);
		$statement->execute();
		return array("result" => "success");
	}
	
	function deleteTopic($id, $userId)
	{
		if ($this->isUserBannedFromTopic($userId, $id))
		{
			return array("result" => "banned");
		}
		if ($this->isUserOwnerOfTopic($userId, $id)
		   || $this->isUserModeratorOftopic($userId, $id))
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
			
			return array("result" => "success");
		}
		return array("result" => "error");
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
			$messageId = $row["Id"];
			$userId = $row["UserId"];
			$user = $this->getUser($userId);
			$userStatus = "normal";
			if ($this->isUserBannedFromMessage($userId, $messageId))
			{
				$userStatus = "banned";
			}
			if ($this->isUserModeratorOfMessage($userId, $messageId))
			{
				$userStatus = "moderator";
			}

			$messages[] = array (
				"id" => $messageId,
				"avatar" => $user["AvatarUrl"],
				"userId" => $user["Id"],
				"userName" => $user["Name"],
				"userStatus" => $userStatus,
				"text" => $row["Text"],
				"posted" => $row["Posted"]
			);
		}
		return $messages;
	}
	
	function getUser($userId)
	{
		$sql = "SELECT * FROM User WHERE Id=:id";
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":id", $userId, PDO::PARAM_INT);
		$statement->execute();

		if ($row = $statement->fetch(PDO::FETCH_ASSOC))
		{
			return $row;
		}
		return array("result" => "error");
	}
	
	function addForum($title)
	{
		$sql = <<<SQL
		INSERT INTO Forum(Title, Created)
		VALUES (:title, NOW());
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":title", $title, PDO::PARAM_STR);
		$statement->execute();

		$sql = <<<SQL
		SELECT * FROM Forum WHERE Title = :title;
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":title", $title, PDO::PARAM_STR);
		$statement->execute();

		if ($row = $statement->fetch(PDO::FETCH_ASSOC))
		{
			$forum = array(
				"id" => $row["Id"],
			);
			return $forum;
		}
		return array("result" => "error");
	}
	
	function addModerator($userId, $forumId)
	{
		$sql = <<<SQL
		INSERT INTO Moderator(UserId, ForumId)
		VALUES (:userId, :forumId);
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->bindValue(":forumId", $forumId, PDO::PARAM_INT);
		$statement->execute();
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
	
	function banUser($targetUserId, $forumId, $moderatorUserId)
	{
		if ($this->isUserModeratorOfForum($moderatorUserId, $forumId))
		{
			$sql = <<<SQL
			REPLACE INTO Ban(UserId, ForumId, Expires)
			VALUES (:targetUserId, :forumId, DATE_ADD(NOW(), INTERVAL 7 DAY));
SQL;
			$statement = $this->pdo->prepare($sql);
			$statement->bindValue(':targetUserId', $targetUserId, PDO::PARAM_INT);
			$statement->bindValue(':forumId', $forumId, PDO::PARAM_INT);
			$statement->execute();
			return array("result" => "success");
		}
		return array("result" => "error");
	}
	
	function unbanUser($targetUserId, $forumId, $moderatorUserId)
	{
		if ($this->isUserModeratorOfForum($moderatorUserId, $forumId))
		{
			$sql = <<<SQL
			UPDATE Ban
			SET Expires = NOW()
			WHERE UserId = :targetUserId
			AND ForumId = :forumId;
SQL;
			$statement = $this->pdo->prepare($sql);
			$statement->bindValue(':targetUserId', $targetUserId, PDO::PARAM_INT);
			$statement->bindValue(':forumId', $forumId, PDO::PARAM_INT);
			$statement->execute();
			return array("result" => "success");
		}
		return array("result" => "error");
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

		try 
		{
			if ($this->passwordLib->verifyPasswordHash($password, $row["Password"]))
			{
				$id = $row["Id"];
				$bans = $this->getUserBans($id);
				$privileges = $this->getUserModeratorPrivileges($id);
				$user = array(
					"id" => $id,
					"name" => $row["Name"],
					"bans" => $bans,
					"privileges" => $privileges
				);
				return array("result" => "success", "user" => $user);
			}
		}
		catch (Exception $exception)
		{
			
		}
		return array("result" => "failure");
	}
	
	function getUserBans($userId)
	{
		$sql = <<<SQL
		SELECT * FROM Ban
		WHERE UserId = :userId
		AND Expires > NOW();
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->execute();
		
		$bans = array();
		while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
		{
			$bans[] = array(
				"forumId" => $row["ForumId"],
				"expires" => $row["Expires"]
			);
		}
		return $bans;
	}
	
	function getUserModeratorPrivileges($userId)
	{
		$sql = <<<SQL
		SELECT * FROM Moderator
		WHERE UserId = :userId;
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(':userId', $userId, PDO::PARAM_INT);
		$statement->execute();
		
		$privileges = array();
		while ($row = $statement->fetch(PDO::FETCH_ASSOC)) 
		{
			$privileges[] = array(
				"forumId" => $row["ForumId"]
			);
		}
		return $privileges;
	}
		
	function deleteAll()
	{
		$this->pdo->query("DELETE FROM Moderator;");
		$this->pdo->query("DELETE FROM Ban;");
		$this->pdo->query("DELETE FROM Message;");
		$this->pdo->query("DELETE FROM Topic;");
		$this->pdo->query("DELETE FROM Forum;");
		$this->pdo->query("DELETE FROM User;");
	}
	
	function isUserOwnerOfMessage($userId, $messageId)
	{
		$sql = <<<SQL
		SELECT * FROM Message
		WHERE Id = :messageId
		AND UserId = :userId
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->bindValue(":messageId", $messageId, PDO::PARAM_INT);
		$statement->execute();
		
		if ($statement->fetch(PDO::FETCH_ASSOC))
			return true;
		return false;
	}
	
	function isUserOwnerOfTopic($userId, $topicId)
	{
		$sql = <<<SQL
		SELECT * FROM Topic
		WHERE Id = :topicId
		AND UserId = :userId
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->bindValue(":topicId", $topicId, PDO::PARAM_INT);
		$statement->execute();
		
		if ($statement->fetch(PDO::FETCH_ASSOC))
			return true;
		return false;
	}
	
	function isUserBannedFromMessage($userId, $messageId)
	{
		$topicId = $this->getTopicIdFromMessage($messageId);
		return $this->isUserBannedFromTopic($userId, $topicId);
	}
	
	function isUserBannedFromTopic($userId, $topicId)
	{
		$forumId = $this->getForumIdFromTopic($topicId);
		return $this->isUserBannedFromForum($userId, $forumId);
	}
	
	function isUserBannedFromForum($userId, $forumId)
	{
		$sql = <<<SQL
		SELECT * FROM Ban
		WHERE UserId = :userId
		AND ForumId = :forumId
		AND Expires > NOW();
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->bindValue(":forumId", $forumId, PDO::PARAM_INT);
		$statement->execute();

		if ($statement->fetch(PDO::FETCH_ASSOC))
			return true;
		return false;
	}
	
	function isUserModeratorOfMessage($userId, $messageId)
	{
		$topicId = $this->getTopicIdFromMessage($messageId);
		return $this->isUserModeratorOfTopic($userId, $topicId);
	}
	
	function isUserModeratorOfTopic($userId, $topicId)
	{
		$forumId = $this->getForumIdFromTopic($topicId);
		return $this->isUserModeratorOfForum($userId, $forumId);
	}
	
	function isUserModeratorOfForum($userId, $forumId)
	{
		$sql = <<<SQL
		SELECT * FROM Moderator
		WHERE UserId = :userId
		AND ForumId = :forumId;
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":userId", $userId, PDO::PARAM_INT);
		$statement->bindValue(":forumId", $forumId, PDO::PARAM_INT);
		$statement->execute();
		
		if ($statement->fetch(PDO::FETCH_ASSOC))
			return true;
		return false;
	}
	
	function getTopicIdFromMessage($messageId)
	{
		$sql = <<<SQL
		SELECT TopicId FROM Message
		WHERE Id = :messageId;
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":messageId", $messageId, PDO::PARAM_INT);
		$statement->execute();

		$row = $statement->fetch(PDO::FETCH_ASSOC);
		if ($row)
		{
			return $row["TopicId"];
		}
		return -1;
	}
	
	function getForumIdFromTopic($topicId)
	{
		$sql = <<<SQL
		SELECT ForumId FROM Topic
		WHERE Id = :topicId;
SQL;
		$statement = $this->pdo->prepare($sql);
		$statement->bindValue(":topicId", $topicId, PDO::PARAM_INT);
		$statement->execute();
		
		$row = $statement->fetch(PDO::FETCH_ASSOC);
		if ($row)
		{
			return $row["ForumId"];
		}
		return -1;
	}
}