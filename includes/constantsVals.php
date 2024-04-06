<?php

const TABLE_NAME_ARRAY =  array('locations','branches', 'facilities', 'buildings','floors','zones' );

const SERVER_BASE_PATH= '/home/aisrv-kewaunee/htdocs/kewaunee.aisrv.in/aqmsv3/';

const DEVICE_FILE_NAME = SERVER_BASE_PATH.'configs/allDeviceInfo.txt' ;
const SENSOR_FILE_NAME = SERVER_BASE_PATH.'configs/allSensorInfo.txt' ;
const ID_NAMES_FILE_NAME = SERVER_BASE_PATH.'configs/allIDNamesInfo.txt' ;
const REPORTS_FILE_NAME = SERVER_BASE_PATH.'configs/reportsEmail.txt' ;
const BASE_FILE_PATH_REPORTS = SERVER_BASE_PATH.'reports/' ;


const MAIL_MAILER="smtp";
const MAIL_HOST="smtp.hostinger.com";
const MAIL_PORT=587;
const MAIL_USERNAME="anand@aisrv.in";
const MAIL_PASSWORD="Bgt56yhN@";
const MAIL_ENCRYPTION="TLS";
// const MAIL_FROM_ADDRESS="noreply@aidealabs.com";
const AQMS_FROM_EMAIL="anand@aisrv.in";
const AQMS_FROM_NAME="AI-deaLabs";

//const ALERT_TO_EMAIL = 'anandang@gmail.com,azzok17@gmail.com,anand@grinfotech.com';
const ALERT_TO_EMAIL = 'anandang@gmail.com,jananes@aidealabs.com,mageshwarig@aidealabs.com';
const REPORT_TO_EMAIL_TEST = 'anandang@gmail.com, madhankumar05072000@gmail.com, jananes@aidealabs.com, balakannangbk01@gmail.com, vaishutocontact@gmail.com';
const INSTANT_ALERT_TO_EMAIL = 'anandang@gmail.com';
const INSTANT_ALERT_BCC_EMAIL = 'jananes@aidealabs.com, vaishutocontact@gmail.com, anand@aisrv.in, balakannangbk01@gmail.com';


const SMS_API_URl = "http://site.ping4sms.com/api/smsapi";
const SMS_CONTENT = "AQMS - AI-DEA LABS Alert Received";
const SMS_INSTANT = "9003259719,9449026060,9940013472";

const ALERT_TWA_CLOSING_TEXT = 'Shift Over. Resetting';
const ALERT_OTHER_CLOSING_TEXT = 'Value back to Normal ';
const DEVICE_DISCONNECTED_CLOSING_TEXT = 'Device Sending Normal data';

const ONE_MINUTE = 1;
const FIVE_MINUTE = 5;
const TEN_MINUTE = 10;
const FIFTEEN_MINUTE = 15;
const THIRTY_MINUTE = 30;
const SIXTY_MINUTE = 60;
const ONE_HOUR = 60;
const ONE_DAY = 1440;

const MOVING_AVERAGE_FIFTEEN_MINUTE = 15;

const EIGHT_HOUR = 480;  //(8*60);
const TWELVE_HOUR = 720;  //(12*60);
const SIXTEEN_HOUR = 960;  //(16*60);
const TWENTY_FOUR_HOUR = 1440;  //(24*60);

const SENSOR_DECIMAL_PRECISION = 4;

const HIGH_ALERT_TYPE = 'High';
const LOW_ALERT_TYPE = 'Low';
const BOTH_ALERT_TYPE = 'Both';

const SENSOR_NORMAL='NORMAL';
const CRITICAL_ALERT='CRITICAL';
const STEL_ALERT='STEL';
const TWA_ALERT='TWA';
const WARNING_ALERT='WARNING';
const OUTOFRANGE_ALERT='OUT OF RANGE';
const DEVICEDISCONNECTED_ALERT='DEVICE DISCONNECTED';

const AQI_SAMPLING_COUNT=24;

CONST DEVICE_MODE_ENABLED = 'enabled';
CONST DEVICE_MODE_DISABLED = 'disabled';
CONST DEVICE_MODE_BUMPTEST = 'bumpTest';
const DEVICE_MODE_CALIBRATION = 'calibration';
CONST DEVICE_MODE_FIRMWARE_UPGRADATION = 'firmwareUpgradation';
CONST DEVICE_MODE_CONFIG = 'config';
CONST DEVICE_MODE_DEBUG = 'debug';
const DEVICE_MODE_EVENT_LOG = 'eventLog';
CONST DEVICE_MODE_SIMULATOR = 'simulator';

CONST DEVICE_STATUS_RUNNING = 0;
const DEVICE_STATUS_DISCONNECTED = 1;

const SENSOR_TYPE_ANALOG = 'Analog';
const SENSOR_TYPE_MODBUS = 'Modbus';
const SENSOR_TYPE_INBUILT = 'Inbuilt';
const SENSOR_TYPE_DIGITAL = 'Digital';

const REPORT_DATE_FORMAT = 'd-m-Y';
const REPORT_DATE_TIME_FORMAT = 'd-m-Y H:i:s';

const AQI_REPORT_NAME = "AIR QUALITY INDEX (AQI) TEST REPORT";
const ALARMS_REPORT_NAME = "ALARMS REPORT";
const SENSOR_STATUS_REPORT_NAME = "SENSOR STATUS REPORT";
const SERVER_UTILIZATION_REPORT_NAME = "Server Utilization Report";
const FIRMWARE_VERSION_REPORT_NAME = "Firmware Version Report";
const APPLICATION_VERSION_REPORT_NAME= "Application Version Report";
const USER_LOG_REPORT_NAME = "User Log Report";
const CALIBRATION_REPORT_NAME = "Calibration Report";
const BUMP_TEST_REPORT_NAME = "Bump Test Report";
const LIMIT_EDIT_LOG_REPORT_NAME = "Limit Edit Log Report";
const EVENT_LOG_REPORT_NAME = "Event Log Report Name";

const SENSOR_REPORT = "SENSOR_REPORT";
const AQI_REPORT = "AQI_REPORT";
const ALARM_REPORT = "ALARM_REPORT";
const SERVER_REPORT = "SERVER_REPORT";
const USER_REPORT = "USER_REPORT";
const CALIBRATION_REPORT = "CALIBRATION_REPORT";
const BUMP_TEST_REPORT = "BUMP_TEST_REPORT";
const FIRMWARE_REPORT = "FIRMWARE_REPORT";
const APPLICATION_VERSION_REPORT = "APPLICATION_VERSION_REPORT";
const LIMIT_EDIT_LOG_REPORT = "LIMIT_EDIT_LOG_REPORT";


const ALARM_DAILY_REPORT = "ALARM_DAILY_REPORT";


const REPORT_ALTERNATIVE_ROW_COLOR_ONE = "#ffffff";  //white
const REPORT_ALTERNATIVE_ROW_COLOR_TWO = "#f2f2f2";  // light shade
//const REPORT_HEADER_COLOR = "#A0A0A0"; //grey
const REPORT_HEADER_COLOR = "#2A52BE"; //blue
const REPORT_HEADER_FONT_COLOR = "#ffffff"; //white
const REPORT_FONT_COLOR = "#000000" ;//black
const REPORT_FONT_NAME = "times";  
const REPORT_FONT_SIZE = "12";

const WARNING_COLOR = "#db8404";
const CRITICAL_COLOR = "#cc1616";
const OUTOFRANGE_COLOR = "#a821bf";
const NORMAL_COLOR = "#1b5e20";
const VALUE_RUN_COLOR = "#000000" //black


?>