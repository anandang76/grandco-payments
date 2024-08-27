<?php
date_default_timezone_set('Asia/Kolkata');
//global flags
$sensorConfigData=[];
$deviceConfigData=[];

include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/constantsVals.php");
include(__DIR__ . "/../includes/genFunctions.php");

if ($debugFlag) { $funcStartTime = microtime(true); }

//Truncate / delete all old values in DB after the configuration.
//Read and update entire configuration as JSON values to the table. 

//recreateInfoTable();
//for temporary till new add/edit done.
//createSensorNewTable();

//updateEmailSMSForEachZone();
//cleanOldRecords();

createConfigFiles();
//readConfigFiles();
//readConfigDB();

if ($debugFlag) { $funcEndTime = microtime(true); echo "<br/><br/>[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

//function not used - currently. // replace / discard.
function recreateInfoTable() {
    global $dbConfigConn;
    $sql='TRUNCATE TABLE nameJsonInfo';
    mysqli_query($dbConfigConn,$sql);
    foreach(TABLE_NAME_ARRAY as $tableName) {
        $row=[];
        $sql = "select * from $tableName ";
        echo "<br/>$sql";
        $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
        while ($result = mysqli_fetch_assoc($getResult))
        {
            $row[$result['id']]=$result[$columnName];
        }
        $json_info = json_encode($row);
        echo "<hr>";
        echo $json_info;
        $sql="INSERT INTO nameJsonInfo (type,json) values('$tableName', '$json_info' )";
        mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    }
} // recreate tables / insert all new data.



function createSensorNewTable() {
    global $dbConfigConn;
    //convert to new table.
    //$sql='TRUNCATE TABLE sensors';
    //mysqli_query($dbConfigConn,$sql);

    $getDataSql = "select * FROM `sensors`  order by id ";
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $sensorID = $result['id'];
        $scaleInfo=[];
        $scaleInfo['minR'] = $result['minRatedReading'];
        $scaleInfo['maxR'] = $result['maxRatedReading'];
        $scaleInfo['minRS'] = $result['minRatedReadingScale'];
        $scaleInfo['maxRS'] = $result['maxRatedReadingScale'];

        $scaleInfoString = json_encode($scaleInfo);

        $stelInfo=[];
        $stelInfo['stelLimit'] = $result['stelLimit'];
        $stelInfo['stelDuration'] = $result['stelDuration'];
        $stelInfo['stelAlert'] = $result['stelAlert'];

        $stelInfoString = json_encode($stelInfo);

        $twaInfo=[];
        $isTWA=0;
        if ( $result['twaDuration'] != null) {
            $isTWA=1;
            $twaInfo['shift1']['twaLimit'] = $result['twaLimit'];
            $twaInfo['shift1']['twaDuration'] = round(($result['twaDuration']*60),0);
            $twaInfo['shift1']['twaStartTime'] = $result['twaStartTime'];
            $twaInfo['shift1']['twaAlert'] = $result['twaAlert'];
            if (($sensorID % 10) == 0) {
                $initialTime = $result['twaStartTime'];
                $dateTimeCheck = new DateTime($initialTime);
                $dateTimeCheck->modify('+8 hours');
                $updatedTime = $dateTimeCheck->format('H:i:s');

                $twaInfo['shift2']['twaLimit'] = $result['twaLimit'];
                $twaInfo['shift2']['twaDuration'] = round(($result['twaDuration']*60),0);
                $twaInfo['shift2']['twaStartTime'] =$updatedTime;
                $twaInfo['shift2']['twaAlert'] = $result['twaAlert']."-Shift2";
            }
            if (($sensorID % 20) == 0) {
                $initialTime = $result['twaStartTime'];
                $dateTimeCheck = new DateTime($initialTime);
                $dateTimeCheck->modify('+12 hours');
                $updatedTime = $dateTimeCheck->format('H:i:s');

                $twaInfo['shift3']['twaLimit'] = $result['twaLimit'];
                $twaInfo['shift3']['twaDuration'] = round(($result['twaDuration']*60),0);
                $twaInfo['shift3']['twaStartTime'] = $updatedTime;
                $twaInfo['shift3']['twaAlert'] = $result['twaAlert']."-Shift3";
            }
        }

        $twaInfoString = json_encode($twaInfo);
        //echo "<br/>TWA String for $sensorID = $twaInfoString";

        $modBusInfo=[];

        $modBusInfoString = json_encode($modBusInfo);

        $criticalAlertInfo=[];
        $criticalAlertInfo['cAT'] = $result['criticalAlertType'];
        $criticalAlertInfo['cMin'] = $result['criticalMinValue'];
        $criticalAlertInfo['cMax'] = $result['criticalMaxValue'];
        $criticalAlertInfo['cLTxt'] = $result['criticalLowAlert'];
        $criticalAlertInfo['cHTxt'] = $result['criticalHighAlert'];

        $criticalInfoString = json_encode($criticalAlertInfo);

        $warningAlertInfo=[];
        $warningAlertInfo['wAT'] = $result['warningAlertType'];
        $warningAlertInfo['wMin'] = $result['warningMinValue'];
        $warningAlertInfo['wMax'] = $result['warningMaxValue'];
        $warningAlertInfo['wLTxt'] = $result['warningLowAlert'];
        $warningAlertInfo['wHTxt'] = $result['warningHighAlert'];

        $warningInfoString = json_encode($warningAlertInfo);

        $outOfRangeAlertInfo=[];
        $outOfRangeAlertInfo['oAT'] = $result['outofrangeAlertType'];
        $outOfRangeAlertInfo['oMin'] = $result['outofrangeMinValue'];
        $outOfRangeAlertInfo['oMax'] = $result['outofrangeMaxValue'];
        $outOfRangeAlertInfo['oLTxt'] = $result['outofrangeLowAlert'];
        $outOfRangeAlertInfo['oHTxt'] = $result['outofrangeHighAlert'];

        $outOfRangeInfoString = json_encode($outOfRangeAlertInfo);

        $digitalAlertInfo=[];

        $digitalInfoString = json_encode($digitalAlertInfo);

/*
        echo "<br/>scaleInfoString [$scaleInfoString]";
        echo "<br/>stelInfoString [$stelInfoString]";
        echo "<br/>twaInfoString [$twaInfoString]";
        echo "<br/>modBusInfoString [$modBusInfoString]";
        echo "<br/>criticalInfoString [$criticalInfoString]";
        echo "<br/>warningInfoString [$warningInfoString]";
        echo "<br/>outOfRangeInfoString [$outOfRangeInfoString]";
        echo "<br/>digitalInfoString [$digitalInfoString]";
*/

        $sql = "INSERT INTO sensors ( locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, deviceCategory, sensorName, sensorTag, defaultValue, alarmType, isStel, isTwa, isAQI, scaleInfo, stelInfo, twaInfo, modBusInfo, criticalAlertInfo, warningAlertInfo, outOfRangeAlertInfo, digitalAlertInfo, sensorOutput, units, sensorStatus, notificationStatus ) VALUES ( '".$result['locationID']."','".$result['branchID']."','".$result['facilityID']."','".$result['buildingID']."','".$result['floorID']."','".$result['zoneID']."','".$result['deviceID']."','".$result['deviceCategory']."','".$result['sensorNameUnit']."','".$result['sensorTag']."','".$result['defaultValue']."','".$result['alarm']."','".$result['isStel']."','".$isTWA."','".$result['isAQI']."','".$scaleInfoString."','".$stelInfoString."','".$twaInfoString."','".$modBusInfoString."','".$criticalInfoString."','".$warningInfoString."','".$outOfRangeInfoString."','".$digitalInfoString."','".$result['sensorOutput']."','".$result['units']."','".$result['sensorStatus']."','".$result['notificationStatus']."' )";

        //echo "<hr/>$sql";
        
        mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));

    }
} //createsensorNewTable()






