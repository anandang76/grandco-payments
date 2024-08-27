<?php
//This file is important for the server to minimize all the basic queries.
//This will be created when the application completed configuration and each time configuration
//updates this files needs to be recreated. 
//If any issues on the file or file deleted call infoArray with file create options enabled on the same. 
function readConfigFiles() {
    global $deviceConfigData;
    global $sensorConfigData;
    global $namesConfigData;
    
    //read device details
    $string = file_get_contents(DEVICE_FILE_NAME);
    $deviceConfigData = json_decode($string, true);

    //read sensor details
    $string = file_get_contents(SENSOR_FILE_NAME);
    $sensorConfigData = json_decode($string, true);

    $string = file_get_contents(ID_NAMES_FILE_NAME);
    $namesConfigData = json_decode($string, true);
    return;
}

function readReportEmailConfig() {
    global $reportEmailInfo;
    global $dbConfigConn;
    
    $getDataSql = "select * FROM `emailTextInfo` ";
    $reportEmailInfo=[];
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $templateID = $result['templateID'];
        $reportEmailInfo[$templateID]['subject'] = $result['subject'];
        $reportEmailInfo[$templateID]['body'] = $result['body'];
    }
    return;
}

function readLocationConfigDB() {
    global $namesConfigData;
    global $configCompanyID;
    global $dbConfigConn;

    $namesConfigData=[];

    $namesConfigData=[];
    $row=[];
    $sql = "select companyCode, companyName FROM company where companyCode = '$configCompanyID' LIMIT 1";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $row['companyCode']=$result['companyCode'];
        $row['companyName']=$result['companyName'];
    }
    $namesConfigData['company']=$row;
    $row=[];

    foreach(TABLE_NAME_ARRAY as $tableName ) {
        $row=[];
        $sql = "select * from $tableName ";
        $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
        while ($result = mysqli_fetch_assoc($getResult))
        {
            $id = $result['id'];
            if ($tableName=='locations'){
                $row[$id]['locationName']=$result['locationName'];
            }
            if ($tableName=='branches'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchName']=$result['branchName'];
            }
            if ($tableName=='facilities'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityName']=$result['facilityName'];
            }
            if ($tableName=='buildings'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingName']=$result['buildingName'];
            }
            if ($tableName=='floors'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingID']=$result['buildingID'];
                $row[$id]['floorName']=$result['floorName'];
            }
            if ($tableName=='zones'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingID']=$result['buildingID'];
                $row[$id]['floorID']=$result['floorID'];
                $row[$id]['zoneName']=$result['zoneName'];
                $row[$id]['isAQI']=$result['isAQI'];
                $row[$id]['emailInstant']=$result['emailInstant'];
                $row[$id]['smsInstant']=$result['smsInstant'];
            }
        }
        $namesConfigData[$tableName]=$row;
    }

    return;
}


function readSensorConfigDB() {
    global $sensorConfigData;
    global $dbConfigConn;

    $sensorConfigData=[];

    $getDataSql = "select id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, deviceCategory, sensorName, sensorTag, defaultValue, alarmType, isStel, isTwa, isAQI, scaleInfo, stelInfo, twaInfo, criticalAlertInfo, warningAlertInfo, outOfRangeAlertInfo, digitalAlertInfo, sensorOutput, units, sensorStatus, notificationStatus  FROM `sensors`  order by id ";
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $id = $result['id'];
        $sensorConfigData[$id]['locationID'] = $result['locationID'];
        $sensorConfigData[$id]['branchID'] = $result['branchID'];
        $sensorConfigData[$id]['facilityID'] = $result['facilityID'];
        $sensorConfigData[$id]['buildingID'] = $result['buildingID'];
        $sensorConfigData[$id]['floorID'] = $result['floorID'];
        $sensorConfigData[$id]['zoneID'] = $result['zoneID'];
        $sensorConfigData[$id]['deviceID'] = $result['deviceID'];
        $sensorConfigData[$id]['deviceCategory'] = $result['deviceCategory'];
        $sensorConfigData[$id]['sensorName'] = $result['sensorName'];
        $sensorConfigData[$id]['sensorTag'] = $result['sensorTag'];
        $sensorConfigData[$id]['defaultValue'] = $result['defaultValue'];
        $sensorConfigData[$id]['alarmType'] = $result['alarmType'];
        $sensorConfigData[$id]['isStel'] = $result['isStel'];
        $sensorConfigData[$id]['isTwa'] = $result['isTwa'];
        $sensorConfigData[$id]['isAQI'] = $result['isAQI'];
        $sensorConfigData[$id]['scaleInfo'] = !empty($result['scaleInfo']) ? json_decode($result['scaleInfo'], true):null;
        $sensorConfigData[$id]['stelInfo'] = !empty($result['stelInfo']) ? json_decode($result['stelInfo'], true) :null;
        $sensorConfigData[$id]['twaInfo'] = !empty($result['twaInfo']) ? json_decode($result['twaInfo'], true):null;
        $sensorConfigData[$id]['criticalAlertInfo'] = !empty($result['criticalAlertInfo']) ? json_decode($result['criticalAlertInfo'], true) :null;
        $sensorConfigData[$id]['warningAlertInfo'] = !empty($result['warningAlertInfo']) ?  json_decode($result['warningAlertInfo'], true):null;
        $sensorConfigData[$id]['outOfRangeAlertInfo'] = !empty($result['outOfRangeAlertInfo']) ? json_decode($result['outOfRangeAlertInfo'], true):null;
        $sensorConfigData[$id]['digitalAlertInfo'] = !empty($result['digitalAlertInfo']) ? json_decode($result['digitalAlertInfo'], true):null;
        $sensorConfigData[$id]['units'] = $result['units'];
        $sensorConfigData[$id]['sensorOutput'] = $result['sensorOutput'];
        $sensorConfigData[$id]['sensorStatus'] = $result['sensorStatus'];
        $sensorConfigData[$id]['notificationStatus'] = $result['notificationStatus'];
    }

    return;
}


function readDeviceConfigDB() {
    global $deviceConfigData;
    global $dbConfigConn;
    $deviceConfigData=[];
    
    $getDataSql = "select id, locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceName, deviceCategory, deviceTag, deviceMode, disconnectionStatus, notificationShow FROM `devices` order by id ";
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $id = $result['id'];
        $deviceConfigData[$id]['locationID'] = $result['locationID'];
        $deviceConfigData[$id]['branchID'] = $result['branchID'];
        $deviceConfigData[$id]['facilityID'] = $result['facilityID'];
        $deviceConfigData[$id]['buildingID'] = $result['buildingID'];
        $deviceConfigData[$id]['floorID'] = $result['floorID'];
        $deviceConfigData[$id]['zoneID'] = $result['zoneID'];
        $deviceConfigData[$id]['deviceID'] = $result['id'];
        $deviceConfigData[$id]['deviceName'] = $result['deviceName'];
        $deviceConfigData[$id]['deviceCategory'] = $result['deviceCategory'];
        $deviceConfigData[$id]['deviceTag'] = $result['deviceTag'];
        $deviceConfigData[$id]['deviceMode'] = $result['deviceMode'];
        $deviceConfigData[$id]['disconnectionStatus'] = $result['disconnectionStatus'];
        $deviceConfigData[$id]['notificationShow'] = $result['notificationShow'];
    }

    return;
}



function checkDeviceDisconnect(){
    global $sensorConfigData;
    global $sensorDynamicData;
    global $dbConfigConn;
    $deviceNormalArray = [];

    foreach ( $sensorConfigData as $sensorID => $sensorObject) {
        //last 5 minutes no data coming.  Increase count if we want to 
        //show disconnected earlier.
        if ($sensorDynamicData[$sensorID]['numSamples'] > 10 || $sensorDynamicData[$sensorID]['lastTime'] != '' ) {
            $deviceNormalArray[] = $sensorDynamicData[$sensorID]['deviceID'];
            $deviceID = $sensorDynamicData[$sensorID]['deviceID'];
        }
    }
    $deviceNormalArray = array_unique($deviceNormalArray);

    $sql = "SELECT id, disconnectionStatus FROM `devices` where disconnectionStatus = 0 AND deviceMode = '".DEVICE_MODE_ENABLED."' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $deviceID = $result['id'];
        if (in_array($deviceID, $deviceNormalArray)) {
            //found as normal and running.
            //echo "Normal and Running fine. DeviceID = $deviceID<br/>";
        }
        else {
            //not found in normal array raise alarm and update status to disconnected.
            echo "<br/>Device Disconnected***** $deviceID";
            doProcessAlert($deviceID, 0, 0, DEVICEDISCONNECTED_ALERT, 'Device Disconnected' );
            $sql = "UPDATE devices SET disconnectionStatus = 1 WHERE id = '$deviceID' ";
            mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbTmsConn));
        }
    }

}


