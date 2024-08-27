<?php

date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/dbRptConn.php");
include("../includes/constantsVals.php");
include("../includes/genFunctions.php");
include("rptGenFunctions.php");

$sensorConfigData=[];
$deviceConfigData=[];
$namesConfigData=[];

//this will read all the configuration of sensor from the prefetched file.
//readConfigFiles();
readLocationConfigDB();
readDeviceConfigDB();
readSensorConfigDB();
$sql = "SELECT  id, deviceName, deviceTag, deviceMode, locationID, branchID, facilityID, buildingID, floorID, zoneID from devices";
$getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));

$varHTML =  '<!DOCTYPE html><html><head><style>table {
  border-collapse: collapse;
  width: 100%;
  }
  th, td {
    border: 1px solid #ccc; 
    padding: 6px;
  }
  </style>
  </head>
  <body><div><table cellspacing="0" cellpadding="2" border="1" style="width:100%; "><thead>
        <tr style="color: '.REPORT_HEADER_FONT_COLOR.'; background-color: '.REPORT_HEADER_COLOR.';">
        <td colspan="10" style="color: '.REPORT_HEADER_FONT_COLOR.'; background-color: '.REPORT_HEADER_COLOR.'; text-align: center;"><b>DEVICE DETAILS</b></td>
      </tr></thead>
      <tbody>
    <tr style=" color: '.REPORT_HEADER_FONT_COLOR.'; background-color: '.REPORT_HEADER_COLOR.';">
            <td >ID</td>
            <td >Name</td>
            <td >Tag</td>
            <td >Mode</td>
            <td >Location</td>
            <td >Branch</td>
            <td >Facility</td>
            <td >Building</td>
            <td >Floor</td>
            <td >Zone</td>
          </tr>';

          $rowCountColorInfo=0;
while ($result = mysqli_fetch_assoc($getResult))
{
  
$rowCountColorInfo++;
$cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
if (($rowCountColorInfo %2) == 0) {
  $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
}

$locationName = $namesConfigData['locations'][$result['locationID']]['locationName'];
$branchName = $namesConfigData['branches'][$result['branchID']]['branchName'];
$facilityName = $namesConfigData['facilities'][$result['facilityID']]['facilityName'];
$buildingName = $namesConfigData['buildings'][$result['buildingID']]['buildingName'];
$floorName = $namesConfigData['floors'][$result['floorID']]['floorName'];
$zoneName = $namesConfigData['zones'][$result['zoneID']]['zoneName'];


$varHTML .=  '  <tr style="background-color: '.$cellColor.';">
  <td >'.$result['id'].'</td>
  <td >'.$result['deviceName'].'</td>
  <td >'.$result['deviceTag'].'</td>
  <td >'.$result['deviceMode'].'</td>
  <td >'.$locationName.'</td>
  <td >'.$branchName.'</td>
  <td >'.$facilityName.'</td>
  <td >'.$buildingName.'</td>
  <td >'.$floorName.'</td>
  <td >'.$zoneName.'</td>
</tr>';

}

$varHTML .= '</tbody></table></body></html>';

echo $varHTML;

?>