/*

$getDataSql = "select id, sensorTag, sensorType, minRatedReading, maxRatedReading, minRatedReadingScale, maxRatedReadingScale, criticalAlertType, criticalMinValue, criticalMaxValue, criticalLowAlert, criticalHighAlert,  warningAlertType, warningMinValue, warningMaxValue,  warningLowAlert, warningHighAlert, outofrangeAlertType, outofrangeMinValue, outofrangeMaxValue,  outofrangeLowAlert, outofrangeHighAlert FROM `sensors`  order by id ";
$getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
$arrString = '$sensorIDInfoArray=[';
while ($result = mysqli_fetch_assoc($getResult))
{
    $minR=$result['minRatedReading'];  //minRatedReading
    $maxR=$result['maxRatedReading']; //maxRatedReading 
    $minRS=$result['minRatedReadingScale'];  //minRatedReadingScale
    $maxRS=$result['maxRatedReadingScale']; //maxRatedReadingScale
    //critical
    $cAT=$result['criticalAlertType']; //criticalAlertType
    $cMin=$result['criticalMinValue']; //criticalMinValue
    $cMax=$result['criticalMaxValue']; //criticalMaxValue
    $cLTxt=$result['criticalLowAlert']; //criticalLowAlert
    $cHTxt=$result['criticalHighAlert']; //criticalHighAlert
    //warning
    $wAT=$result['warningAlertType']; //warningAlertType
    $wMin=$result['warningMinValue']; //warningMinValue
    $wMax=$result['warningMaxValue']; //warningMaxValue
    $wLTxt=$result['warningLowAlert']; //warningLowAlert
    $wHTxt=$result['warningHighAlert']; //warningHighAlert
    //critical
    $oAT=$result['outofrangeAlertType']; //outofrangeAlertType
    $oMin=$result['outofrangeMinValue']; //outofrangeMinValue
    $oMax=$result['outofrangeMaxValue']; //outofrangeMaxValue
    $oLTxt=$result['outofrangeLowAlert']; //outofrangeLowAlert
    $oHTxt=$result['outofrangeHighAlert']; //outofrangeHighAlert

    $arrString .= "'".$result['id']."' => ['Tag'=>'".$result['sensorTag']."', 'minR'=> '".$minR."', 'maxR'=>'".$maxR."', 'minRS'=> '".$minRS."', 'maxRS'=>'".$maxRS."', 'cAT'=> '".$cAT."', 'cMin'=> '".$cMin."', 'cMax'=> '".$cMax."', 'cLTxt'=> '".$cLTxt."', 'cHTxt'=> '".$cHTxt."', 'wAT'=> '".$wAT."', 'wMin'=> '".$wMin."', 'wMax'=> '".$wMax."', 'wLTxt'=> '".$wLTxt."', 'wHTxt'=> '".$wHTxt."', 'oAT'=> '".$oAT."', 'oMin'=> '".$oMin."', 'oMax'=> '".$oMax."', 'oLTxt'=> '".$oLTxt."', 'oHTxt'=> '".$oHTxt."'  ],";
}
$arrString .= '];';

echo $arrString;

*/

