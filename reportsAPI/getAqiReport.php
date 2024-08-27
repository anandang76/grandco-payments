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
$zoneID='';

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

if ($zoneID == '' OR $fromDateIn == '' OR $toDateIn == '') {
    $data = array(
        'status' => 'error',
        'msg' => 'input values missing zoneID, fromDateIn, toDateIN',
    );
    $jsonString = json_encode($data);
    header('Content-Type: application/json');
    echo $jsonString;
    return ;
}

$fromDate = $fromDateIn.' 00:00:00';
$toDate = $toDateIn.' 23:59:59';

$sql = "SELECT  *  FROM `aqiZoneSummary` WHERE zoneID = '$zoneID' AND collectedTime >= '$fromDate' AND collectedTime <= '$toDate' order by id DESC";
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
while ($result = mysqli_fetch_assoc($getResult))
{
  $rowCountColorInfo++;
  $dateObj = new DateTime($result['collectedTime']);
  $collectedDate = $dateObj->format(REPORT_DATE_FORMAT);

  $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_ONE;
  if (($rowCountColorInfo %2) == 0) {
    $cellColor = REPORT_ALTERNATIVE_ROW_COLOR_TWO;
  }

  $valArray = json_decode($result['aqiInfo'], true);

    //first time get headers.
    if ($varHTML == '' ) {
        $varHTML = getAqiRptHeader($zoneID, $fromDateIn, $toDateIn, $userEmail);
        $varHTML .=  '<div><table cellspacing="0" cellpadding="2" border="1" style="width:100%; ">
        <thead>
          <tr style="background-color: '.REPORT_HEADER_COLOR.';">
            <th style="color: '.REPORT_HEADER_FONT_COLOR.'; text-align: center; vertical-align: middle; background-color: '.REPORT_HEADER_COLOR.'; " ><b>Date</b></th>
            <th style="color: '.REPORT_HEADER_FONT_COLOR.'; text-align: center; vertical-align: middle; background-color: '.REPORT_HEADER_COLOR.'; " ><b>AqiValue</b></th>
            <th style="color: '.REPORT_HEADER_FONT_COLOR.'; text-align: center; vertical-align: middle; background-color: '.REPORT_HEADER_COLOR.'; " ><b>AqiCategory</b></th>
            <th style="color: '.REPORT_HEADER_FONT_COLOR.'; text-align: center; vertical-align: middle; background-color: '.REPORT_HEADER_COLOR.'; " ><b>Prominent Pollutant</b></th>';
            foreach($valArray as $key => $val) {
                if ($key != 'info') {
                    if ($val['count'] == 1) {
                        $sensorID = $val['sensorID'];
                        $string = $sensorConfigData[$sensorID]['sensorTag'];
                        $string .= "<br/> Limit = ".$sensorConfigData[$sensorID]['warningAlertInfo']['wMax'];
                        $string .= "<br/> Unit = ".$sensorConfigData[$sensorID]['units'];
                        $varHTML .= '<th style="color: '.REPORT_HEADER_FONT_COLOR.'; text-align: center; background-color: '.REPORT_HEADER_COLOR.'; " ><b>'.$string.'</b></th>';
                    }
                }
            }
            $varHTML .= '</tr></thead> <tbody>';
    }

  $varHTML .= '<tr style="background-color: '.$cellColor.';">
    <td style=" text-align: center;" >'.$collectedDate.'</td>
    <td style=" text-align: center;" >'.$result['aqiValue'].'</td>
    <td style=" text-align: center;" >'.$valArray['info']['aqiCategory'].'</td>
    <td style=" text-align: center;" >'.$sensorConfigData[$valArray['info']['prominentPollutantID']]['sensorTag'].'</td>';
    foreach($valArray as $key => $val) {
        if ($key != 'info') {
            if ($val['count'] == 1) {
                $varHTML .= '<td style=" text-align: center;" >'.$val['avg'].'</td>';
            }
        }
    }
    $varHTML .=  '</tr>';
}

$varHTML .= '</tbody></table></body></html>';

$pdf = new CustomTCPDF(); // Create TCPDF instance
$pdf->SetPageOrientation('L');
$pdf->SetFont('times', '', 12);
$pdf->AddPage();
$pdf->writeHTML($varHTML, true, false, true, false, '');

$rnd = rand(100, 999);
$fileDisplayName = 'Aqi Reports.pdf';
$pdfPath = BASE_FILE_PATH_REPORTS.'/aqiReports_'.$rnd.'.pdf';
$pdf->Output($pdfPath, 'F');

//call email and send email. 
if ($sendEmail == "YES"){
    $tag='';
    if ($zoneID != '') {
      $tag = $namesConfigData['zones'][$zoneID]['zoneName'];
    }
    sendReportEmails(AQI_REPORT, $pdfPath, $fileDisplayName, $tag, $fromDateIn, $toDateIn, $userEmail);
    
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
header('Content-Disposition: attachment; filename="Aqi Reports.pdf"');
header('Content-Length: ' . filesize($pdfPath));
readfile($pdfPath);

//if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

?>