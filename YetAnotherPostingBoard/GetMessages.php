<?php
$messages = array();
$messages[] = array("text" => "Tdfsdfsdljfasdklfj sdfl fjasfkl fjsdlasdfjksdfl");
$messages[] = array("text" => "kgöflgk sdg ödfklg k ögweo jfe wwef e");
$messages[] = array("text" => "efwkf wefko wekefp epw kowefp of");
$messages[] = array("text" => "gergwfk wpef kweop kpwefo kpf");

$response = json_encode($messages);
header('Content-type: application/json');
echo $response;
?>