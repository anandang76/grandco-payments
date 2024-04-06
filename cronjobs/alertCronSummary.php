<?php

date_default_timezone_set('Asia/Kolkata');

include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/dbTmsConn.php");
include(__DIR__ . "/../includes/dbRptConn.php");
include(__DIR__ . "/../includes/genFunctions.php");
include(__DIR__ . "/../includes/constantsVals.php");

if ($debugFlag) { $funcStartTime = microtime(true); }
//group all values for that day and move data to the report tables. 

$alertArray=[];
$zoneArray=[];
$deviceConfigData=[];
$sensorConfigData=[];


readDeviceConfigDB();
readSensorConfigDB();

$todayDate = date('Y-m-d');
$yesterdayDate = date('Y-m-d', strtotime($todayDate . ' -1 day'));
$yesterdayStartTime = $yesterdayDate." 00:00:00";
$yesterdayEndTime = $yesterdayDate." 23:59:59";
$collectedTime = $yesterdayEndTime;
$insertCount=0;

aggDeviceDataDaily($yesterdayStartTime, $yesterdayEndTime);
//get all the zones max aqi value for that day information from transaction table. 
$sql = "SELECT zoneID, max(aqiValue) as aqiValue FROM `aqiZoneInfo` WHERE collectedTime >= '$yesterdayStartTime' AND collectedTime <= '$yesterdayEndTime'  group by zoneID ";
//$sql = "SELECT  zoneID, max(aqiValue)  as aqiValue FROM `aqiZoneInfo` group by zoneID, aqiValue ";
if ($debugFlag) { echo "<br/> Select SQL = $sql"; }              
$result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
while ($row = mysqli_fetch_assoc($result))
{
  $zoneArray[]=$row;
}
$row=[];

foreach($zoneArray as $zoneAqi) {
  $zoneID = $zoneAqi['zoneID'];
  $aqiValue = $zoneAqi['aqiValue'];
  $sql = "SELECT  * FROM `aqiZoneInfo` where zoneID = '$zoneID' AND aqiValue = '$aqiValue' AND collectedTime >= '$yesterdayStartTime' AND collectedTime <= '$yesterdayEndTime' LIMIT 1 ";
  //$sql = "SELECT  * FROM `aqiZoneInfo` where zoneID = '$zoneID' AND aqiValue = '$aqiValue' LIMIT 1 ";
  if ($debugFlag) { echo "<br/> Select SQL = $sql"; }              
  $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
  while ($row = mysqli_fetch_assoc($result))
  {
    $sql = "INSERT INTO aqiZoneSummary (locationID, branchID, facilityID, buildingID, floorID, zoneID, aqiValue, aqiInfo, collectedTime) values ('".$row['locationID']."', '".$row['branchID']."', '".$row['facilityID']."', '".$row['buildingID']."', '".$row['floorID']."', '".$row['zoneID']."', '".$row['aqiValue']."', '".$row['aqiInfo']."', '".$row['collectedTime']."') ";
    echo "<br/>$sql";
    mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
  }
}


$alertTypeString = "'".CRITICAL_ALERT."', '".STEL_ALERT."', '".WARNING_ALERT."', '".OUTOFRANGE_ALERT."' ";
$sql = "SELECT id, deviceID, sensorID, alertType from alertCrons where collectedTime >= '$yesterdayStartTime' AND collectedTime <= '$yesterdayEndTime' AND alertType in ( $alertTypeString ) ";
//$sql = "SELECT id, deviceID, sensorID, alertType from alertCrons where alertType in ( $alertTypeString ) ";
$result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
while ($row = mysqli_fetch_assoc($result))
{
  $alertArray[] = $row;
}
$row=[];

//var_dump($alertArray);


$sql = "SELECT deviceID, sensorID,  min(scaledValue) as minScaledVal, max(scaledValue) as maxScaledVal, AVG(scaledValue) as avgScaledVal  FROM `sensorSegregatedValues` WHERE collectedTime >= '$yesterdayStartTime' AND collectedTime <= '$yesterdayEndTime' group by deviceID, sensorID";
if ($debugFlag) { echo "<br/> Select SQL = $sql"; }              
$result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
while ($row = mysqli_fetch_assoc($result))
{
    $infoValue='Normal';
    foreach($alertArray as $alerts) {
      if ($alerts['sensorID'] == $row['sensorID']) {
        //if stel alert set STEL and break no need to process and check other alerts.
        if ( $alerts['alertType'] == STEL_ALERT ) {
          $infoValue = STEL_ALERT;
          break;
        }
        if ( $alerts['alertType'] == CRITICAL_ALERT ) {
          $infoValue = CRITICAL_ALERT;
          continue;  // to check for stel or other alerts.
        } else if ( $alerts['alertType'] == WARNING_ALERT ) {
          $infoValue = WARNING_ALERT;
          continue;  // to check for stel or other alerts.
        }
        else if ( $alerts['alertType'] == OUTOFRANGE_ALERT ) {
          $infoValue = OUTOFRANGE_ALERT;
          continue;  // to check for stel or other alerts.
        }
      }
    }

    $deviceID=$row['deviceID'];
    if (! isset($deviceConfigData[$deviceID]) ) {
      continue;
    }
    $locationID = $deviceConfigData[$deviceID]['locationID'];
    $branchID = $deviceConfigData[$deviceID]['branchID'];
    $facilityID = $deviceConfigData[$deviceID]['facilityID'];
    $buildingID = $deviceConfigData[$deviceID]['buildingID'];
    $floorID = $deviceConfigData[$deviceID]['floorID'];
    $zoneID = $deviceConfigData[$deviceID]['zoneID'];

    $aggValueSql = "INSERT INTO sensorReportData (`locationID`, `branchID`,`facilityID`,`buildingID`,`floorID`,`zoneID`, `deviceID`, `sensorID`,  `minScaledVal`,`maxScaledVal`,`avgScaledVal`, `info`, `collectedTime`)  VALUES ('$locationID', '$branchID', '$facilityID', '$buildingID', '$floorID', '$zoneID' , '".$row['deviceID']."','".$row['sensorID']."','".$row['minScaledVal']."','".$row['maxScaledVal']."','".$row['avgScaledVal']."','".$infoValue."','".$collectedTime."' )";
    $insertCount++;
    if ($debugFlag) { echo "<br/> Insert SQL = $aggValueSql"; }              
    mysqli_query($dbRptConn,$aggValueSql) or die(mysqli_error($dbRptConn));
}

