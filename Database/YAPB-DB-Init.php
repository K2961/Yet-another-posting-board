<?php
// db-init.php
$db = new PDO('mysql:host=mysql.labranet.jamk.fi;dbname=DBNAME;charset=utf8',
              'USER', 'PASSWORD');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
?>