function initializeSensorDynamicData(){
    global $sensorConfigData;
    global $sensorDynamicData;
    global $dbTmsConn;

    //this will create an array for updating all dynamic values related to sersor for each 1 min interval and get updated to the
    //table along with moving average data.
    foreach ( $sensorConfigData as $sensorID => $sensorObject) {
        $sensorDynamicData[$sensorID]['deviceID'] = $sensorObject['deviceID'];
    //  $sensorDynamicData[$sensorID]['sensorTag'] = $sensorObject['sensorTag'];
        $sensorDynamicData[$sensorID]['numSamples'] = '';
        $sensorDynamicData[$sensorID]['lastSensorValue'] = '';
        $sensorDynamicData[$sensorID]['lastTime'] = '';
        $sensorDynamicData[$sensorID]['minSensorValue'] = '';
        $sensorDynamicData[$sensorID]['avgSensorValue'] = '';
        $sensorDynamicData[$sensorID]['maxSensorValue'] = '';
    }

    $movingAverageTime = getDateLessMinutes(MOVING_AVERAGE_FIFTEEN_MINUTE) ;
    $sql = "SELECT sensorID, count(*) as numSamples, min(scaledValue) as minSensorValue, avg(scaledValue) as avgSensorValue, max(scaledValue) as maxSensorValue FROM `sensorSegregatedValues` where collectedTime >= '$movingAverageTime'  group by sensorID ";
    //echo $sql."<br/>";
    $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $sensorID = $result['sensorID'];
        $sensorDynamicData[$sensorID]['numSamples'] = $result['numSamples'];
        $sensorDynamicData[$sensorID]['minSensorValue'] = $result['minSensorValue'];
        $sensorDynamicData[$sensorID]['avgSensorValue'] = $result['avgSensorValue'];
        $sensorDynamicData[$sensorID]['maxSensorValue'] = $result['maxSensorValue'];
    
        //echo "ID [$sensorID] [".$sensorDynamicData[$sensorID]['numSamples']."] [".$sensorDynamicData[$sensorID]['minSensorValue']."] [".$sensorDynamicData[$sensorID]['avgSensorValue']."] [".$sensorDynamicData[$sensorID]['maxSensorValue']."] <br/>";
    }
}

function printSensorDynamicData(){
    global $sensorDynamicData;
    foreach ( $sensorDynamicData as $sensorID => $val) {
        echo "<br/>ID [$sensorID] [".$sensorDynamicData[$sensorID]['lastSensorValue']."] [".$sensorDynamicData[$sensorID]['numSamples']."] [".$sensorDynamicData[$sensorID]['minSensorValue']."] [".$sensorDynamicData[$sensorID]['avgSensorValue']."] [".$sensorDynamicData[$sensorID]['maxSensorValue']."] ";
    }
    echo "<br/>";
}

function updateSensorDynamicData() {
    global $sensorDynamicData;
    global $dbTmsConn;
    $jsonString = json_encode($sensorDynamicData);
    $sql= "UPDATE dynamicValues SET data = '$jsonString' WHERE type ='SENSOR_DYNAMIC_DATA' ";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
}

