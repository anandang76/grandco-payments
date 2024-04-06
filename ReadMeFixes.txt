TODO
1.  Implement Redis Cache
2.  SMS FooSMS needs replacement or same but currently not sending.  Ping4SMS repacement.
3.  Lab ID to Zone id in all places in backend / frontend.(frontend already there)
4.  Avg Max/Min need to be added on graph.
5.  Move Alert data to separate tables. 
6.  Implement RabbitMQ
7.  Implement SSL on server.  Upload old DB code to server. 
8.  After new company signup - Script to run create new 3 DB - copy code backend - URL - set.  if company kw -> url  -- send by login URL -> 
9.  Dashboard show for all users . -- Need to change based on ROLE.  

10.  Remove dispStatus, dispAqiValue, dispCategory from all tables Loc...zone
11.  Update parent field in all table loc..zone
12. 



ALTER TABLE `devices` CHANGE `disconnectedStatus` `notificationShow` INT(11) NULL DEFAULT NULL;
ALTER TABLE `zones` CHANGE `isAqiEligible` `isAQI` TINYINT(1) NULL DEFAULT NULL, CHANGE `dispAqiValue` `aqiValue` DECIMAL(11,3) NULL DEFAULT NULL;
ALTER TABLE `alertCrons` ADD `notificationShow` INT(11) NULL AFTER `status`;



//old
ALTER TABLE `zones` CHANGE `isAQI` `isAqiEligible` TINYINT(1) NULL DEFAULT NULL, CHANGE `aqiValue` `dispAqiValue` DECIMAL(11,3) NULL DEFAULT NULL;

28-Dec-2023
deviceDetails() backend api call for device detail page on click of zones added.
sensorDetails() backend api call for detail page added
frontend dashboard fixes done and updated.
work started for displaying devices.
Location change filter on alert display completed
If image image show instead of maps updated




1. Breadcumb missing.
2.  Sensor Details not showing with min,max, graph.  Not able to view. only 2 boxes showing on sensor page.
3. Total device showing 1, but not showing any devices. 
4. units not shown as per image.
5. top color not updated as per image. 





27-Dec-2023
1.  Priority  - stel display issue on front box. 
2.  display location id /..../ in notification box.   
3.  Refresh screen every 1 minute. 
4.  dynamic logo/name/  
5.  getDashboardInfo()
6.  Dynamic update of the boxes. 
7.  No two calls to server.  On login only one call. 
8.  small UI updates.  -- all box should be same size as of aqi category.  aqi category looks good.  others are stretched.  and height less.
//8.  Remove serachsimulator() search() all old functions on the datacontroller.php?  why it came again?
//9.  remove get_alerts => getAlerts
10. Location change filter on alert display.
11.  If image image show.
12.  UI Compile issues fixed.
13.  Uploaded to https://aqms.aisrv.in  -> u: aqmx@aidealabs.com  p: 123456





1.  Box 1,2,3 jump fix -> should stick at the end.
//next changes - 11. set val = front end / reset val = front End

5.  nxt pages.   thanks.



1.  Favicon - ai
2.  AQMS Login
2.  storage/ 


Ashok
1.  camelCase
2.  EMR removal
3.  patient code removal (create patient url)
4. 


[updated below on settings]
max_allowed_packet=5M
lower_case_table_names=2


//create view check.
create view movingAverage15 as (select sensorID,  count(*) as numSamples, MAX(scaledValue) as maxSensorValue, MIN(scaledValue) as minSensorValue, AVG(scaledValue) as avgSensorValue from sensorSegregatedValues where collectedTime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) group by sensorID);

//create view check.
create view movingAverage15 as (select sensorID,  count(*) as numSamples, MAX(scaledValue) as maxSensorValue, MIN(scaledValue) as minSensorValue, AVG(scaledValue) as avgSensorValue from sensorSegregatedValues where collectedTime >= DATE_SUB(NOW(), INTERVAL -315 MINUTE) group by sensorID);

select DATE_SUB(NOW(), INTERVAL -315 MINUTE) as test, deviceID, sensorID, count(*) as numSamples, MAX(scaledValue) as maxSensorValue, MIN(scaledValue) as minSensorValue, AVG(scaledValue) as avgSensorValue from sensorSegregatedValues where collectedTime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) group by deviceID, sensorID;



1.  Critical
2.  Stel
3.  TWA
4.  Warning
5.  OutofRange
6.  DeviceDisconnected 



//TEXT field first time more values issue.
Length =2307855
Fatal error: Uncaught mysqli_sql_exception: MySQL server has gone away in C:\xampp\htdocs\aqmsv2\AQMS_DATA_EXTRACTION_CRON\infoArray.php:139 



