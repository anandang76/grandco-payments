<?php

$dbUser="aqmsTms".$configCompanyID;;
$dbPass="Bgt56yhN@";
$dbHost="localhost";
$dbTms="aqmsTms".$configCompanyID;
$dbTmsConn=new mysqli($dbHost,$dbUser,$dbPass,$dbTms) or die("Error Connect Config ".mysqli_error($dbTmsConn));

?>