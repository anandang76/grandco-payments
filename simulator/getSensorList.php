<?php
date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/constantsVals.php");

$deviceID ='';
extract($_POST);
if ($deviceID == '' ) {
    echo "Error Not data came 2";
}
else {
    $data = [];
    $sql = "SELECT id, sensorTag, sensorName, defaultValue, warningAlertInfo, criticalAlertInfo, outOfRangeAlertInfo, scaleInfo from sensors where deviceID = '$deviceID' ";
    $result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($row = mysqli_fetch_assoc($result))
    {
        $rowInfo['id']=$row['id'];
        $rowInfo['sensorTag']=$row['sensorTag'];
        $rowInfo['defaultValue']=$row['defaultValue'];
        $infoArray = json_decode($row['warningAlertInfo'], true);
        $rowInfo['warning']=$infoArray['wMin'].",".$infoArray['wMax'];
        $infoArray = json_decode($row['criticalAlertInfo'], true);
        $rowInfo['critical']=$infoArray['cMin'].",".$infoArray['cMax'];
        $infoArray = json_decode($row['outOfRangeAlertInfo'], true);
        $rowInfo['outOfRange']=$infoArray['oMin'].",".$infoArray['oMax'];
        $infoArray = json_decode($row['scaleInfo'], true);
        if (isset($infoArray['minR'])) {
            $rowInfo['minR']=$infoArray['minR'];
            $rowInfo['maxR']=$infoArray['maxR'];
            $rowInfo['minRS']=$infoArray['minRS'];
            $rowInfo['maxRS']=$infoArray['maxRS'];
        }
        $data[]=$rowInfo;
    }
    $returnString = json_encode($data);
    echo $returnString;
}

?>
