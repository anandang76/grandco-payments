<?php
date_default_timezone_set('Asia/Kolkata');
include(__DIR__ . "/../includes/config.php");
include(__DIR__ . "/../includes/dbConfigConn.php");
include(__DIR__ . "/../includes/dbTmsConn.php");
include(__DIR__ . "/../includes/constantsVals.php");
include(__DIR__ . "/../includes/genFunctions.php");
include(__DIR__ . "/../includes/vendor/phpmailer/phpmailer/src/Exception.php");
include(__DIR__ . "/../includes/vendor/phpmailer/phpmailer/src/PHPMailer.php");
include(__DIR__ . "/../includes/vendor/phpmailer/phpmailer/src/SMTP.php");
include(__DIR__ . "/../includes/vendor/autoload.php");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

if ($debugFlag) { $funcStartTime = microtime(true); }

$sensorConfigData=[];
$deviceConfigData=[];
$sensorDynamicData=[];

readDeviceConfigDB();
readSensorConfigDB();

initializeSensorDynamicData();

//First Block of Work
//Insert data like simulator completely to make it look real incoming data.
//In Live comment out below line block  
runSimulatorAll();
echo "<br/>Running Simulator Completed";

if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

usleep(1000);

if ($debugFlag) { $funcStartTime = microtime(true); }

//Currently query from deviceIncomingData - replace with RabbitMQ Later in further phases
$dataIDString="";
$recordCount=0;
$insertCount=0;

$getDataSql = "select id, data from deviceIncomingData order by id asc LIMIT 100";
$getResult = mysqli_query($dbTmsConn,$getDataSql) or die(mysqli_error($dbTmsConn));
//only for debugging purpose.  dont insert //tobe commented in live version. //make it false / comment.
$debugInsert=false;
if($debugInsert) {
    $sql = "INSERT INTO deviceIncomingDataDebug (data, createdAt) select data, createdAt from deviceIncomingData order by id asc LIMIT 100";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
}

while ($result = mysqli_fetch_assoc($getResult))
{
    try{
    $recordCount++;
    $jsonData=$result['data'];
    $jsonDataObj=json_decode($jsonData,true);
    $collectedTime=$jsonDataObj["DATE"]." ".$jsonDataObj["TIME"];
    $deviceID = $jsonDataObj["DEVICE_ID"];

    //process only if deviceMode is Enabled.  All other mode ignore the incoming data
    if ( $deviceConfigData[$deviceID]['deviceMode'] == DEVICE_MODE_ENABLED || $deviceConfigData[$deviceID]['deviceMode'] == DEVICE_MODE_SIMULATOR  ) {
        //{"DATE":"2022-09-02","TIME":"17:41:54","DEVICE_ID":"3","MODE":"2","ACCESS_CODE":"1003","pb_gas01":"0.5","NH3_gas1":"200","SO2_gas1":"40","O3_gas1":"50","pm2.5_gas1":"100","PM10_GAS2":"50","NO2_gas2":"40"}
        //if ($debugFlag) { echo "<br/>Processing DeviceID-$deviceID"; }
        $segregatedValuesSql='';
        foreach($jsonDataObj as $key => $value) 
        {
            if($key !== "DATE" && $key !== "TIME" && $key !== "DEVICE_ID" &&  $key !== "SD_CARD" && $key !== "RSSI" && $key !== "MODE" && $key !== "ACCESS_CODE"){
                
                $sensorID=$key;
                $sensorValue=$value;
                //tempfix
                if($sensorValue == 'NA'){
                    continue;
                }
                //if sensor status is disabled no need to proess data
                if ($sensorConfigData[$sensorID]['sensorStatus'] == 0) {
                    continue;
                }
                if ($sensorConfigData[$sensorID]['sensorOutput'] == SENSOR_TYPE_INBUILT || $sensorConfigData[$sensorID]['sensorOutput'] == SENSOR_TYPE_DIGITAL) {
                    //No Scaling for Inbuilt Sensors
                    $scaledValue=$sensorValue;
                }
                else {
                    $scaledValue=scalingValue($sensorID, $sensorValue);
                }
                
                //setting Last Value to dynamic array;
                $sensorDynamicData[$sensorID]['lastSensorValue'] = $scaledValue;
                $sensorDynamicData[$sensorID]['lastTime'] = $collectedTime;
                //echo "<br/>Setting Dynmaic Last Value = ".$sensorDynamicData[$sensorID]['lastSensorValue'];
                $infoValue = SENSOR_NORMAL;
                if (checkOutOfRangeAlert($deviceID, $sensorID, $scaledValue)) {
                    //Critical Alert Came // No need to process other alerts
                    $valueNormal=false;
                    $infoValue = OUTOFRANGE_ALERT;
                } else if (checkCriticalAlert($deviceID, $sensorID, $scaledValue)) {//checkCriticalAlert
                    //Warning Alert Came // No need to process other alerts
                    $valueNormal=false;
                    $infoValue = CRITICAL_ALERT;
                }else if (checkWarningAlert($deviceID, $sensorID, $scaledValue)) {
                    //Warning Alert Came // No need to process other alerts
                    $valueNormal=false;
                    $infoValue = WARNING_ALERT;
                }
                else {
                    $valueNormal = true;
                    $infoValue = SENSOR_NORMAL;
                }

                if ($sensorConfigData[$sensorID]['isStel']) {
                    if ($infoValue != OUTOFRANGE_ALERT) {
                        if ( calculateSTEL($deviceID, $sensorID, $scaledValue) ) {
                            $valueNormal = false;
                            $infoValue = STEL_ALERT;
                        }
                    }
                }

                //for debug purpose of sensorValue to check - remove later point //anand check
                $segregatedValuesSql = " INSERT INTO `sensorSegregatedValues`(`deviceID`, `sensorID`, `sensorValue`,`scaledValue`,`info`,`collectedTime`) VALUES ('$deviceID','$sensorID','$sensorValue','$scaledValue','$infoValue','$collectedTime') ";
                //don't store raw value
                //$segregatedValuesSql = " INSERT INTO `sensorSegregatedValues`(`deviceID`, `sensorID`, `scaledValue`,`collectedTime`) VALUES ('$deviceID','$sensorID','$scaledValue','$collectedTime') ";
                //if ($debugFlag) { echo "<br/> Insert SQL = $segregatedValuesSql"; }              
                mysqli_query($dbTmsConn,$segregatedValuesSql) or die(mysqli_error($dbTmsConn));
                
                $insertCount++;
            }
            //check if device disconnected and yes.  set to deviceconnected again. 
            if ($deviceConfigData[$deviceID]['disconnectionStatus'] == 1 ) {
                $sql = " UPDATE `devices` SET disconnectionStatus = '0' where id = '$deviceID' ";
                mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
            }

        } // foreach
    
    } // if device Mode

    if ( $dataIDString==""){
        $dataIDString = $result['id'];
    }
    else {
        $dataIDString .= ", ".$result['id'];
    }
}catch(Exception $e){
    $exceptionSql = " INSERT INTO `cronExceptions`(`jsonData`, `ecxeptionInfo`) VALUES ('$jsonData','$e->getMessage()') ";
    mysqli_query($dbTmsConn,$exceptionSql) or die(mysqli_error($dbTmsConn));
}
} // while loop 