function createConfigFiles(){
    global $dbConfigConn;
    global $configCompanyID;

    $IDNamesInfo=[];
    $row=[];
    $IDNamesString='';

    $sql = "select companyCode, companyName, email, website, imageInfo from company where companyCode = '$configCompanyID' LIMIT 1";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $row['companyCode']=$result['companyCode'];
        $row['companyName']=$result['companyName'];
        $row['email']=$result['email'];
        $row['website']=$result['website'];
        $row['imageInfo']=$result['imageInfo'];
    }
    $IDNamesInfo['company']=$row;
    $row=[];

    foreach(TABLE_NAME_ARRAY as $tableName ) {
        $row=[];
        $sql = "select * from $tableName ";
        $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
        while ($result = mysqli_fetch_assoc($getResult))
        {
            $id = $result['id'];
            if ($tableName=='locations'){
                $row[$id]['locationName']=$result['locationName'];
            }
            if ($tableName=='branches'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchName']=$result['branchName'];
            }
            if ($tableName=='facilities'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityName']=$result['facilityName'];
            }
            if ($tableName=='buildings'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingName']=$result['buildingName'];
            }
            if ($tableName=='floors'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingID']=$result['buildingID'];
                $row[$id]['floorName']=$result['floorName'];
            }
            if ($tableName=='zones'){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingID']=$result['buildingID'];
                $row[$id]['floorID']=$result['floorID'];
                $row[$id]['zoneName']=$result['zoneName'];
                $row[$id]['isAQI']=$result['isAQI'];
                $row[$id]['emailInstant']=$result['emailInstant'];
                $row[$id]['smsInstant']=$result['smsInstant'];
            }
            if ($tableName =='devices' || $tableName =='sensors' ){
                $row[$id]['locationID']=$result['locationID'];
                $row[$id]['branchID']=$result['branchID'];
                $row[$id]['facilityID']=$result['facilityID'];
                $row[$id]['buildingID']=$result['buildingID'];
                $row[$id]['floorID']=$result['floorID'];
                $row[$id]['zoneID']=$result['zoneID'];
                if ($tableName =='devices') {
                    $row[$id]['deviceName']=$result['deviceName'];
                    $row[$id]['deviceCategory']=$result['deviceCategory'];
                    $row[$id]['deviceTag']=$result['deviceTag'];
                    $row[$id]['connStatus']=$result['connStatus'];
                    $row[$id]['notificationShow']=$result['notificationShow'];
                }
                if ($tableName =='sensors') {
                    $row[$id]['sensorName']=$result['sensorName'];
                    $row[$id]['sensorTag']=$result['sensorTag'];
                    $row[$id]['units']=$result['units'];
                    $row[$id]['alarmType']=$result['alarmType'];
                }
            }else {
                $row[$id]['coordinates']=$result['coordinates'];
                $row[$id]['image']=$result['image'];
            }
        }
        $IDNamesInfo[$tableName]=$row;
    }


    $IDNamesString = json_encode($IDNamesInfo);
    echo "<br/>Length =".strlen($IDNamesString);
    $fileWrite = file_put_contents(ID_NAMES_FILE_NAME, $IDNamesString, LOCK_EX );
    if ($fileWrite == false) {
        echo "\n<br/>Error creating the Information configuration file ***** Check all path might not work\n";
    }
    else {
        echo "<br/>Information file created successfully.";
    }

    $deviceIDInfoArray=[];
    $deviceInfoString='';
    $getDataSql = "select * FROM `devices` order by id ";
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $id = $result['id'];
        $deviceIDInfoArray[$id]['locationID'] = $result['locationID'];
        $deviceIDInfoArray[$id]['branchID'] = $result['branchID'];
        $deviceIDInfoArray[$id]['facilityID'] = $result['facilityID'];
        $deviceIDInfoArray[$id]['buildingID'] = $result['buildingID'];
        $deviceIDInfoArray[$id]['floorID'] = $result['floorID'];
        $deviceIDInfoArray[$id]['zoneID'] = $result['zoneID'];
        $deviceIDInfoArray[$id]['deviceID'] = $result['id'];
        $deviceIDInfoArray[$id]['coordinates'] = $result['coordinates'];
        $deviceIDInfoArray[$id]['deviceName'] = $result['deviceName'];
        $deviceIDInfoArray[$id]['deviceMode'] = $result['deviceMode'];
        $deviceIDInfoArray[$id]['connStatus'] = $result['connStatus'];
        $deviceIDInfoArray[$id]['notificationShow'] = $result['notificationShow'];

        $sql = "select id FROM `sensors`  where deviceID=$id ";
        $sensorListString ='';
        $sensorResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
        while ($row = mysqli_fetch_assoc($sensorResult))
        {
            if ($sensorListString == '') {
                $sensorListString .= $row['id'];
            }
            else {
                $sensorListString .= ",".$row['id'];
            }
        }

        $deviceIDInfoArray[$id]['sensorList'] = $sensorListString;
    }
    $deviceInfoString = json_encode($deviceIDInfoArray);
    echo "<br/>Length =".strlen($deviceInfoString);

    $fileWrite = file_put_contents(DEVICE_FILE_NAME, $deviceInfoString, LOCK_EX );
    if ($fileWrite == false) {
        echo "\n<br/>Error creating the device configuration file ***** Check all path might not work\n";
    }
    else {
        echo "<br/>Device Info file created successfully.";
    }

    $getDataSql = "select * FROM `sensors`  order by id ";
    $sensorIDInfoArray=[];
    $sensorInfoString='';
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $id = $result['id'];
        $sensorIDInfoArray[$id]['locationID'] = $result['locationID'];
        $sensorIDInfoArray[$id]['branchID'] = $result['branchID'];
        $sensorIDInfoArray[$id]['facilityID'] = $result['facilityID'];
        $sensorIDInfoArray[$id]['buildingID'] = $result['buildingID'];
        $sensorIDInfoArray[$id]['floorID'] = $result['floorID'];
        $sensorIDInfoArray[$id]['zoneID'] = $result['zoneID'];
        $sensorIDInfoArray[$id]['deviceID'] = $result['deviceID'];
        $sensorIDInfoArray[$id]['deviceCategory'] = $result['deviceCategory'];
        $sensorIDInfoArray[$id]['sensorName'] = $result['sensorName'];
        $sensorIDInfoArray[$id]['sensorTag'] = $result['sensorTag'];
        $sensorIDInfoArray[$id]['sensorCategory'] = $result['sensorCategory'];
        $sensorIDInfoArray[$id]['defaultValue'] = $result['defaultValue'];
        $sensorIDInfoArray[$id]['alarmType'] = $result['alarmType'];
        $sensorIDInfoArray[$id]['bumpTest'] = $result['bumpTest'];
        $sensorIDInfoArray[$id]['calibrationTest'] = $result['calibrationTest'];
        $sensorIDInfoArray[$id]['isStel'] = $result['isStel'];
        $sensorIDInfoArray[$id]['isTwa'] = $result['isTwa'];
        $sensorIDInfoArray[$id]['isAQI'] = $result['isAQI'];
        $sensorIDInfoArray[$id]['bumpInfo'] = json_decode($result['bumpInfo']);
        $sensorIDInfoArray[$id]['calibrationInfo'] = json_decode($result['calibrationInfo']);
        $sensorIDInfoArray[$id]['scaleInfo'] = json_decode($result['scaleInfo']);
        $sensorIDInfoArray[$id]['stelInfo'] = json_decode($result['stelInfo']);
        $sensorIDInfoArray[$id]['twaInfo'] = json_decode($result['twaInfo']);
        $sensorIDInfoArray[$id]['modBusInfo'] = json_decode($result['modBusInfo']);
        $sensorIDInfoArray[$id]['criticalAlertInfo'] = json_decode($result['criticalAlertInfo']);
        $sensorIDInfoArray[$id]['warningAlertInfo'] = json_decode($result['warningAlertInfo']);
        $sensorIDInfoArray[$id]['outOfRangeAlertInfo'] = json_decode($result['outOfRangeAlertInfo']);
        $sensorIDInfoArray[$id]['digitalAlertInfo'] = json_decode($result['digitalAlertInfo']);
        $sensorIDInfoArray[$id]['units'] = $result['units'];
        $sensorIDInfoArray[$id]['sensorOutput'] = $result['sensorOutput'];
        $sensorIDInfoArray[$id]['sensorStatus'] = $result['sensorStatus'];
        $sensorIDInfoArray[$id]['notificationStatus'] = $result['notificationStatus'];

    }
    $sensorInfoString = json_encode($sensorIDInfoArray);
    echo "<br/>Length =".strlen($sensorInfoString);

    $fileWrite = file_put_contents(SENSOR_FILE_NAME, $sensorInfoString, LOCK_EX );
    if ($fileWrite == false) {
        echo "\n<br/>Error creating the sensor configuration file ***** Check all path might not work\n";
    }
    else {
        echo "<br/>Sensor Info file created successfully.";
    }

    $getDataSql = "select * FROM `emailTextInfo` ";
    $reportEmailArray=[];
    $reportEmailString='';
    $getResult = mysqli_query($dbConfigConn,$getDataSql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $templateID = $result['templateID'];
        $reportEmailArray[$templateID]['subject'] = $result['subject'];
        $reportEmailArray[$templateID]['body'] = $result['body'];
    }
    $reportEmailString = json_encode($reportEmailArray);
    echo "<br/>Length =".strlen($reportEmailString);

    $fileWrite = file_put_contents(REPORTS_FILE_NAME, $reportEmailString, LOCK_EX );
    if ($fileWrite == false) {
        echo "\n<br/>Error creating the report Email configuration file ***** Check all path might not work\n";
    }
    else {
        echo "<br/>Report Email file created successfully.";
    }
    
    return;
}


function getDeviceTableName($deviceID,$intervalMinute) {
    $tblIndex1 = $deviceID % 10;  // will send to database 0-9 based on device id
    $tblIndex2 = $intervalMinute; // based on minutes data will insert into that table
    return 'deviceSensorData_'.$tblIndex1.'_'.$tblIndex2;
}


function checkCriticalAlert($deviceID, $sensorID, $sensorValue){
	global $sensorConfigData;
    global $debugFlag;
    if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == HIGH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) {
            //if ($debugFlag) { echo "Critical Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['criticalAlertInfo']['cHTxt'] ;};
            doProcessAlert($deviceID, $sensorID, $sensorValue, CRITICAL_ALERT, $sensorConfigData[$sensorID]['criticalAlertInfo']['cHTxt'] );
            return true;
        }
    }
    else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == LOW_ALERT_TYPE) {
        if ($sensorValue < $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) {
            //if ($debugFlag) { echo "Critical Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['criticalAlertInfo']['cLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, CRITICAL_ALERT, $sensorConfigData[$sensorID]['criticalAlertInfo']['cLTxt'] );
            return true;
        }
    }else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == BOTH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) {
            //if ($debugFlag) { echo "Critical Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['criticalAlertInfo']['cHTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, CRITICAL_ALERT, $sensorConfigData[$sensorID]['criticalAlertInfo']['cHTxt'] );
            return true;
        }
        if ($sensorValue < $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) {
            //if ($debugFlag) { echo "Critical Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['criticalAlertInfo']['cLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, CRITICAL_ALERT, $sensorConfigData[$sensorID]['criticalAlertInfo']['cLTxt'] );
            return true;
        }
    }



    return false;
}

function calculateSTEL($deviceID, $sensorID, $sensorValue) {
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    global $dbTmsConn;
    $sql='';
    $numSamples = 0;
    $avgSensorValue = 0;

    $stelDuration=$sensorConfigData[$sensorID]['stelInfo']['stelDuration'];
    //if default duration for most sensors is 15 minutes then take from array directly instead of again query
    if ($sensorConfigData[$sensorID]['stelInfo']['stelDuration'] == FIFTEEN_MINUTE) {
        $sensorDynamicData[$sensorID]['avgSensorValue'];
        $numSamples = $sensorDynamicData[$sensorID]['numSamples'];
        $avgSensorValue = $sensorDynamicData[$sensorID]['avgSensorValue'];

        //anand check after few weeks remove view and this below lines.
        //$stelDateTime = getDateLessMinutes($sensorConfigData[$sensorID]['stelInfo']['stelDuration']) ;
        //$sql = "SELECT numSamples, avgSensorValue FROM `movingAverage15` where sensorID='$sensorID' group by sensorID ";
    }
    else {
        $stelDateTime = getDateLessMinutes($sensorConfigData[$sensorID]['stelInfo']['stelDuration']) ;
        $sql = "SELECT sensorID, count(*) as numSamples, avg(scaledValue) as avgSensorValue FROM `sensorSegregatedValues` where collectedTime >= '$stelDateTime' and sensorID='$sensorID' group by sensorID ";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        $result = mysqli_fetch_assoc($getResult);
        if ($result) {
            $numSamples = $result['numSamples'];
            $avgSensorValue = $result['avgSensorValue'];
        }
    
    }
    //minimum 15 samples needed to calculate STEL in last 15 minutes. 
    if ($numSamples < 15) {
        //echo "No 15 samples....returning.****";
        return false;
    }
    //echo "<br/>Avg SensorValue = $avgSensorValue";
    if ($avgSensorValue > $sensorConfigData[$sensorID]['stelInfo']['stelLimit']) {
        echo "*** Processing StEL Limit".$sensorConfigData[$sensorID]['stelInfo']['stelLimit'];
        doProcessAlert($deviceID, $sensorID, $avgSensorValue, STEL_ALERT, $sensorConfigData[$sensorID]['stelInfo']['stelAlert'] );
        return true;
    }
    return false;
}