22-Dec-2023
1.  Alerts coding for Critical, Warning, outofRange completed.
2.  Creted a db JSON array object for complete store of configuratable data for instant load.
3.  Created frontend login/2fa/ authentiation routes and updated new UI theme. 
4.  Updated realtime approx value in configuration tables for easier access through simulators. 


22-Dec-2023 Clarifications
q1.  For pm2.5, pm10, so2, no2, nh3 - 16 hr average, co,o3 - 8hrs max - for PB is ist max 8hrs (or) average of 16?
Other queries clarified on call.  Digital type needs more checking on backend process.

update `sensors` set defaultValue='12' where sensorNameUnit='Temperature';
update `sensors` set defaultValue='12' where sensorNameUnit='Humidity';
update `sensors` set defaultValue='2.96' where sensorNameUnit='PM2.5';
update `sensors` set defaultValue='4.8' where sensorNameUnit='PM10';
update `sensors` set defaultValue='4' where sensorNameUnit='NO2';
update `sensors` set defaultValue='3.592' where sensorNameUnit='Flammable Gas';
update `sensors` set defaultValue='3.0665' where sensorNameUnit='SO2';
update `sensors` set defaultValue='8.222' where sensorNameUnit='Noise Meter';
update `sensors` set defaultValue='60' where sensorNameUnit='PM2.5-IAQ';
update `sensors` set defaultValue='175' where sensorNameUnit='PM10-IAQ';
update `sensors` set defaultValue='260' where sensorNameUnit='Temperature-IAQ';
update `sensors` set defaultValue='50' where sensorNameUnit='Humidity-IAQ';
update `sensors` set defaultValue='900' where sensorNameUnit='TVOC-IAQ';
update `sensors` set defaultValue='2500' where sensorNameUnit='CO2-IAQ';
update `sensors` set defaultValue='3.85' where sensorNameUnit='NO2 I';



21-Dec-2023
1.  Started UI with Vistro Theme React Theme
2.  Added Critial, Warning, OutofRange Alerts to the cron job. 
3.  Clarification done for few questions on doc. 

Clarification:
While processing I found if I have below priority I am not getting outofrange alert at all. 
1.  Critical
2.  Stel
3.  TWA
4.  Warning
5.  OutofRange
6.  DeviceDisconnected 
So if the value is 1100 which is outofRange but critical takes priority and when checking val > 500 itself it goes to critical.   So for same deviceid, sensorid it wont be good to add more alerts at the same time. 
Anyhow if warning comes around 11:15 (150) and then increases to critical (300) we are started having both inside the alertCron tables.  But if suddenly it shoot up to 300 without slowly progressing we will show only the critical. 
Also in this case outofrange is not coming.  So I need to set high priority for outofrange as its more in the upper range. 
Please let me know. 


FFor eg:
'47' => ['Tag'=>'SO2-IAQI', 'minR'=> '4', 'maxR'=>'20', 'minRS'=> '0', 'maxRS'=>'15', 'cAT'=> 'High', 'cMin'=> '0', 'cMax'=> '4', 'cLTxt'=> '', 'cHTxt'=> 'SO2 Critical High Alarm', 'wAT'=> 'High', 'wMin'=> '0', 'wMax'=> '2', 'wLTxt'=> '', 'wHTxt'=> 'SO2 Warning High Alarm', 'oAT'=> 'High', 'oMin'=> '-1', 'oMax'=> '16', 'oLTxt'=> '', 'oHTxt'=> 'SO2 Out Of Range High Alarm' ],


20-Dec-2023
1.  Clarification and understanding of alerts, STEL, TWA calc
2.  Update to AQI Index calculation single formula.  (Need to update current calc)
3.  UI theme new rewrite decision by friday based on tormorrows implemetation.
4.  All previous day clarifications clarified. 


1.  Critical
2.  Stel
3.  TWA
4.  Warning
5.  OutofRange
6.  DeviceDisconnected 


17-Dec-2023


17-Dec-2023 Clarifications
q1. if 2 SO2 or 2 CO2 or 3 PM2.5 what to do on that zone.  Take average of all 2/3 like that?
q2. I hope AQI Calculation is at Zone Level?  Is it applicable for device level also?  If so I see a report device selected for AQI Reports. Need more clarifictation on the same.   Doing at zone level will be better always. 
q3. Zone Level AQI Calculation is it ok if its 5 mins or do we need every 1 minutes AQI Updates. ?
q4. pb values missing in excel on aqi calculation - do we need pb?  Currently 7 sensor contributes to AQI?


16-Dec-2023
1.  Taken today's data backup from kewaunee server and updated to new server. 
2.  Copy over database and deleted few data to make it little compact. 
3.  Change over code update to server both backend / front end. 
4.  Testing on new server.
5.  Complete update on RDI Simuator and running with 2 cron jobs. 
6.  Out of 15 cron jobs, 1 - little update done and put on server, 2 crons rewrite code completed and test in progress.


