<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

date_default_timezone_set('Asia/Kolkata');

include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/dbTmsConn.php");
include(__DIR__ . "/../includes/dbRptConn.php");
include(__DIR__ . "/../includes/constantsVals.php");
include(__DIR__ . "/../includes/genFunctions.php");
include(__DIR__ . "/../reportsAPI/rptGenFunctions.php");

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/mailFunction.php';

// use \Mailjet\Resources;

class CustomTCPDF extends TCPDF {
  public function Header() {
  }

  public function Footer() {
    $this->SetFont('times', '', 12);
    $this->SetY(-12);
    $this->Cell(277, 7, 'Page # ' . $this->getAliasNumPage(), 'T', false, 'R');
  }
}// end of customTPPDF

if ($debugFlag) { $funcStartTime = microtime(true); }

$sensorConfigData=[];
$deviceConfigData=[];
$namesConfigData=[];
$alertUsersData=[];

//this will read all the configuration of sensor from the prefetched file.
readLocationConfigDB();
readDeviceConfigDB();
readSensorConfigDB();

//currently checking for all users.  Will do only for where emailNotification = 'DAILY' or 'INSTANT AND DAILY';
$sql = "SELECT count(*) as usersCount, GROUP_CONCAT(email SEPARATOR ',') as concatEmail, locationID, branchID, facilityID, buildingID, floorID, zoneID FROM `users` where emailNotification='DAILY' or emailNotification='INSTANT_DAILY' group by locationID, branchID, facilityID, buildingID, floorID, zoneID; ";
$getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
while ($result = mysqli_fetch_assoc($getResult))
{
    $alertUsersData[] = $result;
}

$i=0;
foreach ($alertUsersData as $userData){
  $i++;
  createAlertsPDFFile($userData, $i);
}