/*
$deviceIDArray=[];
$getDataSql = "select id, deviceName, deviceTag  from devices ";
$getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
$arrString = '$deviceIDNameArray=[';
while ($result = mysqli_fetch_assoc($getResult))
{
    $arrString .= "'".$result['id']."' => '".$result['deviceName']."', ";
}
$arrString .= '];';
echo $arrString;

//Important sensor data array

$getDataSql = "select id, sensorTag, sensorType, minRatedReading, maxRatedReading, minRatedReadingScale, maxRatedReadingScale, criticalAlertType, criticalMinValue, criticalMaxValue, criticalLowAlert, criticalHighAlert,  warningAlertType, warningMinValue, warningMaxValue,  warningLowAlert, warningHighAlert, outofrangeAlertType, outofrangeMinValue, outofrangeMaxValue,  outofrangeLowAlert, outofrangeHighAlert FROM `sensors`  order by id ";
$getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
$arrString = '$sensorIDNameArray=[';
while ($result = mysqli_fetch_assoc($getResult))
{
    $minR=$result['minRatedReading'];  //minRatedReading
    $maxR=$result['maxRatedReading']; //maxRatedReading 
    $minRS=$result['minRatedReadingScale'];  //minRatedReadingScale
    $maxRS=$result['maxRatedReadingScale']; //maxRatedReadingScale
    //critical
    $cAT=$result['criticalAlertType']; //criticalAlertType
    $cMin=$result['criticalMinValue']; //criticalMinValue
    $cMax=$result['criticalMaxValue']; //criticalMaxValue
    $cLTxt=$result['criticalLowAlert']; //criticalLowAlert
    $cHTxt=$result['criticalHighAlert']; //criticalHighAlert
    //warning
    $wAT=$result['warningAlertType']; //warningAlertType
    $wMin=$result['warningMinValue']; //warningMinValue
    $wMax=$result['warningMaxValue']; //warningMaxValue
    $wLTxt=$result['warningLowAlert']; //warningLowAlert
    $wHTxt=$result['warningHighAlert']; //warningHighAlert
    //critical
    $oAT=$result['outofrangeAlertType']; //outofrangeAlertType
    $oMin=$result['outofrangeMinValue']; //outofrangeMinValue
    $oMax=$result['outofrangeMaxValue']; //outofrangeMaxValue
    $oLTxt=$result['outofrangeLowAlert']; //outofrangeLowAlert
    $oHTxt=$result['outofrangeHighAlert']; //outofrangeHighAlert

    $arrString .= "'".$result['id']."' => ['Tag'=>'".$result['sensorTag']."', 'minR'=> '".$minR."', 'maxR'=>'".$maxR."', 'cAT'=> '".$cAT."', 'cMin'=> '".$cMin."', 'cMax'=> '".$cMax."', 'cLTxt'=> '".$cLTxt."', 'cHTxt'=> '".$cHTxt."', 'wAT'=> '".$wAT."', 'wMin'=> '".$wMin."', 'wMax'=> '".$wMax."', 'wLTxt'=> '".$wLTxt."', 'wHTxt'=> '".$wHTxt."', 'oAT'=> '".$oAT."', 'oMin'=> '".$oMin."', 'oMax'=> '".$oMax."', 'oLTxt'=> '".$oLTxt."', 'oHTxt'=> '".$oHTxt."'  ],";
}
$arrString .= '];';
echo $arrString;


*/



