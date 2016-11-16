<?php
$messages = array();
$messages[] = array("text" => "Tdfsdfsdljfasdklfj sdfl fjasfkl fjsdlasdfjksdfl", "avatar" => "kuva/avatarph.png");
$messages[] = array("text" => "kgöflgk sdg ödfklg k ögweo jfe wwef e", "avatar" => "kuva/avatarph.png");
$messages[] = array("text" => "efwkf wefko wekefp epw kowefp of", "avatar" => "kuva/avatarph.png");
$messages[] = array("text" => "gergwfk wpef kweop kpwefo kpf", "avatar" => "kuva/avatarph.png");

$response = json_encode($messages);
header('Content-type: application/json');
echo $response;
?>