function calculateTWA($deviceID, $sensorID) {
    global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    global $dbTmsConn;

    foreach ($sensorConfigData[$sensorID]['twaInfo'] as $shiftID => $twaInfoArr) {
        $sql='';
        $twaArray=[];
        $twaValue=0;
        $dateTimeNowObj = new DateTime();
        $twaStartDateTime = date('Y-m-d')." ".$twaInfoArr['twaStartTime'];
        $twaStartDateTimeObj = new DateTime($twaStartDateTime);
        $twaEndDateTimeObj = new DateTime($twaStartDateTime);
        // anand check // change to hour after UI change // +8 hours instead of seconds or +10 hours. - done.  
        //now getting minutes.
        $hoursToAdd=$twaInfoArr['twaDuration'];
        $hoursToAddString = "+".$hoursToAdd." minutes";
        $twaEndDateTimeObj->modify($hoursToAddString);

        if ( ($dateTimeNowObj >= $twaStartDateTimeObj)  && ($dateTimeNowObj <= $twaEndDateTimeObj) ) {
            //anand check after 2 weeks on the movingaverage view table and remove.
            //$sql = "SELECT avgSensorValue FROM `movingAverage15` where sensorID='$sensorID' ";
            //$getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            //$result = mysqli_fetch_assoc($getResult);
            //if ($result) {
            //}

            //$avgSensorValue=$result['avgSensorValue'];
            $avgSensorValue = $sensorDynamicData[$sensorID]['avgSensorValue'];
            if ($avgSensorValue == null) {
                echo "<br/>Cannot calculate TWA";
                continue;
            }
            $twaValue = number_format($avgSensorValue*FIFTEEN_MINUTE/($hoursToAdd), SENSOR_DECIMAL_PRECISION, '.','');
            $dateString = $dateTimeNowObj->format('Y-m-d');
            $timeString = $dateTimeNowObj->format('H:i:s');
            //anand check on the select * and update.
            $sql = "SELECT * FROM `twaInfo` where deviceID = '$deviceID' AND sensorID='$sensorID' and shiftID = '$shiftID' and calculatedDate='$dateString' ";
            //echo "<br/> $sql";
            $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            if ( $getResult->num_rows > 0 ) {
                $result = mysqli_fetch_assoc($getResult);    
                $twaValue = number_format( ($twaValue + $result['currentValue']), SENSOR_DECIMAL_PRECISION, '.','');
                $twaArray = json_decode($result['info'], true);
                $twaArray[$timeString]['twa']=$twaValue;
                $twaArray[$timeString]['sensor']=$avgSensorValue;
                
                $twaString = json_encode($twaArray);
                $sql = "UPDATE `twaInfo` SET currentValue = '$twaValue', info='$twaString' WHERE deviceID = '$deviceID' AND sensorID='$sensorID' AND shiftID = '$shiftID' AND calculatedDate = '$dateString' ";
                //echo "<br/> $sql";
                mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

            }
            else {
                $twaArray[$timeString]['twa']=$twaValue;
                $twaArray[$timeString]['sensor']=$avgSensorValue;
                $twaString = json_encode($twaArray);
                $sql = "INSERT INTO `twaInfo` ( deviceID, sensorID, shiftID, currentValue, info, calculatedDate ) VALUES ( '$deviceID', '$sensorID', '$shiftID', '$twaValue', '$twaString', '$dateString' ) ";
                //echo "<br/> $sql";
                mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            }
            if ($twaValue >$twaInfoArr['twaLimit'] ) {
                doProcessAlert($deviceID, $sensorID, $twaValue, TWA_ALERT, $twaInfoArr['twaAlert'], $shiftID );
            }

        }
        else {
            //echo "<br/>Reset TWA if any for $sensorID";
        }
    }
}

function calculateTWAOld($deviceID, $sensorID) {
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    global $dbTmsConn;
    $sql='';
    $twaArray=[];
    $twaValue=0;
    $dateTimeNowObj = new DateTime();
    $twaStartDateTime = date('Y-m-d')." ".$sensorConfigData[$sensorID]['twaInfo']['twaStartTime'];
    $twaStartDateTimeObj = new DateTime($twaStartDateTime);
    $twaEndDateTimeObj = new DateTime($twaStartDateTime);
    // anand check // change to hour after UI change // +8 hours instead of seconds or +10 hours. - done.  
    $hoursToAdd=$sensorConfigData[$sensorID]['twaInfo']['twaDuration'];
    $hoursToAddString = "+".$hoursToAdd." hours";
    $twaEndDateTimeObj->modify($hoursToAddString);

    if ( ($dateTimeNowObj >= $twaStartDateTimeObj)  && ($dateTimeNowObj <= $twaEndDateTimeObj) ) {
        //anand check after 2 weeks on the movingaverage view table and remove.
        //$sql = "SELECT avgSensorValue FROM `movingAverage15` where sensorID='$sensorID' ";
        //$getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        //$result = mysqli_fetch_assoc($getResult);
        //if ($result) {
        //}

        //$avgSensorValue=$result['avgSensorValue'];
        $avgSensorValue = $sensorDynamicData[$sensorID]['avgSensorValue'];
        $twaValue = number_format($avgSensorValue*FIFTEEN_MINUTE/($hoursToAdd*SIXTY_MINUTE), SENSOR_DECIMAL_PRECISION, '.','');
        $dateString = $dateTimeNowObj->format('Y-m-d');
        $timeString = $dateTimeNowObj->format('H:i:s');
        //anand check on the select * and update.
        $sql = "SELECT * FROM `twaInfo` where deviceID = '$deviceID' AND sensorID='$sensorID' and calculatedDate='$dateString' ";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        if ( $getResult->num_rows > 0 ) {
            $result = mysqli_fetch_assoc($getResult);    
            $twaValue = number_format( ($twaValue + $result['currentValue']), SENSOR_DECIMAL_PRECISION, '.','');
            $twaArray = json_decode($result['info'], true);
            $twaArray[$timeString]['twa']=$twaValue;
            $twaArray[$timeString]['sensor']=$avgSensorValue;
            
            $twaString = json_encode($twaArray);
            $sql = "UPDATE `twaInfo` SET currentValue = '$twaValue', info='$twaString' WHERE deviceID = '$deviceID' AND sensorID='$sensorID' AND calculatedDate = '$dateString' ";
            mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

        }
        else {
            $twaArray[$timeString]['twa']=$twaValue;
            $twaArray[$timeString]['sensor']=$avgSensorValue;
            $twaString = json_encode($twaArray);
            $sql = "INSERT INTO `twaInfo` ( deviceID, sensorID, currentValue, info, calculatedDate ) VALUES ( '$deviceID', '$sensorID', '$twaValue', '$twaString', '$dateString' ) ";
            mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        }
        if ($twaValue >$sensorConfigData[$sensorID]['twaInfo']['twaLimit'] ) {
            doProcessAlert($deviceID, $sensorID, $twaValue, TWA_ALERT, $sensorConfigData[$sensorID]['twaInfo']['twaAlert'] );
        }

    }
    else {
        echo "<br/>Reset TWA if any for $sensorID";
    }
    
}