function whereClause($userData){
  $todayDate = date('Y-m-d');
  $yesterdayDate = date('Y-m-d', strtotime($todayDate . ' -1 day'));
  $yesterdayStartTime = $yesterdayDate." 00:00:00";
  $yesterdayEndTime = $yesterdayDate." 23:59:59";

  $whereClause = '';
  if ($userData['locationID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " locationID = '".$userData['locationID']."' ";
  }
  if ($userData['branchID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " branchID = '".$userData['branchID']."' ";
  }
  if ($userData['facilityID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " facilityID = '".$userData['facilityID']."' ";
  }
  if ($userData['buildingID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " buildingID = '".$userData['buildingID']."' ";
  }
  if ($userData['floorID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " floorID = '".$userData['floorID']."' ";
  }
  if ($userData['zoneID'] > 0 ) {
    if ($whereClause != '') { $whereClause .= ' AND '; }
    $whereClause .= " zoneID = '".$userData['zoneID']."' ";
  }

  //temp comment anand check
  if ($whereClause != '') { $whereClause .= ' AND '; }
  $whereClause .= " collectedTime >= '".$yesterdayStartTime."' ";

  if ($whereClause != '') { $whereClause .= ' AND '; }
  $whereClause .= " collectedTime <= '".$yesterdayEndTime."' ";

  return $whereClause;
}

function createAlertsPDFFile($userData, $i)
{
    global $dbTmsConn;
    global $namesConfigData;

    $whereClause = whereClause($userData);
    if ($whereClause == '') {
      $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, deviceName, sensorTag, collectedTime, closedTime, diffMinutes, value, alertType, msg, statusMessage, alarmClearedUser FROM `alertCrons`  order by zoneID, id desc";

    }
    else {
      $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, sensorID, deviceName, sensorTag, collectedTime, closedTime, diffMinutes, value, alertType, msg, statusMessage, alarmClearedUser FROM `alertCrons` WHERE $whereClause order by zoneID, id desc";
    }
    // echo $sql;
    // exit;

    $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    if ($getResult->num_rows <= 0) { 
      //echo '<br/>***No processing as now rows for '.$userData['concatEmail'];
      return;
    }
    else {
        //echo '<br/>processing ['.$getResult->num_rows.'] as now rows for '.$userData['concatEmail'];
    }
    
    $olderZoneID = '';
    $varHTML='';

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
          // Set font
          // var_dump($varHTML);
          $pdf->writeHTML($varHTML, true, false, true, false, '');
        }

        $olderZoneID = $result['zoneID'];
  
        //New Zone Create header
        isset($namesConfigData['company']['companyName']) ? $namesConfigData['company']['companyName'] : '';
        $companyName =  isset($namesConfigData['company']['companyName']) ?  $namesConfigData['company']['companyName'] : '';
        $locationName =  isset($namesConfigData['locations'][$result['locationID']]['locationName']) ? $namesConfigData['locations'][$result['locationID']]['locationName']: '';
        $branchName =  isset($namesConfigData['branches'][$result['branchID']]['branchName']) ? $namesConfigData['branches'][$result['branchID']]['branchName']: '';
        $facilityName =  isset($namesConfigData['facilities'][$result['facilityID']]['facilityName']) ? $namesConfigData['facilities'][$result['facilityID']]['facilityName']: '';
        $buildingName =  isset($namesConfigData['buildings'][$result['buildingID']]['buildingName']) ? $namesConfigData['buildings'][$result['buildingID']]['buildingName'] : '';
        $floorName =  isset($namesConfigData['floors'][$result['floorID']]['floorName']) ? $namesConfigData['floors'][$result['floorID']]['floorName']: '';
        $zoneName =  isset($namesConfigData['zones'][$result['zoneID']]['zoneName']) ? $namesConfigData['zones'][$result['zoneID']]['zoneName'] : '';

        $todayDate = date('Y-m-d');
        $yesterdayDate = date('d-m-Y', strtotime($todayDate . ' -1 day'));
        $yesterdayStartTime = $yesterdayDate." 00:00:00";
        $yesterdayEndTime = $yesterdayDate." 23:59:59";
      
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
                <td colspan="4" style=" color: '.REPORT_HEADER_FONT_COLOR.'; background-color: '.REPORT_HEADER_COLOR.'; text-align: center;"><b>'.SENSOR_STATUS_REPORT_NAME.'</b></td>
              </tr></thead>
              <tbody>
            <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                <td width="20%" >Organization Name</td>
                <td width="32%" >'.$companyName.'</td>
                <td width="22%">From Date</td>
                <td width="26%">'.$yesterdayStartTime.'</td>
                  </tr>
                  <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Location</td>
                    <td >'.$locationName.'</td>
                    <td >To Date</td>
                    <td >'.$yesterdayEndTime.'</td>
                  </tr>
                    <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Branch</td>
                    <td >'.$branchName.'</td>
                    <td >Report Taken By</td>
                    <td >Auto Generated By System</td>
                  </tr>
                  <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Facility</td>
                    <td >'.$facilityName.'</td>
                    <td >Report Date & Time</td>
                    <td >'.date(REPORT_DATE_TIME_FORMAT).'</td>
                  </tr>
                  <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Building</td>
                    <td >'.$buildingName.'</td>
                    <td colspan="2" rowspan="3"></td>
                  </tr>
                  <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Floor</td>
                    <td >'.$floorName.'</td>
                  </tr>
                  <tr style="background-color: '.REPORT_ALTERNATIVE_ROW_COLOR_TWO.';">
                    <td >Zone</td>
                    <td >'.$zoneName.'</td>
                  </tr>
                </tbody>
                </table></div>';
                $varHTML .=  '<div><table cellspacing="0" cellpadding="2" border="1" style="width:100%; ">
                <thead>
                  <tr style="color: '.REPORT_HEADER_FONT_COLOR.'; background-color: '.REPORT_HEADER_COLOR.';">
                    <th style=" text-align: center;" width="15%"><b>From & To DateTime</b></th>
                    <th style=" text-align: center;" width="6%"><b># Min</b></th>
                    <th style=" text-align: center;" width="10%"><b>Devices</b></th>
                    <th style=" text-align: center;" width="10%"><b>Sensor Tag</b></th>
                    <th style=" text-align: center;" width="6%"><b>Value</b></th>
                    <th style=" text-align: center;" width="9%"><b>Alert Type</b></th>
                    <th style=" text-align: center;" width="18%" ><b>Message</b></th>
                    <th style=" text-align: center;" width="18%"><b>Reason</b></th>
                    <th style=" text-align: center;" width="8%"><b>User</b></th>
                  </tr>
                </thead>
                <tbody>';

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
              <td style=" text-align: center;" width="6%">'.$diffMinutes.'</td>
              <td  width="10%">'.$result['deviceName'].'</td>
              <td  width="10%">'.$result['sensorTag'].'</td>
              <td style=" text-align: center;" width="6%">'.$valueString.'</td>
              <td width="9%">'.$result['alertType'].'</td>
              <td width="18%" >'.$result['msg'].'</td>
              <td width="18%">'.$result['statusMessage'].'</td>
              <td width="8%">'.$result['alarmClearedUser'].'</td>
            </tr>';

    }

    if ($varHTML!='') {
      $varHTML .= '</tbody></table></body></html>';
      $pdf->AddPage();
      // Set font
      // var_dump($varHTML);
      $pdf->writeHTML($varHTML, true, false, true, false, '');
    }

    // $tag='';
    // if ($deviceID != '') {
    //   $tag = $deviceConfigData[$deviceID]['deviceName'];
    // }
    // else {
    //   $tag = " ALL";
    // }

   $fileDisplayName = 'Alarms Reports.pdf';
   $pdfPath = BASE_FILE_PATH_REPORTS.'alarmReports/alarm_'.$i.'.pdf';
   $pdf->Output($pdfPath, 'F');


   sendAlertEmailSmtp(ALARM_DAILY_REPORT, $pdfPath,$fileDisplayName, $userData['concatEmail'], $yesterdayStartTime, $yesterdayEndTime);

}

function sendAlertEmailSmtp($reportType, $pdfPath,$fileDisplayName ,$bccEmails, $yesterdayStartTime, $yesterdayEndTime) {
  // global $mj;
  global $dbConfigConn;
  global $appBaseURL;

    $sql = "select * from emailTextInfo where templateID = '$reportType' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    $result = mysqli_fetch_assoc($getResult);
    $emailSubject = $result['subject'];
    $emailBody = $result['body'];

    $emailBody = str_replace('[FROM_DATE]', $yesterdayStartTime, $emailBody );
    $emailBody = str_replace('[TO_DATE]', $yesterdayEndTime, $emailBody );
    $emailBody = str_replace('[APPLICATION_URL]', $appBaseURL, $emailBody );

    require 'vendor/autoload.php';
    $mail = new PHPMailer(true);
  
      try{
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;  
        $mail->isSMTP();
        $mail->Host = MAIL_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = MAIL_USERNAME;
        $mail->Password = MAIL_PASSWORD;
        $mail->SMTPSecure = MAIL_ENCRYPTION;
        $mail->Port = MAIL_PORT;
  
        $mail->SMTPOptions = array(
          'ssl' => array(
              'verify_peer' => false,
              'verify_peer_name' => false,
              'allow_self_signed' => true
          )
      );
  
        $mail->setFrom(AQMS_FROM_EMAIL, AQMS_FROM_NAME);
        $mail->Subject = $emailSubject;
        $mail->Body = $emailBody;
      
        $mail->addAttachment($pdfPath, $fileDisplayName);
          
        $mail->isHTML(true);
        
      //$toBcc = REPORT_TO_EMAIL_TEST;
      $toBcc = $bccEmails;
      
      $toBccArray = explode("," , $toBcc);
      foreach ($toBccArray as $key => $bcc) {
        $mail->addBcc($bcc);
      }
       
      $mail->send();
  
        return true;
      }catch(Exception $e){
        echo $e->getMessage();
        return false;
      }
  
}


if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             


?>