<?php
date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/constantsVals.php");

$deviceID ='';
$selectedMode ='';
extract($_POST);
if ($deviceID == '' || $selectedMode == '') {
    echo "Error Not data came";
}
else {
    $sql = "UPDATE devices set deviceMode = '$selectedMode' where id = '$deviceID' ";
    mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    echo "Update Mode Successfully!! Refresh to check Values.";
}

?>