function checkWarningAlert($deviceID, $sensorID, $sensorValue){
	global $sensorConfigData;
    global $debugFlag;
    if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == HIGH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
            //  if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['warningAlertInfo']['wHTxt'] ;};
            doProcessAlert($deviceID, $sensorID, $sensorValue, WARNING_ALERT, $sensorConfigData[$sensorID]['warningAlertInfo']['wHTxt'] );
            return true;
        }
    }
    else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == LOW_ALERT_TYPE) {
        if ($sensorValue < $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['warningAlertInfo']['wLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, WARNING_ALERT, $sensorConfigData[$sensorID]['warningAlertInfo']['wLTxt'] );
            return true;
        }
    }else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == BOTH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['warningAlertInfo']['wHTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, WARNING_ALERT, $sensorConfigData[$sensorID]['warningAlertInfo']['wHTxt'] );
            return true;
        }
        if ($sensorValue < $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['warningAlertInfo']['wLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, WARNING_ALERT, $sensorConfigData[$sensorID]['warningAlertInfo']['wLTxt'] );
            return true;
        }
    }
    return false;
}

function checkOutOfRangeAlert($deviceID, $sensorID, $sensorValue){
	global $sensorConfigData;
    global $debugFlag;
    if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == HIGH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oHTxt'] ;};
            doProcessAlert($deviceID, $sensorID, $sensorValue, OUTOFRANGE_ALERT, $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oHTxt'] );
            return true;
        }
    }
    else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == LOW_ALERT_TYPE) {
        if ($sensorValue < $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, OUTOFRANGE_ALERT, $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oLTxt'] );
            return true;
        }
    }else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == BOTH_ALERT_TYPE) {
        if ($sensorValue > $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - HIGH ".$sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oHTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, OUTOFRANGE_ALERT, $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oHTxt'] );
            return true;
        }
        if ($sensorValue < $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) {
            //if ($debugFlag) { echo "Warning Limit Execeeds for this sensor - LOW ".$sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oLTxt'];};
            doProcessAlert($deviceID, $sensorID, $sensorValue, OUTOFRANGE_ALERT, $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oLTxt'] );
            return true;
        }
    }
    return false;
}


function doProcessAlert($deviceID, $sensorID, $sensorValue, $alertType, $txtMessage, $shiftID=null) {
    global $dbTmsConn;
    global $sensorConfigData;
    global $deviceConfigData;

    $currentDateTime = date('Y-m-d H:i:s');
    //$sensorTag =  $sensorConfigData[$sensorID]['sensorTag'];
    if ($deviceConfigData[$deviceID]['notificationShow'] == '0') {
        $notificationShow=0;
    }else {
        $notificationShow=1;
    }
    // check first type is Device Disconnect because it doesnot have any sensordata.  So we need to process separately.
    if ($alertType == DEVICEDISCONNECTED_ALERT ) {
        $sql = "select id from alertCrons where deviceID = '$deviceID' AND alertType = '$alertType' AND status = 0 ";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        if ( $getResult->num_rows > 0 ) {
            //already alarm there - No need to process return
            //echo "Alert already there -- No process";
            return;
        }
        else {
            //no sensors - so get details from device array
            $deviceName = $deviceConfigData[$deviceID]['deviceName'];
            //default unlatch for device disconnect.
            $sql = "INSERT INTO alertCrons (locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, deviceName, alertType, value, msg, status, userClearStatus, notificationShow, alarmType, collectedTime ) values ('".$deviceConfigData[$deviceID]['locationID']."', '".$deviceConfigData[$deviceID]['branchID']."', '".$deviceConfigData[$deviceID]['facilityID']."', '".$deviceConfigData[$deviceID]['buildingID']."', '".$deviceConfigData[$deviceID]['floorID']."', '".$deviceConfigData[$deviceID]['zoneID']."' , '$deviceID', '$deviceName', '$alertType', '$sensorValue',  '$txtMessage', '0' , '0' , '$notificationShow' , 'UnLatch' , '$currentDateTime' )  ";
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            sendAlertEmailSMS($deviceConfigData[$deviceID]['zoneID'], $deviceID, NULL, $alertType, $txtMessage, $sensorValue, $shiftID);
            return;
        }
        return;
    }

    if ( $alertType == TWA_ALERT || $alertType == STEL_ALERT ) {
        
        $alarmType = $sensorConfigData[$sensorID]['alarmType'];
        //check if already alert exists in the alertCrons // check only for open alarts
        $sql = "select id from alertCrons where deviceID = '$deviceID' AND sensorID = '$sensorID' and alertType = '$alertType' AND status = 0 ";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

    
        if ( $getResult->num_rows > 0 ) {
            //already alarm there - No need to process return
            //echo "Alert already there -- No process";
            return;
        }
        else {
            $deviceName = $deviceConfigData[$deviceID]['deviceName'];
            $sensorTag = $sensorConfigData[$sensorID]['sensorTag'];
            if ( $alertType == STEL_ALERT ) {
                $sql = "INSERT INTO alertCrons (locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, deviceName, sensorID, sensorTag, alertType, value, msg, status, userClearStatus, notificationShow, alarmType, collectedTime ) values ('".$sensorConfigData[$sensorID]['locationID']."', '".$sensorConfigData[$sensorID]['branchID']."', '".$sensorConfigData[$sensorID]['facilityID']."', '".$sensorConfigData[$sensorID]['buildingID']."', '".$sensorConfigData[$sensorID]['floorID']."', '".$sensorConfigData[$sensorID]['zoneID']."' , '$deviceID', '$deviceName', '$sensorID', '$sensorTag', '$alertType', '$sensorValue',  '$txtMessage', '0' , '0' , '$notificationShow' , '$alarmType' , '$currentDateTime' )  ";
            }
            if ($alertType == TWA_ALERT ) {
                $sql = "INSERT INTO alertCrons (locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, shiftID, deviceName, sensorID, sensorTag, alertType, value, msg, status, userClearStatus, notificationShow, alarmType, collectedTime ) values ('".$sensorConfigData[$sensorID]['locationID']."', '".$sensorConfigData[$sensorID]['branchID']."', '".$sensorConfigData[$sensorID]['facilityID']."', '".$sensorConfigData[$sensorID]['buildingID']."', '".$sensorConfigData[$sensorID]['floorID']."', '".$sensorConfigData[$sensorID]['zoneID']."' , '$deviceID', '$shiftID', '$deviceName', '$sensorID', '$sensorTag', '$alertType', '$sensorValue',  '$txtMessage', '0' ,'0' , '$notificationShow' , '$alarmType' , '$currentDateTime' )  ";
            }
    
            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
            sendAlertEmailSMS($sensorConfigData[$sensorID]['zoneID'], $deviceID, $sensorID, $alertType, $txtMessage, $sensorValue, $shiftID);
            return;
        }
    }   

    if ( $alertType == CRITICAL_ALERT || $alertType == WARNING_ALERT || $alertType == OUTOFRANGE_ALERT) {
        //all other alarms process here.
        $alarmType = $sensorConfigData[$sensorID]['alarmType'];
        $alarmProcessFlag=false;
        //check if already alert exists in the alertCrons // check only for open alarts
        //$sql = "select id from alertCrons where deviceID = '$deviceID' AND sensorID = '$sensorID' and alertType = '$alertType' AND status = 0 ";
        //ignoring alerttype as need to generate new alerts every time.
        $sql = "select id, alertType from alertCrons where deviceID = '$deviceID' AND sensorID = '$sensorID'  AND status = 0 AND (alertType = '".WARNING_ALERT."' || alertType = '".CRITICAL_ALERT."' || alertType = '".OUTOFRANGE_ALERT."')  order by id DESC LIMIT 1";
        echo "<br/>Alert type check SQL = $sql";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        if ( $getResult->num_rows > 0 ) {
            $result = mysqli_fetch_assoc($getResult);
            //same alert type //no need to process
            if ($result['alertType'] == $alertType) {
                //already alarm there - No need to process return
                //echo "Alert already there -- No process";
                return;
            }
            else {
                $alarmProcessFlag = true;
            }
            //already alarm there - No need to process return
            //echo "Alert already there -- No process";
        }
        else {
            $alarmProcessFlag = true;
        }

        if ($alarmProcessFlag == true) {
            //insert into alertCron table
            $sql='';
            //all other sensor alerts like warning, critical, outofbound, stel processed here.
            $deviceName = $deviceConfigData[$deviceID]['deviceName'];
            $sensorTag = $sensorConfigData[$sensorID]['sensorTag'];
            $sql = "INSERT INTO alertCrons (locationID, branchID, facilityID, buildingID, floorID, zoneID, deviceID, deviceName, sensorID, sensorTag, alertType, value, msg, status, userClearStatus, notificationShow, alarmType, collectedTime ) values ('".$sensorConfigData[$sensorID]['locationID']."', '".$sensorConfigData[$sensorID]['branchID']."', '".$sensorConfigData[$sensorID]['facilityID']."', '".$sensorConfigData[$sensorID]['buildingID']."', '".$sensorConfigData[$sensorID]['floorID']."', '".$sensorConfigData[$sensorID]['zoneID']."' , '$deviceID', '$deviceName', '$sensorID', '$sensorTag', '$alertType', '$sensorValue',  '$txtMessage', '0' , '0' , '$notificationShow' , '$alarmType' , '$currentDateTime' )  ";

            $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

            sendAlertEmailSMS($sensorConfigData[$sensorID]['zoneID'], $deviceID, $sensorID, $alertType, $txtMessage, $sensorValue, $shiftID);
        }
        return;
    }

}