if ($recordCount!=0) {
    //delete all consumed data from deviceIncomingData - will replace with RabbitMQ
    $delDataSql = "DELETE from deviceIncomingData where id in ($dataIDString)";
    //if ($debugFlag) { echo "<br/> Delete Data SQL = $delDataSql"; }              
    mysqli_query($dbTmsConn,$delDataSql) or die(mysqli_error($dbTmsConn));
    echo "\n<br/>Processed $recordCount rows from deviceIncomingData [$insertCount]Inserted";
}
else {
    echo '\n<br/>No records from deviceIncomingData';
}

echo "<br/>Processing AQMI JSON Table - All Warning Checks Warning, Critical, OutofBound, Stel Completed";
if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             

//now segregation complete
usleep(1000);

if ($debugFlag) { $funcStartTime = microtime(true); }

$currentMinute = date('i');
//echo "\n<br/>CurrentMinute = $currentMinute";


if (((int)$currentMinute % ONE_MINUTE) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".ONE_MINUTE."] data"; }    
    aggDeviceData(ONE_MINUTE);
    checkDeviceDisconnect();
    //updating back to normal alerts every one hour / but can be called in every 5 minutes after testing.
    //temporary comment.
    alertDataUpdate();

}
if (((int)$currentMinute % FIVE_MINUTE) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".FIVE_MINUTE."] data"; }    
    aggDeviceData(FIVE_MINUTE);

//calc AQI if possible instead of another cron.
  
}
if (((int)$currentMinute % TEN_MINUTE) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".TEN_MINUTE."] data"; }    
    aggDeviceData(TEN_MINUTE);
}
if (((int)$currentMinute % FIFTEEN_MINUTE) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".FIFTEEN_MINUTE."] data"; }    
    aggDeviceData(FIFTEEN_MINUTE);
    //Calling TWA Check for all sensors
    //temporary comment for twa calculations.
    
    foreach ($sensorConfigData as $sensorID => $sensorInfo) {
        if ($sensorInfo['isTwa'] == 1) {
            calculateTWA( $sensorInfo['deviceID'], $sensorID );        
        }
    }
    echo "<br/>TWA Calculation Completed ";    
}
if (((int)$currentMinute % THIRTY_MINUTE) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".THIRTY_MINUTE."] data"; }    
    aggDeviceData(THIRTY_MINUTE);
}
if (((int)$currentMinute) == 0 ) {
//    if ($debugFlag) { echo "\n<br>*** Calling [".THIRTY_MINUTE."] data"; }    
    aggDeviceData(ONE_HOUR);
    updateEmailSMSForEachZone();

}

