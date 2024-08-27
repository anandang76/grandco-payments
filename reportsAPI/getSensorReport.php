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
    $this->Cell(190, 7, 'Page # ' . $this->getAliasNumPage(), 'T', false, 'R');
  }
}// end of customTPPDF

$pdf = new CustomTCPDF(); // Create TCPDF instance
$pdf->SetPageOrientation('P');
$pdf->SetFont('times', '', 12);


//if ($debugFlag) { $funcStartTime = microtime(true); }

$sensorConfigData=[];
$deviceConfigData=[];
$namesConfigData=[];

//this will read all the configuration of sensor from the prefetched file.
readLocationConfigDB();
readDeviceConfigDB();
readSensorConfigDB();

$fromDateIn='';
$toDateIn='';
$userEmail='';
$sendEmail='';
$deviceID='';

$locationID = ''; 
$branchID = '';
$facilityID = '';
$buildingID = '';
$floorID = '';
$zoneID = '';

extract($_GET);

if ($sendEmail == "YES"){
  if ($userEmail == '') {
    $data = array(
      'status' => 'error',
      'msg' => 'User Email not given to send Email',
  );
  $jsonString = json_encode($data);
  header('Content-Type: application/json');
  //echo $jsonString;
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

$sql = "SELECT  deviceID, sensorID, minScaledVal, avgScaledVal, maxScaledVal, info, collectedTime, zoneID  FROM `sensorReportData` WHERE collectedTime >= '$fromDate' AND collectedTime <= '$toDate'";

if(!empty($filters)){
  foreach ($filters as $key => $value) {
    $sql = $sql." AND $key = '$value'";
  }
}

$sql = $sql." order by zoneID, collectedTime DESC, sensorID ";

// echo $sql;
// exit;

// if ($deviceID == '') {
//   if($locationID == ''){
//     $sql = "SELECT  deviceID, sensorID, minScaledVal, avgScaledVal, maxScaledVal, info, collectedTime, zoneID  FROM `sensorReportData` WHERE collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by zoneID, collectedTime DESC, sensorID ";

//   }else{

//     $sql = "SELECT  deviceID, sensorID, minScaledVal, avgScaledVal, maxScaledVal, info, collectedTime, zoneID  FROM `sensorReportData` WHERE locationID = '$locationID' AND branchID = '$branchID' AND facilityID = '$facilityID' AND buildingID = '$buildingID' AND floorID = '$floorID' AND zoneID = '$zoneID' AND collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by zoneID, collectedTime DESC, sensorID ";

//   }
// }else {
//   if($locationID == ''){
//     $sql = "SELECT  deviceID, sensorID, minScaledVal, avgScaledVal, maxScaledVal, info, collectedTime , zoneID FROM `sensorReportData` WHERE deviceID = '$deviceID' AND collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by collectedTime DESC, sensorID ";
//   }else{

//     $sql = "SELECT  deviceID, sensorID, minScaledVal, avgScaledVal, maxScaledVal, info, collectedTime , zoneID FROM `sensorReportData` WHERE deviceID = '$deviceID' AND locationID = '$locationID' AND branchID = '$branchID' AND facilityID = '$facilityID' AND buildingID = '$buildingID' AND floorID = '$floorID' AND zoneID = '$zoneID' AND collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by collectedTime DESC, sensorID ";
//   }
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
      //var_dump($varHTML);
      $pdf->writeHTML($varHTML, true, false, true, false, '');
    }

    $olderZoneID = $result['zoneID'];
    $deviceID = $result['deviceID'];
    
    $varHTML = getSensorRptHeader($deviceID, $fromDateIn, $toDateIn, $userEmail);
  }
    
  $dateObj = new DateTime($result['collectedTime']);
  $datePart = $dateObj->format(REPORT_DATE_FORMAT);

  if ($olderDate != $datePart) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
    if (($rowCountColorInfo %2) == 0) {
      $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
    }
  
    $varHTML .=  '<tr style="background-color: '.$cellColor.';">
            <th style=" text-align: left;" colspan="6"><b>'.$datePart.'</b></th>
          </tr>';

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

  $varHTML .= '<tr style="background-color: '.$cellColor.';">
    <td colspan="2" style=" text-align: center;" width="48%" >'.$sensorTag.'</td>
    <td style=" text-align: center;" width="13%">'.number_format($result['minScaledVal'], 2).'</td>
    <td style=" text-align: center;" width="13%">'.number_format($result['maxScaledVal'], 2).'</td>
    <td style=" text-align: center;" width="13%">'.number_format($result['avgScaledVal'], 2).'</td>
    <td style=" text-align: center;" width="13%">'.$result['info'].'</td>
  </tr>';

}

$varHTML .= '</tbody></table></body></html>';


$pdf->AddPage();
// var_dump($varHTML);
$pdf->writeHTML($varHTML, true, false, true, false, '');

$rnd = rand(100, 999);
$fileDisplayName = 'Sensor Reports.pdf';
$pdfPath = BASE_FILE_PATH_REPORTS.'/sensorReports_'.$rnd.'.pdf';
$pdf->Output($pdfPath, 'F');

usleep(2000);
//call email and send email. 
if ($sendEmail == "YES"){
  $tag='';
  if ($deviceID != '') {
    $tag = $deviceConfigData[$deviceID]['deviceName'];
  }
  else {
    $tag = " ALL";
  }

  sendReportEmails(SENSOR_REPORT, $pdfPath, $fileDisplayName, $tag, $fromDateIn, $toDateIn, $userEmail);
  
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
header('Content-Disposition: attachment; filename="Sensor Reports.pdf"');
header('Content-Length: ' . filesize($pdfPath));
readfile($pdfPath);

//if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>