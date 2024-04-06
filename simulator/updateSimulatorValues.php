<?php
date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/dbTmsConn.php");
include("../includes/constantsVals.php");

$deviceID='';
$deviceID = $_POST['deviceID'];
$dataIncoming = json_decode($_POST['jsonData'], true);

$dataCount = 0;
foreach ($dataIncoming as $key => $value) {
    $dataCount++;
}
if ($dataCount < 1) {
    //atlease 1 sensor values present
    $data = array(
      'status' => 'error',
      'msg' => 'No deviceID or Sensor Data found available',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}

if ($deviceID=='') {
    $data = array(
        'status' => 'error',
        'msg' => 'No deviceID found',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
}

$sql = "SELECT id, deviceName, deviceMode from devices WHERE id = '$deviceID' ";
$result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
if ($result->num_rows <= 0) { 
    $data = array(
      'status' => 'error',
      'msg' => 'No deviceID found available',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}

while ($row = mysqli_fetch_assoc($result))
{
    if ($row['deviceMode'] != DEVICE_MODE_SIMULATOR) {
          $data = array(
            'status' => 'error',
            'msg' => 'Device Not Set to Simulator',
        );
        $jsonString = json_encode($data);
        header('Content-Type: application/json');
        echo $jsonString;
        return ;
    }
}

$dateInfo=date("Y-m-d");
$timeInfo=date("H:i:s");
$collectedTime = $dateInfo." ".$timeInfo;
  
//form this type of array
//{"DATE":"2024-01-14","TIME":"09:46:02","DEVICE_ID":"2","SD_CARD":"1","RSSI":"28","MODE":"2","ACCESS_CODE":"1003","1":"10.3242"}
$jsonSimulatorData=array();
$jsonSimulatorData["DATE"]=$dateInfo;
$jsonSimulatorData["TIME"]=$timeInfo;
$jsonSimulatorData["DEVICE_ID"]=(string)$deviceID;
$jsonSimulatorData["SD_CARD"] = "1"; //hardcoded
$jsonSimulatorData["RSSI"] = "28"; //hardcoded
$jsonSimulatorData["MODE"]= "2"; // hardcoded
$jsonSimulatorData["ACCESS_CODE"]="1003"; // hardcoded

foreach ($dataIncoming as $key => $value) {
    if ($key != "deviceID") {
        $jsonSimulatorData[(string)$key]=(string)$value;
    }
}

$data=json_encode($jsonSimulatorData);
$sql="insert into deviceIncomingData(data, createdAt) values('$data', '$collectedTime')";
//echo $sql;
$result=mysqli_query($dbTmsConn,$sql) or (die(mysqli_error($mysqli)));
$data = array(
  'status' => 'ok',
  'msg' => 'Data Update to database.',
);
$jsonString = json_encode($data);
header('Content-Type: application/json');
echo $jsonString;
return ;


?>
