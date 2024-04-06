<?php

$dbUser="aqmsConfig".$configCompanyID;;
$dbPass="Bgt56yhN@";
$dbHost="localhost";
$dbConfig="aqmsConfig".$configCompanyID;
$dbConfigConn=new mysqli($dbHost,$dbUser,$dbPass,$dbConfig) or die("Error Connect Config ".mysqli_error($dbConfigConn));

?>