function scalingValue( $sensorID, $sensorValue){
	global $sensorConfigData;
    $scaledValue = 0;

    $minRatedReading = $sensorConfigData[$sensorID]['scaleInfo']['minR'];
    $maxRatedReading =  $sensorConfigData[$sensorID]['scaleInfo']['maxR'];
    $minRatedReadingScale =  $sensorConfigData[$sensorID]['scaleInfo']['minRS'];
    $maxRatedReadingScale =  $sensorConfigData[$sensorID]['scaleInfo']['maxRS'];
    //return ((maxRatedReadingScale - (minRatedReadingScale))/ (maxRatedReading - (minRatedReading))) *(sensorValue - (minRatedReading)) + minRatedReadingScale;
    if( ($maxRatedReading - $minRatedReading) !=0){
        //$scaledValue = ( ($maxRatedReadingScale - $minRatedReadingScale)/ ($maxRatedReading - $minRatedReading)) *($sensorValue - $minRatedReading);
        $scaledValue = (($maxRatedReadingScale - ($minRatedReadingScale))/ ($maxRatedReading - ($minRatedReading))) *($sensorValue - ($minRatedReading)) + $minRatedReadingScale;
    }else{
        $scaledValue = $sensorValue;
    }
    //((Ymax-Ymin)/(Xmax-Xmin)) * ($val - Xmin) + Ymin  //formula for scalling 
    //echo "$sensorID = SensorID=[$sensorID][$sensorValue][$scaledValue] minRatedReading [$minRatedReading] maxRatedReading [$maxRatedReading] minRatedReadingScale [$minRatedReadingScale]  maxRatedReadingScale [$maxRatedReadingScale] <br/>";
    return $scaledValue;
}

function getDateLessMinutes($minutes){
    // Get the current time
    $currentDateTime = new DateTime();
    //if $minutes not given or 0 or > 1440 it will return current time with seconds roundoff.
    if ($minutes > 0 && $minutes <= ONE_DAY ) {
        $minLessString = 'PT'.$minutes.'M';
        // Subtract $minutes
        $currentDateTime->sub(new DateInterval($minLessString));
    }
    // Round to the nearest minute
    $currentDateTime->setTime($currentDateTime->format('H'), $currentDateTime->format('i'), 0);
    return $currentDateTime->format('Y-m-d H:i:s');
}


function runSimulatorAll(){
    global $deviceConfigData;
    global $sensorConfigData;
    global $dbTmsConn;
    
    $dateInfo=date("Y-m-d");
    $timeInfo=date("H:i:s");
    $collectTime = $dateInfo." ".$timeInfo;
    $insertCount=0;

    foreach ($deviceConfigData as $deviceID => $deviceInfo) {
        //temporarily running only for few devices so that other devices runs with live data.
        if ($deviceID > 10) {
            continue;
        }
        //insert only if mode enabled 
        if ($deviceInfo['deviceMode'] == DEVICE_MODE_ENABLED  ) {
            $sensorCnt=0;
            $jsonSimulatorData=array();
            $jsonSimulatorData["DATE"]=$dateInfo;
            $jsonSimulatorData["TIME"]=$timeInfo;
            $jsonSimulatorData["DEVICE_ID"]=(string)$deviceID;
            $jsonSimulatorData["SD_CARD"] = "1"; //hardcoded
            $randVal = rand(1,5)*20;
            $jsonSimulatorData["RSSI"] = (string)$randVal;  //(20-100 range)
            $jsonSimulatorData["MODE"]= "2"; // hardcoded
            $jsonSimulatorData["ACCESS_CODE"]="1003"; // hardcoded

            foreach ($sensorConfigData as $sensorID => $sensorInfo ){
                if ($sensorInfo['deviceID'] == $deviceID && $sensorInfo['sensorStatus'] == 1) {
                    $val=$sensorInfo['defaultValue'];
                    $randVal=0;
                    if ($val > 50 && $val < 400) {
                        $randVal = rand(-1,4);
                    }
                    else if ($val < 10) {
                        $randVal = rand(2,5);    
                    }
                    else {
                        $randVal = rand(-1,2);    
                    }
                    $randValPercent=$randVal/100;
                    $valDyn = number_format( (($val*$randValPercent)+$val), SENSOR_DECIMAL_PRECISION, '.','');
                    //if ($debugFlag) { echo "\n<br/>Given Value** [$val] for [$key] Adding [$randVal%] - Final=[$valDyn]"; }
                    $jsonSimulatorData[$sensorID]=(string)$valDyn;
                    $sensorCnt++;
                }
            }
            if ($sensorCnt > 0) {
                $data=json_encode($jsonSimulatorData);
                $sql="insert into deviceIncomingData(data) values('$data')";
                $result=mysqli_query($dbTmsConn,$sql) or (die(mysqli_error($dbTmsConn)));
                $insertCount++;
            }
            
        }  //endif
        else {
            echo "<br/>*****DEVICE NOT ENABLED **** $deviceID - ".$deviceInfo['deviceMode'];
        }
    } //foreach
} //function end


function aggDeviceData($intervalMinute) {
    global $dbTmsConn;
    global $debugFlag;
    global $insertCount;
    global $sensorDynamicData;

    $insertCount = 0;
    //aggregate Data every $intervalMinute minute 
    $dateCurMinute = getDateLessMinutes(0);
    $dateMinute = getDateLessMinutes($intervalMinute);
    $sql = "SELECT deviceID, sensorID,  min(scaledValue) as minScaledVal, max(scaledValue) as maxScaledVal, AVG(scaledValue) as avgScaledVal, info  FROM `sensorSegregatedValues` WHERE collectedTime >= '$dateMinute' AND collectedTime <= '$dateCurMinute' group by deviceID, sensorID, info";
    if ($debugFlag) { echo "<br/>Processing  Minute[$intervalMinute] - $sql"; }
    $result = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    while ($row = mysqli_fetch_assoc($result))
    {
        $deviceID = $row['deviceID'];
        $tableName = getDeviceTableName($deviceID,$intervalMinute);
        $aggValueSql = "INSERT INTO $tableName (`deviceID`, `sensorID`,  `minScaledVal`,`maxScaledVal`,`avgScaledVal`, `info`, `collectedTime`)  VALUES ('".$row['deviceID']."','".$row['sensorID']."','".$row['minScaledVal']."','".$row['maxScaledVal']."','".$row['avgScaledVal']."','".$row['info']."','".$dateCurMinute."' )";
        $insertCount++;
        //if ($debugFlag) { echo "<br/> Insert SQL = $aggValueSql"; }              
        $aggValuesResut = mysqli_query($dbTmsConn,$aggValueSql) or die(mysqli_error($dbTmsConn));

        $sensorID = $row['sensorID'];
        if ($row['minScaledVal'] < $sensorDynamicData[$sensorID]['minSensorValue'] ) {
            $sensorDynamicData[$sensorID]['minSensorValue']=$row['minScaledVal'];
        }
        if ($row['maxScaledVal'] > $sensorDynamicData[$sensorID]['maxSensorValue'] ) {
            $sensorDynamicData[$sensorID]['maxSensorValue']=$row['maxScaledVal'];
        }
    }
    echo "<br/>Processed and inserted [$insertCount] Values<br/>";
}

