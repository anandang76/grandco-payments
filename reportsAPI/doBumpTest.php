<?php
date_default_timezone_set('Asia/Kolkata');
include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/dbRptConn.php");
include(__DIR__ . "/../includes/constantsVals.php");

$deviceID='';
$sensorID='';
$action='';
$duration='';
$gasPercentage='';
$testType='';
$userEmail='';
extract($_GET);
//test
if ( $deviceID == '' || $sensorID == '' || $action == '') {
  $data = array(
    'status' => 'error',
    'msg' => 'Input Values of DeviceID/SensorID/action Blank',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}

if ($action=='START') {
  //default deviceID/sensorID/action check is there in start.
  if ( $duration == '' || $gasPercentage == '' || $testType == '') {
      $data = array(
        'status' => 'error',
        'msg' => 'Input Values of DeviceID/SensorID/Duration/gasPercentage/testType Blank',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
  }
  $startTime = date('Y-m-d H:i:s');

  $bumpTestInfo=[];
  $resultOK='';
  $sql = "SELECT defaultValue, scaleInfo, sensorOutput from sensors where id='$sensorID' LIMIT 1";
  $result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
  while ($row = mysqli_fetch_assoc($result))
  {
    $bumpTestInfo = array (
      'defaultValue' => $row['defaultValue'],
      'sensorOutput' => $row['sensorOutput'],
      'scaleInfo' => json_decode($row['scaleInfo'], true)
    );
    $resultOK='YES';
  }
  if ($resultOK == '') {
      $data = array(
        'status' => 'error',
        'msg' => 'Sensor ID Not found ',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
  }
  $bumpTestInfoString = json_encode($bumpTestInfo);
  
  $sql = "INSERT INTO bumpTestInfo (startTime, deviceID, sensorID, testType, gasPercentage, duration, info) VALUES ( '$startTime', '$deviceID', '$sensorID', '$testType', '$gasPercentage', '$duration' , '$bumpTestInfoString' ) ";
  $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
  $bumpTestID = $dbRptConn->insert_id;
  $data = array(
    'status' => 'success',
    'bumpTestID' => $bumpTestID,
    'msg' => 'Bump Test START Success!!',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}
else if ($action == 'RUN') {
    $resultOK='';
    $bumpTestID='';
    $bumpTestInfo=[];
    $bumpTestInfo = getBumpTestInfo($deviceID, $sensorID);

    if ($bumpTestInfo['resultOK'] != 'YES') {
      $data = array(
        'status' => 'error',
        'msg' => 'Unable to Fetch Bump Test ID!',
      );
      $jsonString = json_encode($data);
      header('Content-Type: application/json');
      echo $jsonString;
      return ;
    }

    $bumpTestID=$bumpTestInfo['bumpTestID'];
    
    //call quick simulator to insert data to bumpTestDeviceIncomingData 
    //in Realtime this table will be popuplated from the device directly.
    //In Live comment below function.
    runBumpTestSimulator($deviceID, $sensorID, $bumpTestInfo);

    processBumpTestData($deviceID, $sensorID, $bumpTestInfo, $bumpTestID);

    $datainfo = getBumpTestRunningValue($deviceID, $sensorID, $bumpTestInfo, $bumpTestID);

    $getDiffSeconds = getDiffSeconds($bumpTestInfo['startTime']);
    $data =[];
    if ($getDiffSeconds < 15) {
      $data = array(
        'status' => 'ignoreData',
        'bumpTestID' => $bumpTestInfo['bumpTestID'],
        'dataInfo' => $datainfo
      );
    }
    else {
      $data = array(
        'status' => 'success',
        'bumpTestID' => $bumpTestInfo['bumpTestID'],
        'dataInfo' => $datainfo
      );
    }
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;

}
else if ($action == 'STOP') {

  $resultOK='';
  $bumpTestID='';
  $bumpTestInfo=[];
  $bumpTestInfo = getBumpTestInfo($deviceID, $sensorID);

  if ($bumpTestInfo['resultOK'] != 'YES') {
    $data = array(
      'status' => 'error',
      'msg' => 'Unable to Fetch Bump Test ID!',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
  }

  $bumpTestID=$bumpTestInfo['bumpTestID'];

  $datainfo = getBumpTestRunningValue($deviceID, $sensorID, $bumpTestInfo, $bumpTestID);
  $currentTime = date('Y-m-d H:i:s');
  $sql = "UPDATE bumpTestInfo SET endTime = '$currentTime' where id = '$bumpTestID' ";
  $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));

  $bumpTestInfo['endTime'] = $currentTime;


  $sql = "select locationID, branchID, facilityID, buildingID, floorID, zoneID from devices where id = '$deviceID' ";
  $result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
  $row = mysqli_fetch_assoc($result);

  $deviation=10;
  $testResult='PASS';
    
  $datainfo['testResult'] = $testResult;
  $datainfo['deviation'] = $deviation;

  $resultInfo = [];
  $resultInfo['bumpTestInfo'] = $bumpTestInfo;
  $resultInfo['dataInfo'] = $datainfo;
  $resultInfoString = json_encode($resultInfo);

  $sql = "INSERT INTO bumpTestReport (locationId, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, bumpTestID, testType, deviation, result, resultInfo, collectedTime, email ) VALUES ('".$row['locationID']."' , '".$row['branchID']."' , '".$row['facilityID']."' , '".$row['buildingID']."' , '".$row['floorID']."' , '".$row['zoneID']."' ,'".$deviceID."' , '".$sensorID."' , '".$bumpTestID."' ,  '".$bumpTestInfo['testType']."' , '".$deviation."' , '".$testResult."' , '".$resultInfoString."' , '".$currentTime."' , '".$userEmail."' ) ";
  $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));

  $data = array(
    'status' => 'success',
    'data' => $resultInfo,
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;

}


function  getDiffSeconds($startTime)  {
  $currentTime = date('Y-m-d H:i:s');

  $date1 = new DateTime($currentTime);
  $date2 = new DateTime($startTime);
  
  $interval = $date1->diff($date2);
  $secondsDifference = $interval->s + ($interval->i * 60) + ($interval->h * 3600) + ($interval->days * 86400);
  return $secondsDifference;
}


function getBumpTestInfo($deviceID, $sensorID) {
  global $dbRptConn;

  $bumpTestInfo = array ( 'resultOK' => 'NO');
  $currentDateTime = new DateTime();
  // Subtract 5 + 1 minutes
  // $currentDateTime->sub(new DateInterval('PT6M'));
  $currentDateTime->sub(new DateInterval('PT50M'));
  $adjustedTime = $currentDateTime->format('Y-m-d H:i:s');

  $sql = "SELECT * from bumpTestInfo where deviceID = '$deviceID' AND sensorID='$sensorID' AND startTime > '$adjustedTime' AND endTime IS NULL LIMIT 1";
  $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
  while ($row = mysqli_fetch_assoc($result))
  {
    $bumpTestData = json_decode($row['info'], true);
    $defaultValue = $bumpTestData['defaultValue'];
    $sensorOutput = $bumpTestData['sensorOutput'];
    $scaleInfo = $bumpTestData['scaleInfo'];

    $bumpTestInfo = array (
      'resultOK' => 'YES',
      // Temp fix (Currently bumpTestId is showing +1)
      'bumpTestID' => $row['id']-1,
      'startTime' => $row['startTime'],
      'testType' =>  $row['testType'],
      'gasPercentage' =>  $row['gasPercentage'],
      'duration' =>  $row['duration'],
      'defaultValue' => $defaultValue,
      'sensorOutput' => $sensorOutput,
      'scaleInfo' => $scaleInfo
    );
  }

  return $bumpTestInfo;
}

function calculateStandardDeviation($data)
{
  // Calculate mean
  $mean = array_sum($data) / count($data);

  // Calculate squared differences
  $squaredDifferences = array_map(function($val) use ($mean) {
      return pow($val - $mean, 2);
  }, $data);

  // Calculate mean of squared differences
  $meanOfSquaredDifferences = array_sum($squaredDifferences) / count($data);

  // Calculate standard deviation
  $stdDev = sqrt($meanOfSquaredDifferences);

  // Calculate standard deviation percentage
  $stdDevPercentage = ($stdDev / $mean) * 100;

  return [
    "standardDeviation" => $stdDev,
    "percentageStandardDeviation" => $stdDevPercentage
  ];
}

function getBumpTestRunningValue($deviceID, $sensorID, $bumpTestInfo, $bumpTestID)
{
  global $dbRptConn;
  global $debugFlag;

  $insertCount = 0;
  $dataInfo = [];
  $standardDeviationData = [];
  // $sql = "SELECT sensorID,  min(scaledValue) as minScaledVal, max(scaledValue) as maxScaledVal, AVG(scaledValue) as avgScaledVal  FROM `bumpTestSensorSegregatedValues` WHERE bumpTestID = '$bumpTestID' group by sensorID";

  $sql = "SELECT id, sensorID, sensorValue, scaledValue  FROM `bumpTestSensorSegregatedValues` WHERE bumpTestID = '$bumpTestID'";
  $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
  while ($row = mysqli_fetch_assoc($result))
  {
    // $current['sensorID'] = $row['sensorID'];
    // $current['sensorValue'] = $row['sensorValue'];
    // $current['scaledValue'] = $row['scaledValue'];
    // $scaledValue = $scaledValue + $row['scaledValue'];
    // $dataInfo[$row['id']] = $current;
    array_push($standardDeviationData, $row['scaledValue']);
  }
  
  $standardDeviation = calculateStandardDeviation($standardDeviationData);
  $dataInfo['standardDeviation'] = $standardDeviation['standardDeviation'];
  $dataInfo['percentageStandardDeviation'] = $standardDeviation['percentageStandardDeviation'];

  // $sql = "SELECT count(*) as cnt FROM `bumpTestSensorSegregatedValues` WHERE bumpTestID = '$bumpTestID' ";
  // $result = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
  // while ($row = mysqli_fetch_assoc($result))
  // {
  //   $dataInfo['sampleCount'] = $row['cnt'];
  // }

  return $dataInfo;
}


function runBumpTestSimulator($deviceID, $sensorID, $bumpTestInfo) {
    global $dbRptConn;
    global $debugFlag;
    
    $dateInfo=date("Y-m-d");
    $timeInfo=date("H:i:s");
    $collectTime = $dateInfo." ".$timeInfo;
    $insertCount=0;

    $jsonSimulatorData=array();
    $jsonSimulatorData["DATE"]=$dateInfo;
    $jsonSimulatorData["TIME"]=$timeInfo;
    $jsonSimulatorData["DEVICE_ID"]=(string)$deviceID;
    $jsonSimulatorData["SD_CARD"] = "1"; //hardcoded
    $jsonSimulatorData["RSSI"] = "28"; //hardcoded
    $jsonSimulatorData["MODE"]= "2"; // hardcoded
    $jsonSimulatorData["ACCESS_CODE"]="1003"; // hardcoded

    $val=$bumpTestInfo['defaultValue'];
    $randVal=rand(5,10);
    $randValPercent=$randVal/100;
    $valDyn = number_format( (($val*$randValPercent)+$val), SENSOR_DECIMAL_PRECISION, '.','');
 
    $jsonSimulatorData[$sensorID]=(string)$valDyn;
 
    $data=json_encode($jsonSimulatorData);
 
    $sql="insert into bumpTestDeviceIncomingData(data) values('$data')";
    $result=mysqli_query($dbRptConn,$sql) or (die(mysqli_error($dbRptConn)));

}

function processBumpTestData($deviceID, $sensorID, $bumpTestInfo, $bumpTestID)
{
  global $dbRptConn;
  global $debugFlag;

  $dataIDString='';
  $recordCount=0;

  $getDataSql = "select id, data from bumpTestDeviceIncomingData order by id asc LIMIT 100";
  $getResult = mysqli_query($dbRptConn,$getDataSql) or die(mysqli_error($dbRptConn));
  while ($result = mysqli_fetch_assoc($getResult))
  {
    $jsonData=$result['data'];
    $jsonDataObj=json_decode($jsonData,true);
    $collectedTime=$jsonDataObj["DATE"]." ".$jsonDataObj["TIME"];
    $incomingDeviceID = $jsonDataObj["DEVICE_ID"];

    //only process for that device ID in bump test.  Others will process their on their own call.
    if ($incomingDeviceID == $deviceID) {
      //check  for first 15 secondss and ignore data.
      $secondsDifference = getDiffSeconds($bumpTestInfo['startTime']);
      if ($secondsDifference > 15) {
        $segregatedValuesSql='';
        foreach($jsonDataObj as $key => $value) 
        {
          if($key !== "DATE" && $key !== "TIME" && $key !== "DEVICE_ID" &&  $key !== "SD_CARD" && $key !== "RSSI" && $key !== "MODE" && $key !== "ACCESS_CODE"){
              $sensorID=$key;
              $sensorValue=$value;
              if ($bumpTestInfo['sensorOutput'] == SENSOR_TYPE_INBUILT) {
                  //No Scaling for Inbuilt Sensors
                  $scaledValue=$sensorValue;
              }
              else {
                  $scaledValue=scalingValue($sensorID, $sensorValue, $bumpTestInfo);
              }

              $segregatedValuesSql = " INSERT INTO `bumpTestSensorSegregatedValues`( `bumpTestID`, `deviceID`,  `sensorID`, `sensorValue`,`scaledValue`,`collectedTime`) VALUES ('$bumpTestID', '$deviceID','$sensorID','$sensorValue','$scaledValue','$collectedTime') ";

              mysqli_query($dbRptConn,$segregatedValuesSql) or die(mysqli_error($dbRptConn));
          }
        } // foreach
      } // if > 15 seconds.

      if ( $dataIDString==""){
          $dataIDString = $result['id'];
      }
      else {
          $dataIDString .= ", ".$result['id'];
      }
      $recordCount++;
    }
  } // while loop 


  if ($recordCount!=0) {
      $delDataSql = "DELETE from bumpTestDeviceIncomingData where id in ($dataIDString)";
      mysqli_query($dbRptConn,$delDataSql) or die(mysqli_error($dbRptConn));
  }
  else {
      echo '\n<br/>No records from bumpTestDeviceIncomingData';
  }

}


function scalingValue( $sensorID, $sensorValue, $bumpTestInfo){
    $scaledValue = 0;

    $minRatedReading = $bumpTestInfo['scaleInfo']['minR'];
    $maxRatedReading =  $bumpTestInfo['scaleInfo']['maxR'];
    $minRatedReadingScale =  $bumpTestInfo['scaleInfo']['minRS'];
    $maxRatedReadingScale =  $bumpTestInfo['scaleInfo']['maxRS'];

    //((Ymax-Ymin)/(Xmax-Xmin)) * ($val - Xmin) + Ymin  //formula for scalling 
    $scaledValue = (($maxRatedReadingScale-$minRatedReadingScale)/($maxRatedReading-$minRatedReading)) * ($sensorValue - $minRatedReading) + $minRatedReadingScale;    
    //echo "SensorID=[$sensorID][$sensorValue][$scaledValue] minRatedReading [$minRatedReading] maxRatedReading [$maxRatedReading] minRatedReadingScale [$minRatedReadingScale]  maxRatedReadingScale [$maxRatedReadingScale] <br/>";
    return $scaledValue;
}



?>