//printSensorDynamicData();
updateSensorDynamicData();

echo "<br/>".__LINE__."\n Processing complete  ";
echo "<br/>Aggregate data 1,5,10,15,30,60 min completed.  ";

if ($debugFlag) { $funcEndTime = microtime(true); echo "\n<br/>\n[".__FILE__."]-Time St [$funcStartTime] End [$funcEndTime] Exec[".($funcEndTime - $funcStartTime)."]"; }             


function sendAlertEmailSMS($zoneID, $deviceID, $sensorID, $alertType, $txtMessage, $sensorValue, $shiftID=null)
{
    global $sensorConfigData;
    global $deviceConfigData;
    global $dbConfigConn;

    global $appBaseURL;

    $sensorValue = number_format($sensorValue, 2, '.','');
    
    $sql = "select * from emailTextInfo where templateID = 'ALERTS_EMAIL' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    $result = mysqli_fetch_assoc($getResult);
    $subjectInfo = $result['subject'];
    $bodyInfo = $result['body'];

    echo "<br/>***Sending SMS Alerts and Emails Start for $deviceID $sensorID $alertType $txtMessage";
    $messageSubject=$subjectInfo;
    $messageBody ='';
    
    $getDataSql = "select id, zoneName, emailInstant, smsInstant from zones where id = $zoneID LIMIT 1";
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    $result = mysqli_fetch_assoc($getResult);
    $zoneName = $result['zoneName'];
    $emailInstant = $result['emailInstant'];
    $smsInstant = $result['smsInstant'];

    $bccEmails = $emailInstant;
    //In Live Comment below line and message body line. 
    // $bccEmails = INSTANT_ALERT_BCC_EMAIL;
    // $messageBody = "<br/>In Live Emails sent to ".$emailInstant."<br/><br/>";
    // $messageBody .= "<br/>In Live SMS sent to ".$smsInstant."<br/><br/>";

    $messageBody .= $bodyInfo;

    $alertTxt='';
    $alertTxt .= "<br/>Alert Type = $alertType";
    $deviceName = $deviceConfigData[$deviceID]['deviceName'];
    $alertTxt .= "<br/>DeviceName = $deviceName";
    $sensorName='';
    $sensorTag='';
    if ( $sensorID > 0 ) {
        $sensorName = $sensorConfigData[$sensorID]['sensorName'];
        $sensorTag = $sensorConfigData[$sensorID]['sensorTag'];
        $messageSubject .= ' '.$sensorTag.' - '.$alertType;
        $alertTxt .= "<br/>SensorName = $sensorName";
        $alertTxt .= "<br/>SensorTag = $sensorTag";
    }

    if($alertType != "DEVICE DISCONNECTED"){
        $alertTxt .= "<br/>SensorValue = $sensorValue";
    }
    
    if ( $shiftID != '' ) {
        $alertTxt .= "<br/>ShiftID = $shiftID";
    }
    $alertTxt .= "<br/>Message = $txtMessage";
    // $messageSubject = str_replace('[TAG]', $deviceName, $messageSubject );
    $messageBody = str_replace('[ALERT_INFO]', $alertTxt, $messageBody);
    $messageBody = str_replace('[APPLICATION_URL]', $appBaseURL, $messageBody);

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
        $mail->Subject = $messageSubject;
        $mail->Body = $messageBody;
      

        $bccRecipients = [];
        $bccEmailArray = explode("," , $bccEmails);
        foreach ($bccEmailArray as $bcc) {
            $mail->addBcc($bcc);
        }
        $mail->isHTML(true);
        $mail->send();

        //In Live comment below line so sms send to all live recipients
        //$smsInstant = SMS_INSTANT;
    
        if($smsInstant){
            //Send SMS
            echo "<br/>****Sending SMS started<br>";
        
            $apiUrl = SMS_API_URl;
            $message = SMS_CONTENT;
            $message .= '-'.$sensorName.'-'.$alertType.'-'.$sensorValue;
            $messageEncoded = $message;
            
        
            // Set your parameters
            $params = array(
                'key' => 'b2177aadb4678c10f395c0a75691428e',
                'route' => '2',
                'sender' => 'AILABS',
                'number' => $smsInstant,
                'sms' => $messageEncoded,
                'templateid' => '1607100000000298946'
            );
            
            // Initialize cURL session
            // temp disabling sms message.
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $apiUrl);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            if(curl_errno($ch)) {
                echo 'cURL error: ' . curl_error($ch);
            }
            curl_close($ch);
            // Process response
            if ($response === false) {
                echo "Failed to fetch data from API.";
            } else {
                echo "API response: " . $response;
            }
        }

        return true;

    }catch(Exception $e){
        echo $e->getMessage();
        return false;
    }

}




?>
