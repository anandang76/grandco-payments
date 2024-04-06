<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;
require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';

// use \Mailjet\Resources;

// error_reporting(E_ALL);
// ini_set('display_errors', 1);

function sendReportEmails($reportType, $pdfPath, $fileName , $tag='', $fromDateIn='', $toDateIn='', $userEmail)
{

  global $appBaseURL;
  global $dbConfigConn;

  if ($fromDateIn != '') {
    $dateObj = new DateTime($fromDateIn);
    $fromDateIn = $dateObj->format(REPORT_DATE_FORMAT);
  }

  if ($toDateIn != '') {
    $dateObj = new DateTime($toDateIn);
    $toDateIn = $dateObj->format(REPORT_DATE_FORMAT);
  }

  $emailSubject='';
  $emailBody='';
  $emailSubject = 'Reports Information';
  $emailBody = 'Hi<br/>Please find attached report Information.<br/>Best Regards<br/>Admin<br/>';

  if ($reportType != '' ) {
    $sql = "select * from emailTextInfo where templateID = '$reportType' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    $result = mysqli_fetch_assoc($getResult);
    $emailSubject = $result['subject'];
    $emailBody = $result['body'];

    $emailSubject = str_replace('[TAG]', $tag, $emailSubject );
    $emailBody = str_replace('[TAG]', $tag, $emailBody );
    $emailBody = str_replace('[FROM_DATE]', $fromDateIn, $emailBody );
    $emailBody = str_replace('[TO_DATE]', $toDateIn, $emailBody );
    $emailBody = str_replace('[APPLICATION_URL]', $appBaseURL, $emailBody );
  }

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
    
      $mail->addAttachment($pdfPath, $fileName);
        
      $mail->isHTML(true);
      $mail->addAddress($userEmail);

      $toBcc = INSTANT_ALERT_BCC_EMAIL;
  
      $toRecipients = [];
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
    
  ?>