function tryCloseWarningAlert($deviceID, $sensorID, $alertID, $collectedTime){
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    $updateAlertFlag=false;
    $sensorLastValue = $sensorDynamicData[$sensorID]['lastSensorValue'];
    $sensorLastTime = $sensorDynamicData[$sensorID]['lastTime'];
    if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == HIGH_ALERT_TYPE) {
        if ($sensorLastValue <= $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
            $updateAlertFlag=true;
        }
    }
    else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == LOW_ALERT_TYPE) {
        if ($sensorLastValue >= $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
            $updateAlertFlag=true;
        }
    }else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == BOTH_ALERT_TYPE) {
        if ( ($sensorLastValue <= $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) && ($sensorLastValue >= $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) ) {
            $updateAlertFlag=true;
        }
    }
    if ($updateAlertFlag ==true) {
        doUpdateAlert( $sensorID, $alertID, $sensorLastValue, $sensorLastTime, $collectedTime );
    }
    return false;
}

function tryCloseCriticalAlert($deviceID, $sensorID, $alertID, $collectedTime){
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    $updateAlertFlag=false;
    $sensorLastValue = $sensorDynamicData[$sensorID]['lastSensorValue'];
    $sensorLastTime = $sensorDynamicData[$sensorID]['lastTime'];
    if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == HIGH_ALERT_TYPE) {
        if ($sensorLastValue <= $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) {
            $updateAlertFlag=true;
        }
    }
    else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == LOW_ALERT_TYPE) {
        if ($sensorLastValue >= $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) {
            $updateAlertFlag=true;
        }
    }else if ($sensorConfigData[$sensorID]['criticalAlertInfo']['cAT'] == BOTH_ALERT_TYPE) {
        if ( ($sensorLastValue <= $sensorConfigData[$sensorID]['criticalAlertInfo']['cMax']) && ($sensorLastValue >= $sensorConfigData[$sensorID]['criticalAlertInfo']['cMin']) ) {
            $updateAlertFlag=true;
        }
    }

    if ($updateAlertFlag ==true) {
        doUpdateAlert( $sensorID, $alertID, $sensorLastValue, $sensorLastTime , $collectedTime);
    }
    return false;
}

function tryCloseOutOfRangeAlert($deviceID, $sensorID, $alertID, $collectedTime){
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    $updateAlertFlag=false;
    $sensorLastValue = $sensorDynamicData[$sensorID]['lastSensorValue'];
    $sensorLastTime = $sensorDynamicData[$sensorID]['lastTime'];
    if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == HIGH_ALERT_TYPE) {
        if ($sensorLastValue <= $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) {
            $updateAlertFlag=true;
        }
    }
    else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == LOW_ALERT_TYPE) {
        if ($sensorLastValue >= $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) {
            $updateAlertFlag=true;
        }
    }else if ($sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oAT'] == BOTH_ALERT_TYPE) {
        if ( ($sensorLastValue <= $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMax']) && ($sensorLastValue >= $sensorConfigData[$sensorID]['outOfRangeAlertInfo']['oMin']) ) {
            $updateAlertFlag=true;
        }
    }

    if ($updateAlertFlag ==true) {
        doUpdateAlert($sensorID, $alertID, $sensorLastValue, $sensorLastTime, $collectedTime );
    }
    return false;
}

function tryCloseDeviceDisconnectAlert($deviceID, $alertID, $collectedTime){
    global $debugFlag;
    global $dbConfigConn;
    global $dbTmsConn;
    $updateAlertFlag=false;

    $sql = "SELECT id, disconnectionStatus FROM `devices` where id = '$deviceID' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        //back to normal updated on data processing.
        if ($result['disconnectionStatus'] == 0 ) {
            $dateString = date('Y-m-d H:i:s');
            $diffString = getDifferenceString($collectedTime, $dateString);
            $statusMessage = DEVICE_DISCONNECTED_CLOSING_TEXT;
            $sql = "UPDATE alertCrons SET status=1 , closedTime = '$dateString' , statusMessage = '$statusMessage', diffMinutes = '$diffString' where id = '$alertID' ";
            mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        }
    }
    return false;
}



function tryCloseStelAlert($deviceID, $sensorID, $alertID, $collectedTime) {
	global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    global $dbTmsConn;
    $sql='';
    $numSamples = 0;
    $avgSensorValue = 0;
    $currentDateTime=date('Y-m-d H:i:s');

    $stelDuration=$sensorConfigData[$sensorID]['stelInfo']['stelDuration'];
    //if default duration for most sensors is 15 minutes then take from array directly instead of again query
    if ($sensorConfigData[$sensorID]['stelInfo']['stelDuration'] == FIFTEEN_MINUTE) {
        $sensorDynamicData[$sensorID]['avgSensorValue'];
        $numSamples = $sensorDynamicData[$sensorID]['numSamples'];
        $avgSensorValue = $sensorDynamicData[$sensorID]['avgSensorValue'];

        echo "<br/>Taking Num samples directly from array for $sensorID -- $numSamples -- $avgSensorValue";

        //anand check after few weeks remove view and this below lines.
        //$stelDateTime = getDateLessMinutes($sensorConfigData[$sensorID]['stelInfo']['stelDuration']) ;
        //$sql = "SELECT numSamples, avgSensorValue FROM `movingAverage15` where sensorID='$sensorID' group by sensorID ";
    }
    else {
        $stelDateTime = getDateLessMinutes($sensorConfigData[$sensorID]['stelInfo']['stelDuration']) ;
        $sql = "SELECT sensorID, count(*) as numSamples, avg(scaledValue) as avgSensorValue FROM `sensorSegregatedValues` where collectedTime >= '$stelDateTime' and sensorID='$sensorID' group by sensorID ";
        echo "<br/> Stel close SQL = $sql";
        $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
        $result = mysqli_fetch_assoc($getResult);
        if ($result) {
            $numSamples = $result['numSamples'];
            $avgSensorValue = $result['avgSensorValue'];
        }
    
    }
    //minimum 15 samples needed to calculate STEL in last 15 minutes. 
    if ($numSamples < 15) {
        echo "No  samples less than 15 ....returning.****";
        return false;
    }
    if ($avgSensorValue <= $sensorConfigData[$sensorID]['stelInfo']['stelLimit']) {
        doUpdateAlert($sensorID, $alertID, $avgSensorValue, $currentDateTime, $collectedTime);
        return true;
    }
}


function getDifferenceString($date1, $date2) {
    $date1Obj = new DateTime($date1);
    $date2Obj = new DateTime($date2);

    $interval = $date1Obj->diff($date2Obj);
    // Convert the difference to minutes
    $diffString = (($interval->days * 24)  + $interval->h).":".str_pad($interval->i, 2, '0', STR_PAD_LEFT);
    return $diffString;
}

function doUpdateAlert($sensorID, $alertID, $lastSensorValue, $lastTime, $collectedTime) {
    global $dbTmsConn;

    $dateString = date('Y-m-d H:i:s');
    $diffString = getDifferenceString($collectedTime, $dateString);

    $statusMessage = ALERT_OTHER_CLOSING_TEXT.number_format($lastSensorValue, 2, '.', '');

    $sql = "UPDATE alertCrons SET status=1 , closedTime = '$dateString' , statusMessage = '$statusMessage', diffMinutes = '$diffString' where id = '$alertID' ";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    return;
}