16-Dec-2023 Clarifications
q1. Minutes from current time to device mode changed Time :28378425.5<br> only if > 1 min push data
q2. Zone level only AQI - device level AQI if 3 sensors 
q3. if zone no 3 sensors - no calc
q4. what if if we have 2 PM2.5 sensors in same zone level with different device ids.  
q5. same function scalingvalue / alertmessage in all files in AQMS data extraction. Need to remove those. 
q6.  disk usage $disk_usage ="27%";? in server_usage file Need to check more.



15-Dec-2023
1.  Cron job data segregation and insert from aqmi
2.  Complete update on the simulator program
3.  New hosting update backend (screenshot attached) - Most of the backend calls working on new server without any issues.
4.  Front end move to new hosting server.  - 30% pending - only 70% completed images / calling URL's not working. https://aqiv1.aisrv.in/ 
5.  Https certificate installation in new host. 
6.  Pointed domain aisrv.in to the new hosting purchased yesterday. 
7.  aggDeviceData() New function added. 



14-Dec-2023
1.  Updated config
2.  Removed Simulator 3,4,5,6 files.
3.  Removed all hardcoded URL in ONE,TWO simulators.
4.  DB Split 50% completed.
5.  Working with Simulator dropdown faster queries.
6.  VPS Cloud setup done.  Need to move our code base / db to the new hosting.
7.  Pointed a blank website aisrv.in to the new hosting. 


SELECT deviceID, sensorID, sensorTag, min(sensorValue), max(sensorValue), AVG(sensorValue) FROM `sensorsegregatedvalues` WHERE collectedTime >= DATE_SUB(NOW(), INTERVAL 15 MINUTE) group by deviceID, sensorID, sensorTag;


SELECT deviceID, sensorID, sensorTag, sensorValue, scaledValue FROM `sensorsegregatedvalues` WHERE collectedTime >= DATE_SUB(NOW(), INTERVAL 5 MINUTE);


13-Dec-2023
1. RDL Simulator 1 & 2 got updated with generic links.
2. DB Split into 2 DB.
2a.  aqmsv2 - Generic database which will have company and users - Can be used for SAAS model also.  Inside the company table, we will have company ID as dynamic 2CHARACTER parameters.  For eg: AI for Idealabs and KW for Kewaunee like that.
All the databases will be created dynamically based on the company ID suffixed with them.  for Eg: aqmsConfig will have aqmsConfitAI for Aidealabs company and aqmsConfigKW for Kewaunee company.
2b.  aqmsConfig<suffix> db for all config values - 10 config tables like location, branch.... etc., optimized and created without data.
2c.  aqmsTms<suffix>  - This will be our transaction Management System database which will have different dynamic tables for the devices and all the transaction values.
2d.  aqmsReport<suffix> - This will have all the reports except the 15 / 1 hr report will be moved over here for easier queries and have huge size information.  This db later can be split for storing old report values like more than 6 months, 1 year, 2 years like that and it can go with different years also.

3. All tables were recreated on 2a, 2b.  25% completed.
4. Will have the remaining DB/Tables created for tomorrow.
5.  Small POC was done to check whether we can dynamically connect to different DB's and query the data with faster speeds and the results were good enough on connecting to different 3-4 databases also dynamically.
6.  Each DB new connections first time its taking 20+ milliseconds only so even with 3 DB multiple connection and basic queries I am able to get in few milliseconds  outputs.



Controller Files
UtilityController - ok - Need to move alertColors to alertcontroller
DeviceDataController - ok


11-Dec-2023
1. SqlLogger files added to git.
2. FooSMS check on DataSegregatedAlertCreationNew.php cron
3. Front End component added for dropdown (50% complete) Need more testing with data.
4. Logger added for few components. 
5. Overall understanding of data calc done. 
6. getAlerts Backend Component overview completed.


//Debug Logger 
if ($this->debugFlag) { \DB::enableQueryLog(); $funcStartTime = microtime(true); }

if ($this->debugFlag) { $response['query'] = \DB::getQueryLog(); $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)] ; $response['time'] = $functionTimer; }             




10-Dec-2023
10. All application link $applicationLink files moved to config.php (approx 6 instances)
11. Trigger Email $api link moved to config.php
12. Moved all wisething.in URL to process.env file (around 20+ instances) except Simuator

1.  DB Rows Removed.
2.  Failed prop type: The prop `anchorOrigin.horizontal` - On page load frontend
3.  Calling alertData 3 times in dashboard load 
4.  Calling /search API cal 4 times in front end
5.  Removed Laravel Log files which is around 140MB
6.  Git Updated
7.  Updated URL's Removed few ai.wisething.in in env files.
8.  SANCTUM_STATEFUL_DOMAINS - Not used. Need to check currently commented. //Readded Need check
9.  CSRF Token Issue Fixed




