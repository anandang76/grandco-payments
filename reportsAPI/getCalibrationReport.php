<?php

date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/dbRptConn.php");
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

$pdf = new CustomTCPDF(); // Create TCPDF instance
$pdf->SetPageOrientation('L'); 
$pdf->SetFont('times', '', 12);

//if ($debugFlag) { $funcStartTime = microtime(true); }

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

$locationID = '';
$branchID= '';
$facilityID= '';
$buildingID= '';
$floorID= '';
$zoneID= '';
$deviceID= '';


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
        'msg' => 'input values missing fromDateIn, toDateIn',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
}

$fromDate = $fromDateIn.' 00:00:00';
$toDate = $toDateIn.' 23:59:59';

if ($deviceID == 'all') {
  $deviceID='';
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

$sql = "SELECT  deviceID, sensorID, zoneID,userEmail,calibratedDate, result, calibrationDueDate,nextCalibrationDueDate, collectedDate  FROM `calibrationReport` WHERE collectedDate >= '$fromDate' AND collectedDate <= '$toDate'";

if(!empty($filters)){
  foreach ($filters as $key => $value) {
    $sql = $sql." AND $key = '$value'";
  }
}

$sql = "$sql order by zoneID,collectedDate DESC, sensorID";

// if ($deviceID == '' || $deviceID == 'all'){
//   $sql = "SELECT  deviceID, sensorID, zoneID,userEmail,calibratedDate, result, calibrationDueDate,nextCalibrationDueDate, collectedDate  FROM `calibrationReport` WHERE collectedDate >= '$fromDate' AND collectedDate <= '$toDate' order by zoneID,collectedDate DESC, sensorID ";
// }else{
//   $sql = "SELECT  deviceID, sensorID, zoneID, userEmail,calibratedDate, result, calibrationDueDate,nextCalibrationDueDate, collectedDate  FROM `calibrationReport` WHERE deviceID = '$deviceID' AND collectedDate >= '$fromDate' AND collectedDate <= '$toDate' order by zoneID,collectedDate DESC, sensorID ";
// }
// echo $sql;

$getResult = mysqli_query($dbRptConn,$sql) or die(mysqli_error($dbRptConn));
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
$varHTML='';

$rowCountColorInfo=0;
$olderDate='';

$rowCountColorInfo=0;
$olderDate='';
while ($result = mysqli_fetch_assoc($getResult))
{
  $rowCountColorInfo++;

  if ($olderZoneID != $result['zoneID']) {
    if($varHTML!='') {
      $olderDate='';
      $rowCountColorInfo=1;
      $varHTML .= '</tbody></table></body></html>';
      $pdf->AddPage();
      // Set font
      // var_dump($varHTML);
      $pdf->writeHTML($varHTML, true, false, true, false, '');
    }

    $olderZoneID = $result['zoneID'];
    $deviceID = $result['deviceID'];
    
    $varHTML = getCalibrationRptHeader($deviceID, $fromDateIn, $toDateIn, $userEmail);
  }


  $dateObj = new DateTime($result['collectedDate']);
  $datePart = $dateObj->format(REPORT_DATE_FORMAT);

  if ($olderDate != $datePart) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
    if (($rowCountColorInfo %2) == 0) {
      $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
    }

    $olderDate=$datePart;
    $rowCountColorInfo++;
  }

  $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
  if (($rowCountColorInfo %2) == 0) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
  }
  $sensorID = $result['sensorID'];
  if (! isset($sensorConfigData[$sensorID])) {
    continue;
  }
  $sensorTag = $sensorConfigData[$sensorID]['sensorTag'];

  $deviceID = $result['deviceID'];
  if (! isset($deviceConfigData[$deviceID])) {
    continue;
  }
  $deviceTag = $deviceConfigData[$deviceID]['deviceName'];

  $dateObj1 = new DateTime($result['collectedDate']);
  $collectedDate = $dateObj1->format(REPORT_DATE_TIME_FORMAT);

  // $dateObj2 = new DateTime($result['calibrationDueDate']);
  $calibrationDueDate = $result['calibrationDueDate'] !== null ? (new DateTime($result['calibrationDueDate']))->format(REPORT_DATE_FORMAT) : null;

  $dateObj3 = new DateTime($result['calibratedDate']);
  $calibratedDate = $dateObj3->format(REPORT_DATE_FORMAT);

  $dateObj4 = new DateTime($result['nextCalibrationDueDate']);
  $nextCalibrationDueDate = $dateObj4->format(REPORT_DATE_FORMAT);

  $varHTML .= '<tr style="background-color: '.$cellColor.';">
  <td style=" text-align: center;" width="13%" >'.$collectedDate.'</td>
    <td style=" text-align: center;" width="10%" >'.$deviceTag.'</td>
    <td style=" text-align: center;" width="13%" >'.$sensorTag.'</td>
    <td style=" text-align: center;" width="13%">'.$calibrationDueDate.'</td>
    <td style=" text-align: center;" width="13%">'.$calibratedDate.'</td>
    <td style=" text-align: center;" width="9%">'.$result['result'].'</td>
    <td style=" text-align: center;" width="13%">'.$nextCalibrationDueDate.'</td>
    <td style=" text-align: center;" width="16%">'.$result['userEmail'].'</td>
  </tr>';

}

$varHTML .= '</tbody></table></body></html>';
$pdf->AddPage();
// var_dump($varHTML);
$pdf->writeHTML($varHTML, true, false, true, false, '');

$rnd = rand(100, 999);
$fileDisplayName = 'Calibration Reports.pdf';
$pdfPath = BASE_FILE_PATH_REPORTS.'/calibrationReports_'.$rnd.'.pdf';
$pdf->Output($pdfPath, 'F');

//call email and send email. 
if ($sendEmail == "YES"){
  $tag='';
  if ($deviceID != '') {
    $tag = $deviceConfigData[$deviceID]['deviceName'];
  }

  sendReportEmails(CALIBRATION_REPORT, $pdfPath, $fileDisplayName, $tag, $fromDateIn, $toDateIn, $userEmail);
  
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
header('Content-Disposition: attachment; filename="Calibration Reports.pdf"');
header('Content-Length: ' . filesize($pdfPath));
readfile($pdfPath);

//if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>