function alertDataUpdate()
{
    global $sensorConfigData;
    global $deviceConfigData;
    global $sensorDynamicData;
    global $dbTmsConn;

    $alertTableInfo=[];
    $sql = "SELECT id, deviceID, sensorID, alertType, shiftID, value, collectedTime FROM `alertCrons` where status=0 and alarmType='UnLatch' ";
    $getResult = mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $alertTableInfo[] = $result;
    }

    foreach ($alertTableInfo as $alertInfo) {
        if ($alertInfo['alertType'] == DEVICEDISCONNECTED_ALERT) {
            tryCloseDeviceDisconnectAlert($alertInfo['deviceID'], $alertInfo['id'], $alertInfo['collectedTime']);
            continue;
        }
        if ($alertInfo['alertType'] == TWA_ALERT) {
            tryCloseTwaAlert($alertInfo['deviceID'], $alertInfo['sensorID'], $alertInfo['id'], $alertInfo['shiftID'], $alertInfo['collectedTime']);
            continue;
        }

        $sensorID = $alertInfo['sensorID'];
        if ($sensorConfigData[$sensorID]['sensorStatus'] == 0) {
            //sensor status check
            echo "<br/>Sensor Status = 0 for $sensorID";
            continue;
        }

        if ($sensorDynamicData[$sensorID]['lastSensorValue'] != null &&  $sensorDynamicData[$sensorID]['lastSensorValue'] != 0 ) {
            $sensorLastValue = $sensorDynamicData[$sensorID]['lastSensorValue'];
            $updateAlertFlag=false;
            if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == HIGH_ALERT_TYPE) {
                if ($sensorLastValue <= $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) {
                    $updateAlertFlag=true;
                }
            }
            else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == LOW_ALERT_TYPE) {
                if ($sensorLastValue >= $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) {
                    $updateAlertFlag=true;
                }
            }else if ($sensorConfigData[$sensorID]['warningAlertInfo']['wAT'] == BOTH_ALERT_TYPE) {
                if ( ($sensorLastValue <= $sensorConfigData[$sensorID]['warningAlertInfo']['wMax']) && ($sensorLastValue >= $sensorConfigData[$sensorID]['warningAlertInfo']['wMin']) ) {
                    $updateAlertFlag=true;
                }
            }

            if ($updateAlertFlag ==true) {
                if ($alertInfo['alertType'] == WARNING_ALERT) {
                    tryCloseWarningAlert($alertInfo['deviceID'], $alertInfo['sensorID'], $alertInfo['id'], $alertInfo['collectedTime']);
                }
                if ($alertInfo['alertType'] == OUTOFRANGE_ALERT) {
                    tryCloseOutOfRangeAlert($alertInfo['deviceID'], $alertInfo['sensorID'], $alertInfo['id'], $alertInfo['collectedTime']);
                }
                if ($alertInfo['alertType'] == CRITICAL_ALERT) {
                    tryCloseCriticalAlert($alertInfo['deviceID'], $alertInfo['sensorID'], $alertInfo['id'], $alertInfo['collectedTime']);
                }
            }

            if ($alertInfo['alertType'] == STEL_ALERT) {
                echo "<br/>trying to close stel alert";
                tryCloseStelAlert($alertInfo['deviceID'], $alertInfo['sensorID'], $alertInfo['id'], $alertInfo['collectedTime']);
            }
        }
        else {
            //No last sensor values //cannot decide to close.
        }
    }
}

function tryCloseTwaAlert($deviceID, $sensorID, $alertID, $shiftID, $collectedTime) 
{
    global $sensorConfigData;
    global $sensorDynamicData;
    global $debugFlag;
    global $dbTmsConn;

    $startShiftTime = $sensorConfigData[$sensorID]['twaInfo'][$shiftID]['twaStartTime'];
    $minutesToAdd = $sensorConfigData[$sensorID]['twaInfo'][$shiftID]['twaDuration'];

    $dateTimeNowObj = new DateTime();
    $twaStartDateTime = date('Y-m-d')." ".$startShiftTime;
    $twaStartDateTimeObj = new DateTime($twaStartDateTime);
    $twaEndDateTimeObj = new DateTime($twaStartDateTime);
    $minutesToAddString = "+".$minutesToAdd." minutes";
    $twaEndDateTimeObj->modify($minutesToAddString);
    $twaEndDateString = $twaEndDateTimeObj->format('Y-m-d H:i:s');

    echo "<br/>Sensor ID = $sensorID TWA Close time = $twaEndDateString";
    if ( ($dateTimeNowObj >= $twaEndDateTimeObj)  ) {
        //shift Over Reset Alert
        $statusMessage = ALERT_TWA_CLOSING_TEXT;
        $dateString = date('Y-m-d H:i:s');
        $diffString = getDifferenceString($collectedTime, $dateString);
    
        $sql = "UPDATE alertCrons SET status=1 , closedTime = '$twaEndDateString' , statusMessage = '$statusMessage', diffMinutes = '$diffString' where id = '$alertID' ";
        mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));
    }

}


function updateEmailSMSForEachZone() {
    global $dbConfigConn;

    $userList = [];
    $emailList = [];
    $smsList =[];

    $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, email  FROM `users` where emailNotification = 'INSTANT' or emailNotification = 'INSTANT_DAILY' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $userList[] = $result;
    }

    $zoneID='';

    $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID  FROM `zones` ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $zoneID = $result['id'];
        $emailList=[];
        foreach ( $userList as $user) {
            if ( $user['locationID'] == '' ){   
                $emailList[]=$user['email'];
                continue;
            }else if ($user['locationID'] == $result['locationID']) {
                if ( $user['branchID'] == '' ){   
                    $emailList[]=$user['email'];
                    continue;
                }
                else if ($user['branchID'] == $result['branchID']) {
                    if ( $user['facilityID'] == '' ){   
                        $emailList[]=$user['email'];
                        continue;
                    }
                    else if ($user['facilityID'] == $result['facilityID']) {
                        if ( $user['buildingID'] == '' ){   
                            $emailList[]=$user['email'];
                            continue;
                        }
                        else if ($user['buildingID'] == $result['buildingID']) {
                            if ( $user['floorID'] == '' ){   
                                $emailList[]=$user['email'];
                                continue;
                            }
                            else if ($user['floorID'] == $result['floorID']) {
                                if ( $user['zoneID'] == '' ){   
                                    $emailList[]=$user['email'];
                                    continue;
                                }
                                else if ($user['zoneID'] == $result['id']) {
                                    $emailList[]=$user['email'];
                                    continue;
                                }
                            }
                        }
                    }
                }
            }
        }

        $emailListString = implode(",", $emailList);
        $sql = "UPDATE `zones` SET emailInstant = '$emailListString' where id = '$zoneID' ";
        echo "<br/>Update SQL $sql";
        mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));

    }

    $userList=[];

    $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID, zoneID, mobileNumber  FROM `users` where smsNotification = 'INSTANT' ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $userList[] = $result;
    }

    $zoneID='';

    $sql = "SELECT id, locationID, branchID, facilityID, buildingID, floorID  FROM `zones` ";
    $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while ($result = mysqli_fetch_assoc($getResult))
    {
        $zoneID = $result['id'];
        $smsList=[];
        foreach ( $userList as $user) {
            if ( $user['locationID'] == '' ){   
                $smsList[]=$user['mobileNumber'];
                continue;
            }else if ($user['locationID'] == $result['locationID']) {
                if ( $user['branchID'] == '' ){   
                    $smsList[]=$user['mobileNumber'];
                    continue;
                }
                else if ($user['branchID'] == $result['branchID']) {
                    if ( $user['facilityID'] == '' ){   
                        $smsList[]=$user['mobileNumber'];
                        continue;
                    }
                    else if ($user['facilityID'] == $result['facilityID']) {
                        if ( $user['buildingID'] == '' ){   
                            $smsList[]=$user['mobileNumber'];
                            continue;
                        }
                        else if ($user['buildingID'] == $result['buildingID']) {
                            if ( $user['floorID'] == '' ){   
                                $smsList[]=$user['mobileNumber'];
                                continue;
                            }
                            else if ($user['floorID'] == $result['floorID']) {
                                if ( $user['zoneID'] == '' ){   
                                    $smsList[]=$user['mobileNumber'];
                                    continue;
                                }
                                else if ($user['zoneID'] == $result['id']) {
                                    $smsList[]=$user['mobileNumber'];
                                    continue;
                                }
                            }
                        }
                    }
                }
            }

        }
        $smsListString = implode(",", $smsList);
        $sql = "UPDATE `zones` SET smsInstant = '$smsListString' where id = '$zoneID' ";
        echo "<br/>Update SQL $sql";
        mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    }
}


function cleanOldRecords()
{
    global $dbTmsConn;

    $currentDateTime = new DateTime();
    $threeDaysBefore = $currentDateTime->sub(new DateInterval('P3D'));
    $formatedDate = $threeDaysBefore->format('Y-m-d H:i:s');
    $sql = "DELETE FROM sensorSegregatedValues where collectedTime < '$formatedDate' ";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

    $sql = "DELETE FROM twaInfo where calculatedDate < '$formatedDate' ";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

    $sql = "DELETE FROM aqiZoneInfo where collectedTime < '$formatedDate' ";
    mysqli_query($dbTmsConn,$sql) or die(mysqli_error($dbTmsConn));

}



?>