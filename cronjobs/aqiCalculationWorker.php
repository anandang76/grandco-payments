<?php
date_default_timezone_set('Asia/Kolkata');
include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/dbTmsConn.php");
include(__DIR__ . "/../includes/constantsVals.php");
include(__DIR__ . "/../includes/genFunctions.php");
include(__DIR__ . "/aqiGenFunctions.php");

$gblAqiArray = [];
$aqiConstParams =[];

if ($debugFlag) { $funcStartTime = microtime(true); }
//This will read the aqi table values to memory array
readAQIValues();

$zoneIDArray = [];
$dateCurMinute = getDateLessMinutes(0);
$sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneName, isAQI FROM `zones` where isAQI = 1 ";
$result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
$zoneIDArray = mysqli_fetch_all($result,MYSQLI_ASSOC);

$dateMinuteH = getDateLessMinutes(ONE_HOUR);

foreach($zoneIDArray as $zoneInfoArray) {
    echo "<hr/><br/>Processing Zone isAQI = ".$zoneInfoArray['isAQI']. " - Name[". $zoneInfoArray['zoneName']."] - ID[".$zoneInfoArray['id']."]";
    $zoneID = $zoneInfoArray['id'];
    $locationID = $zoneInfoArray['locationID'];
    $branchID = $zoneInfoArray['branchID'];
    $facilityID = $zoneInfoArray['facilityID'];
    $buildingID = $zoneInfoArray['buildingID'];
    $floorID = $zoneInfoArray['floorID'];
    $zoneID = $zoneInfoArray['id'];
    initializeAqiArray();

    //printAqiArray();
    $sql = "SELECT id as sensorID, deviceID, sensorTag, sensorOutput, sensorName, units FROM `sensors` where deviceID in (select id from devices where zoneID = $zoneID) and isAQI = 1;";
    //echo "<br/> $sql";
    $result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    $sensorInfoArray = mysqli_fetch_all($result,MYSQLI_ASSOC);
    
    //first Priority for PM2.5 and PM10 and then only others values calculation for faster calc. 
    //If PM10 or PM2.5 is 0 then calculating other is not recommended.
    foreach ($sensorInfoArray as $sensorInfo) {
        $sensorName = $sensorInfo['sensorName'];
        $units = $sensorInfo['units'];
        $sensorNameArr = explode('-', $sensorInfo['sensorName']);
        $sensorUnitName = trim($sensorNameArr[0]);
        if ($sensorUnitName == 'PM2.5' || $sensorUnitName == 'PM10') {
            $sensorID = $sensorInfo['sensorID'];
            $deviceID = $sensorInfo['deviceID'];
            $sensorName = $sensorInfo['sensorName'];
            $tableName = getDeviceTableName($deviceID,FIVE_MINUTE);
            $aqiAvgTimeInterval = getAqiTimeInterval($sensorUnitName);
            $dateMinute = getDateLessMinutes($aqiAvgTimeInterval);

            //if ($debugFlag) { echo "<br/>Device[$deviceID] Sensor[$sensorID] NameUnit[$sensorName] DynTable[$tableName] TimeInterval[$aqiAvgTimeInterval] "; }

            $sql = "select avg(avgScaledVal) as value, count(*) as numSamples from $tableName WHERE sensorID = '$sensorID' and collectedTime >= '$dateMinute' ";
            //echo "<br/>".$sql;
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            $row = mysqli_fetch_assoc($result);
            if ($row['numSamples'] > AQI_SAMPLING_COUNT) {
                echo "<br/>Sampling count GOOD NUMBERS for SensorID = $sensorID [".$row['numSamples']."] Calculating Average.."; 
                $gblAqiArray[$sensorUnitName]['avg'] = number_format($row['value'], 2, '.', '');
                $gblAqiArray[$sensorUnitName]['sensorID'] = $sensorID;
                $gblAqiArray[$sensorUnitName]['deviceID'] = $deviceID;
                $gblAqiArray[$sensorUnitName]['sensorName'] = $sensorName;
                $gblAqiArray[$sensorUnitName]['units'] = $units;
            }
            else {
                echo "<br/>***Sampling count for SensorID = $sensorID is less [".$row['numSamples']."] ... returning"; 
                continue;
            }

            $sql = "select avg(avgScaledVal) as value, count(*) as numSamples from $tableName WHERE sensorID = '$sensorID' and collectedTime >= '$dateMinuteH' ";
            //echo "<br/>".$sql;
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            $row = mysqli_fetch_assoc($result);
            if ($row['numSamples'] > 1 ) {
                $gblAqiArray[$sensorUnitName]['avgH'] = number_format($row['value'], 2, '.', '');
            }
        }
    }

    if (subAqiCheckMandatoryValue()) {
        if ($debugFlag) { printAqiArray(); echo "<br/>PM2.5 and PM10 average value is 0.  Atleast one value needed for AQI Calc <br/>"; }
        //continue the loop don't do calc for this zone
        continue;
    }

    //Next Priority for other sensors other than PM2.5 and PM10 . 
    foreach ($sensorInfoArray as $sensorInfo) {
        $sensorName = $sensorInfo['sensorName'];
        $units = $sensorInfo['units'];
        $sensorNameArr = explode('-', $sensorInfo['sensorName']);
        $sensorUnitName = trim($sensorNameArr[0]);
        if ($sensorUnitName != 'PM2.5' && $sensorUnitName != 'PM10') {
            $sensorID = $sensorInfo['sensorID'];
            $deviceID = $sensorInfo['deviceID'];
            $sensorName = $sensorInfo['sensorName'];
            $tableName = getDeviceTableName($deviceID,FIVE_MINUTE);
            $aqiAvgTimeInterval = getAqiTimeInterval($sensorUnitName);
            $dateMinute = getDateLessMinutes($aqiAvgTimeInterval);

            //if ($debugFlag) { echo "<br/>Device[$deviceID] Sensor[$sensorID] NameUnit[$sensorName] DynTable[$tableName] TimeInterval[$aqiAvgTimeInterval] "; }
            if ($sensorUnitName == "CO" || $sensorUnitName == "O3") {
                $sql = "select max(maxScaledVal) as value, count(*) as numSamples  from $tableName WHERE sensorID = '$sensorID' and collectedTime >= '$dateMinute' ";
            }
            else {
                $sql = "select avg(avgScaledVal) as value, count(*) as numSamples  from $tableName WHERE sensorID = '$sensorID' and collectedTime >= '$dateMinute' ";
            }
            //echo "<br/>".$sql;
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            $row = mysqli_fetch_assoc($result);
            if ($row['numSamples'] > AQI_SAMPLING_COUNT) {
                echo "<br/>Sampling count GOOD NUMBERS for SensorID = $sensorID [".$row['numSamples']."] Calculating Average.."; 
                $gblAqiArray[$sensorUnitName]['avg'] = number_format($row['value'], 2, '.', '');
                $gblAqiArray[$sensorUnitName]['sensorID'] = $sensorID;
                $gblAqiArray[$sensorUnitName]['deviceID'] = $deviceID;
                $gblAqiArray[$sensorUnitName]['sensorName'] = $sensorName;
                $gblAqiArray[$sensorUnitName]['units'] = $units;
            }
            else {
                echo "<br/>****Sampling count for SensorID = $sensorID is less [".$row['numSamples']."] ... returning"; 
                continue;
            }

            $sql = "select avg(avgScaledVal) as value, count(*) as numSamples from $tableName WHERE sensorID = '$sensorID' and collectedTime >= '$dateMinuteH' ";
            //echo "<br/>".$sql;
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            $row = mysqli_fetch_assoc($result);
            if ($row['numSamples'] > 1 ) {
                $gblAqiArray[$sensorUnitName]['avgH'] = number_format($row['value'], 2, '.', '');
            }
        }
    }

    if (aqiCheckMandatoryValue()) {
        if ($debugFlag) { printAqiArray(); echo "<br/>Minimum 3 Values not available to calculate AQI <br/>"; }
        //continue the loop don't do calc for this zone
        continue;
    }

    //if ($debugFlag) { echo "<br> All Average values are there ... Start SubIndex Calculation " ; printAqiArray();}
    
    fillAqiSubIndex();

    if ($debugFlag) { echo "<br/>After SubIndex<br/>"; printAqiArray(); }

    $aqiZoneValue = getCalculatedAqiValueFromArray();

    if ($debugFlag) { echo "<br/>AqiValue [$aqiZoneValue] for Zone [$zoneID] <br/>"; printAqiArray(); }


    $aqiInfo = json_encode($gblAqiArray);
    $escapedaqiInfo = mysqli_real_escape_string($dbTmsConn, $aqiInfo);
    $sql = "INSERT into aqiZoneInfo (`locationID`, `branchID`, `facilityID`, `buildingID`, `floorID`, `zoneID`, `aqiValue`, `aqiInfo`, `collectedTime`)  values ('$locationID', '$branchID', '$facilityID', '$buildingID', '$floorID', '$zoneID', '$aqiZoneValue', '$escapedaqiInfo', '$dateCurMinute' ) ";
    //echo "<br/>$sql";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

    $sql = "UPDATE zones SET `aqiValue` = '$aqiZoneValue' WHERE id = '$zoneID' ";
    //echo "<br/>$sql";
    mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
}

if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/><br/>[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>