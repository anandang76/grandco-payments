<?php

use \Mailjet\Resources;

function sendReportEmails($reportType, $pdfPath, $fileName, $toEmails, $tag='', $fromDateIn='', $toDateIn='' )
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
  $emailBody = '<br/>Hi<br/><br/>Please find attached report Information.<br/><br/>Best Regards<br/>Admin<br/>';

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

    $mj = new \Mailjet\Client(MAIL_JET_API_KEY, MAIL_JET_SECRET_KEY ,true,['version' => 'v3.1']);

    //check copy
    $toEmailCopy = $toEmails;
    //overwriting $toEmails for testing purpose only.  In live remove. check anand
    $toEmails = REPORT_TO_EMAIL_TEST;
  
    $toRecipients = [];
    $toEmailArray = explode("," , $toEmails);
      foreach ($toEmailArray as $toEmail) {
          $toRecipients[] = [
              'Email' => $toEmail,
              'Name' => null,
          ];
      }
  
      $attachmentData = base64_encode(file_get_contents($pdfPath));
  
      $attachment = [
          'ContentType' => 'application/pdf', 
          'Filename' => $fileName,  
          'Base64Content' => $attachmentData,
      ];
  
      //   'Bcc' => $bccRecipients,
  
    $body = [
      'Messages' => [
        [
          'From' => [
            'Email' => AQMS_FROM_EMAIL,
            'Name' => AQMS_FROM_NAME
          ],
          'To' => $toRecipients,
          'Subject' => $emailSubject,
          'TextPart' => "Reports Email",
          'HTMLPart' => $emailBody,
          'Attachments' => [$attachment],
          'CustomID' => "ReportsEmail"
        ]
      ]
    ];
    $response = $mj->post(Resources::$Email, ['body' => $body]);
    //$response->success() && return true;
    return;
  }
    
  ?>
