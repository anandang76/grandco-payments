<?php

date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/dbTmsConn.php");
include("../includes/constantsVals.php");
include("../includes/genFunctions.php");
include("rptGenFunctions.php");
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/mailFunction.php';

class CustomTCPDF extends TCPDF {
  public function Header() {
  }

  public function Footer() {
    $this->SetFont('times', '', 12);
    $this->SetY(-12);
    $this->Cell(277, 7, 'Page # ' . $this->getAliasNumPage(), 'T', false, 'R');
  }
}// end of customTPPDF

$sensorConfigData=[];
$deviceConfigData=[];
$namesConfigData=[];

//this will read all the configuration of sensor from the prefetched file.
//readConfigFiles();
readLocationConfigDB();
readDeviceConfigDB();
readSensorConfigDB();
$fromDateIn='';
$toDateIn='';
$userEmail='';
$sendEmail='';
$locationID='';
$branchID='';
$facilityID='';
$buildingID='';
$floorID='';
$zoneID='';
$deviceID='';

extract($_GET);

if ($sendEmail == "YES"){
  if ($userEmail == '') {
    $data = array(
      'status' => 'error',
      'msg' => 'User Email not given to send Email',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
  }
}

if ($fromDateIn == '' OR $toDateIn == '') {
    $data = array(
        'status' => 'error',
        'msg' => 'input values missing  fromDateIn, toDateIn',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
}

$fromDate = $fromDateIn.' 00:00:00';
$toDate = $toDateIn.' 23:59:59';

if($deviceID == "all"){
  $deviceID = "";
}

$filters = array_filter([
  "locationID" => $locationID,
  "branchID" => $branchID,
  "facilityID" => $facilityID,
  "buildingID" => $buildingID,
  "floorID" => $floorID,
  "zoneID" => $zoneID,
  "deviceID" => $deviceID
]);

$sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, deviceName, sensorTag, collectedTime, closedTime, diffMinutes, value, alertType, msg, statusMessage, alarmClearedUser FROM `alertCrons` WHERE collectedTime >= '$fromDate' AND collectedTime <= '$toDate'";

if(!empty($filters)){
  foreach ($filters as $key => $value) {
    $sql = $sql." AND $key = '$value'";
  }
}

$sql = "$sql order by zoneID, id DESC";

// if ($deviceID == '') {
//   $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, deviceName, sensorTag, collectedTime, closedTime, diffMinutes, value, alertType, msg, statusMessage, alarmClearedUser FROM `alertCrons` WHERE collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by zoneID, id DESC ";
// }
// else {
//   $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, deviceName, sensorTag, collectedTime, closedTime, diffMinutes, value, alertType, msg, statusMessage, alarmClearedUser FROM `alertCrons` WHERE deviceID = '$deviceID' AND collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by zoneID, id DESC ";
// }

$getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
if ($getResult->num_rows <= 0) { 
    $data = array(
      'status' => 'error',
      'msg' => 'No data available',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}

$olderZoneID = '';
$varHTML = '';

$pdf = new CustomTCPDF(); // Create TCPDF instance
$pdf->SetPageOrientation('L');
$pdf->SetFont('times', '', 12);

$rowCountColorInfo=0;
while ($result = mysqli_fetch_assoc($getResult))
{
  $rowCountColorInfo++;
  if ($olderZoneID != $result['zoneID']) {

    if ($varHTML!='') {
      $rowCountColorInfo=1;
      $varHTML .= '</tbody></table></body></html>';
      $pdf->AddPage();
      $pdf->writeHTML($varHTML, true, false, true, false, '');
    }

    $olderZoneID = $result['zoneID'];
    $varHTML = getAlarmsRptHeader($olderZoneID, $deviceID, $fromDateIn, $toDateIn, $userEmail);
  }

  $displayDateTime='';
  $dateObj = new DateTime($result['collectedTime']);
  $collectedTime = $dateObj->format(REPORT_DATE_TIME_FORMAT);
  if ($result['closedTime'] != '') {
    $dateObj = new DateTime($result['closedTime']);
    $closedTime = $dateObj->format(REPORT_DATE_TIME_FORMAT);
    $displayDateTime = $collectedTime."<br>".$closedTime;
  }
  else {
    $displayDateTime=$collectedTime;
  }

  $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
  if (($rowCountColorInfo %2) == 0) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
  }

  $diffMinutes='';
  if ( $result['diffMinutes'] == '' ) {
    $diffMinutes = " - ";
  }
  else {
    $diffMinutes = $result['diffMinutes'];
  }
  $valueString='';
  if ($result['alertType'] == DEVICEDISCONNECTED_ALERT) {
    $valueString = ' - ' ;
  }
  else {
    $valueString = number_format($result['value'],2);
  }

  $varHTML .= '<tr style="background-color: '.$cellColor.';">
          <td style=" text-align: center;" width="15%" >'.$displayDateTime.'</td>
          <td style=" text-align: center;" width="8%">'.$diffMinutes.'</td>
          <td  width="10%">'.$result['deviceName'].'</td>
          <td  width="10%">'.$result['sensorTag'].'</td>
          <td style=" text-align: center;" width="6%">'.$valueString.'</td>
          <td width="9%">'.$result['alertType'].'</td>
          <td width="17%" >'.$result['msg'].'</td>
          <td width="17%">'.$result['statusMessage'].'</td>
          <td width="8%">'.$result['alarmClearedUser'].'</td>
        </tr>';
}

if($varHTML != '') {
  $varHTML .= '</tbody></table></body></html>';
  $pdf->AddPage();
  $pdf->writeHTML($varHTML, true, false, true, false, '');
}

$rnd = rand(100, 999);
$fileDisplayName = 'Alarms Reports.pdf';
$pdfPath = BASE_FILE_PATH_REPORTS.'/alarmsReports_'.$rnd.'.pdf';
$pdf->Output($pdfPath, 'F');

//call email and send email. 
if ($sendEmail == "YES"){
  $tag='';
  if ($deviceID != '') {
    $tag = $deviceConfigData[$deviceID]['deviceName'];
  }

  sendReportEmails(ALARM_REPORT, $pdfPath, $fileDisplayName,$tag, $fromDateIn, $toDateIn, $userEmail);
  
  $data = array(
      'status' => 'success',
      'Msg' => 'Email Sent',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  echo $jsonString;
  return ;
}

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="Alarms Reports.pdf"');
header('Content-Length: ' . filesize($pdfPath));
readfile($pdfPath);

//if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>