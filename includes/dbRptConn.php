<?php

$dbUser="aqmsReport".$configCompanyID;;
$dbPass="Bgt56yhN@";
$dbHost="localhost";
$dbRpt="aqmsReport".$configCompanyID;
$dbRptConn=new mysqli($dbHost,$dbUser,$dbPass,$dbRpt) or die("Error Connect Config ".mysqli_error($dbRptConn));

?>