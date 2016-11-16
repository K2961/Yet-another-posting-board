INSERT INTO User (Id, Name, Password, AvatarUrl, Joined)
VALUES (1, "Test User", "test", "test.png", NOW());

INSERT INTO Topic (Id, UserId, ParentId, Title, Posted)
VALUES (1, 1, NULL, "Test Topic", NOW());

INSERT INTO Message(Id, TopicId, UserId, Text, Posted)
VALUES (1, 1, 1, "Test text", NOW());