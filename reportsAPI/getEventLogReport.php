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
$eventName= '';

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

$sql = "";

if( $eventName != '' ){

  $sql = "SELECT * FROM `eventLogReport` WHERE eventName = '$eventName' AND collectedDate >= '$fromDate' AND collectedDate<='$toDate' order by id DESC  ";

}else{
  $sql = "SELECT * FROM `eventLogReport` WHERE collectedDate >= '$fromDate' AND collectedDate<='$toDate' order by id DESC  ";
}

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

$varHTML = '';
$rowCountColorInfo=0;

function iterateJson($dataArray){
    $string = '';
    if ($dataArray !== null) {
       
        foreach ($dataArray as $action => $details) {
            $string .= "<strong>$action</strong><br>"; 
            // var_dump ($details);
            // foreach (explode($details, ',') as $key => $value) {
            //     var_dump($details);
            //     $string .= "$key<br>"; 
            // }
        }
    } else {
        $string = "Failed to decode JSON.";
    }
    return $string; 
}


$varHTML = getEventLogRptHeader($fromDateIn, $toDateIn, $userEmail);
while ($result = mysqli_fetch_assoc($getResult))
{
  $rowCountColorInfo++;
  $dateObj = new DateTime($result['collectedDate']);
  $dateString = $dateObj->format(REPORT_DATE_TIME_FORMAT);
  $dateString = $dateObj->format('d-m-Y H:i:s');

  $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
  if (($rowCountColorInfo %2) == 0) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
  }

  $eventDetails = json_decode($result['eventDetails'], true);
 
  $varHTML .= '<tr style="background-color: '.$cellColor.';">
    <td style=" text-align: center;" width="15%" >'.$dateString.'</td>
    <td style=" text-align: center;" width="25%" >'.$result['userEmail'].'</td>
    <td style=" text-align: center;" width="15%" >'.$result['eventName'].'</td>
    <td style=" text-align: center;" width="45%" >'.$result['eventDetails'].'</td>
   
  </tr>';

}

$varHTML .= '</tbody></table></body></html>';

$pdf = new CustomTCPDF(); // Create TCPDF instance
$pdf->SetPageOrientation('L');
$pdf->SetFont('times', '', 12);
$pdf->AddPage();
// var_dump($varHTML);
$pdf->writeHTML($varHTML, true, false, true, false, '');

$rnd = rand(100, 999);
$fileDisplayName = 'Event Log Reports.pdf';
$pdfPath = BASE_FILE_PATH_REPORTS.'/eventLogReports'.$rnd.'.pdf';
$pdf->Output($pdfPath, 'F');

//call email and send email. 
if ($sendEmail == "YES"){
  sendReportEmails(USER_REPORT, $pdfPath, $fileDisplayName, '', $fromDateIn, $toDateIn, $userEmail);
  
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
header('Content-Disposition: attachment; filename="Event Log Report.pdf"');
header('Content-Length: ' . filesize($pdfPath));
readfile($pdfPath);

//if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>