echo "<br/>Processed and inserted [$insertCount] Values<br/>";

$updateAllAqiSql = "UPDATE zones SET aqiValue = null  where aqiValue IS NOT NULL";
echo $updateAllAqiSql;
mysqli_query($dbConfigConn,$updateAllAqiSql) or die(mysqli_error($dbConfigConn));
echo "<br/>Updated Zone values to null <br/>";

cleanOldRecords();

if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             


function aggDeviceDataDaily($yesterdayStartTime, $yesterdayEndTime) {
  global $dbTmsConn;
  global $debugFlag;

  $collectedTime = $yesterdayEndTime;

  $insertCount = 0;
  //aggregate Data every 1440 minute (1 day data) 
  $sql = "SELECT deviceID, sensorID,  min(scaledValue) as minScaledVal, max(scaledValue) as maxScaledVal, AVG(scaledValue) as avgScaledVal, info  FROM `sensorSegregatedValues` WHERE collectedTime >= '$yesterdayStartTime' AND collectedTime <= '$yesterdayEndTime' group by deviceID, sensorID, info";
  if ($debugFlag) { echo "<br/>Processing  Minute[1 DAY] - $sql"; }
  $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
  while ($row = mysqli_fetch_assoc($result))
  {
      if ($row['maxScaledVal'] != 0) {
        $deviceID = $row['deviceID'];
        $sensorID = $row['sensorID'];
        $tableName = getDeviceTableName($deviceID,ONE_DAY);
        $sensorValueString = SENSOR_NORMAL;
        $sensorValueString = getSensorValueString($sensorID, $row['maxScaledVal']);
        $aggValueSql = "INSERT INTO $tableName (`deviceID`, `sensorID`,  `minScaledVal`,`maxScaledVal`,`avgScaledVal`, `info`, `collectedTime`)  VALUES ('".$row['deviceID']."','".$row['sensorID']."','".$row['minScaledVal']."','".$row['maxScaledVal']."','".$row['avgScaledVal']."','".$row['info']."','".$collectedTime."' )";
        $insertCount++;
        if ($debugFlag) { echo "<br/> Insert SQL = $aggValueSql"; }              
        $aggValuesResut = mysqli_query($dbTmsConn,$aggValueSql) or die(mysqli_error($dbTmsConn));
      }
  }
  echo "<br/>Processed and inserted [$insertCount] Values<br/>";
}


function getSensorValueString($sensorID, $sensorValue) {

  global $sensorConfigData;

  if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == HIGH_ALERT_TYPE) {
    if ($sensorValue > $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) {
        return OUTOFRANGE_ALERT;
    }
  }
  else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == LOW_ALERT_TYPE) {
      if ($sensorValue < $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) {
        return OUTOFRANGE_ALERT;      
      }
  }else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == BOTH_ALERT_TYPE) {
      if ($sensorValue > $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) {
        return OUTOFRANGE_ALERT;      
      }
      if ($sensorValue < $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) {
        return OUTOFRANGE_ALERT;
      }
  }

  if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == HIGH_ALERT_TYPE) {
    if ($sensorValue > $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) {
      return CRITICAL_ALERT;
    }
  }
  else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == LOW_ALERT_TYPE) {
      if ($sensorValue < $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) {
        return CRITICAL_ALERT;
      }
  }else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == BOTH_ALERT_TYPE) {
      if ($sensorValue > $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) {
        return CRITICAL_ALERT;
      }
      if ($sensorValue < $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) {
        return CRITICAL_ALERT;
      }
  }


  if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == HIGH_ALERT_TYPE) {
    if ($sensorValue > $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
        return WARNING_ALERT;
    }
  }
  else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == LOW_ALERT_TYPE) {
      if ($sensorValue < $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
        return WARNING_ALERT;
      }
  }else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == BOTH_ALERT_TYPE) {
      if ($sensorValue > $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
        return WARNING_ALERT;
      }
      if ($sensorValue < $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
        return WARNING_ALERT;
      }
  }

  return SENSOR_NORMAL;
}

?>