<?php
if(empty($_SERVER["HTTPS"]) || $_SERVER["HTTPS"] == "off"){
	$redirect = "https://" . $_SERVER["HTTP_HOST"] . $_SERVER["REQUEST_URI"];
	header("HTTP/1.1 301 Moved Permanently");
	header("Location: " . $redirect);
	exit();
}
?>
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta charset="utf-8" />
	<title>Yet Another Posting Board</title>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
	<script src="https://unpkg.com/react@15.3.2/dist/react.js"></script>
	<script src="https://unpkg.com/react-dom@15.3.2/dist/react-dom.js"></script>
	<script src="https://unpkg.com/babel-core@5.8.38/browser.min.js"></script>
	<script src="script.jsx" type="text/babel"></script>
</head>
<body>
	<div id="page"></div>
</body>
</html>