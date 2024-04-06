<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

class ConfigDeviceController extends Controller
{
    protected $configTableDevicesConnection;
    protected $configTableSensorConnection;
    protected $tmsTableDeviceEventLogData;

    public function __construct()
    {
        $this->configTableDevicesConnection = DB::connection('mysqlConfig')->table('devices');
        $this->configTableSensorConnection = DB::connection('mysqlConfig')->table('sensors');
        $this->tmsTableDeviceEventLogData = DB::connection('mysqlTms')->table('deviceEventLogData');
    }

    public function getFunctionCode($registerType)
    {
        $return = "NA";
        switch ($registerType) {
            case 'Input Coil':
                $return = 1;
                break;
            case 'Discreate Input':
                $return = 2;
                break;
            case 'Holding Register':
                $return = 3;
                break;
            case 'Input Register':
                $return = 4;
                break;
            default:
                $return = "NA";
                break;
        }

        return $return;
    }

    public function getLength($bitLength)
    {
        $return = "NA";

        switch ($bitLength) {
            case '32 Bit':
                $return = 2;
                break;

            case '16 Bit':
                $return = 1;
        }

        return $return;
    }

    public function getConfigDevice(Request $request)
    {
        if($request->isMethod('POST')){
            if($request->MAC){
                $config = $request->CONFIG;
                $macAddress = $request->MAC;

                $device = $this->configTableDevicesConnection->where('macAddress', $macAddress)->first();

                if($device){
                    $deviceID = $device->id;
                    $deviceName = $device->deviceName;
                    $ssid = "NA";
                    $pass = "NA";
                    $pollingPriority = $device->pollingPriority;
                    $nonPollingPriority = $device->nonPollingPriority;
                    $apn = "NA";
                    $mobileNumber = "NA";
                    $simPin = "NA";

                    if($device->connectionInfo){
                        $device->connectionInfo = json_decode($device->connectionInfo);

                        if(isset($device->connectionInfo->wifiInfo)){
                            $ssid = $device->connectionInfo->wifiInfo->ssid;
                            $pass = $device->connectionInfo->wifiInfo->ssidPassword;
                        }

                        if(isset($device->connectionInfo->gsmInfo)){
                            $apn = $device->connectionInfo->gsmInfo->apn;
                            $mobileNumber = $device->connectionInfo->gsmInfo->mobileNumber;
                            $simPin = $device->connectionInfo->gsmInfo->pin;
                        }
                    }

                    switch ($config) {
                        case 'CONFIG_DATA':
                            return $deviceID . "," . $deviceName . "," . $ssid . "," . $pass . "," . $pollingPriority . "," . $nonPollingPriority;
                            break;

                        case 'COMM':
                            return $apn . "," . $mobileNumber . "," . $simPin;
                            break;

                        default:
                            return "NA";
                            break;
                    }
                } else {
                    return "INVALID_DEVICEID";
                }
            } else if($request->ID){
                $config = $request->CONFIG;
                $deviceID = $request->ID;
                $slotID = 'A'.$request->CH;
                $status = $request->STATUS;

                $query = $this->configTableDevicesConnection->where('id', $deviceID);
                $device = $query->first();

                if($config == "MODE"){
                    $deviceNumber = $this->getModeNumber($device->deviceMode);
                    return "AT-MODE=$deviceNumber";
                } else if($config == "FW_Upgrade"){
                    try {
                        $data = [
                            "deviceMode" => "enabled",
                            "modifiedStatus" => $request->STATUS
                        ];

                        if($request->STATUS == "SUCCESS"){
                            $data["firmwareVersion"] = $request->FW_VER;
                        }

                        $this->configTableDevicesConnection->where('id', $deviceID)->update($data);

                        return "SUCCESS";
                    } catch (\Throwable $th) {
                        return $th->getMessage();
                    }
                } else if($config == "FW_VER"){
                    return $device->firmwareVersion;
                } else if($config == 8){
                    if($status == 0){
                        try {
                            $this->configTableDevicesConnection->where('id', $deviceID)->update([
                                "deviceMode" => "enabled"
                            ]);
                            $this->tmsTableDeviceEventLogData->where("deviceID", $deviceID)->update([
                                "status" => "completed",
                            ]);

                            return "SUCCESS";
                        } catch (\Throwable $th) {
                            return $th->getMessage();
                        }
                    } else {
                        $fileName = time() . "_" . $deviceID;
                        $filePath = env('APP_URL') . "/deviceEventLog/log/" . $fileName;
                        $this->tmsTableDeviceEventLogData->insert([
                            "deviceID" => $deviceID,
                            // "logPath" => env('DEVICE_EVENT_LOG_FOLDER') . "/$fileName.txt"
                            "logPath" => env('SERVER_URL') . "/deviceEventLog/$fileName.log"
                        ]);
                        return $filePath;
                    }
                } else {
                    if($device){
                        $sensor = $this->configTableSensorConnection->where('deviceID', $deviceID);

                        switch ($config) {
                            case 'URL':
                                return $device->dataPushUrl; // For sending data from device to server
                                break;

                            case 'OTA':
                                return $device->binFileName; // For reading bin files
                                break;

                            case 'ADC':
                                $currentSensor = $sensor
                                    ->where('slotID', '=', $slotID)
                                    ->where('sensorOutput', '=', 'Analog')
                                    // ->select('id', 'sensorStatus', 'pollingIntervalType')
                                    ->first();
                                return $currentSensor ? $currentSensor->id.",".$currentSensor->sensorStatus.",".$currentSensor->pollingIntervalType : "NA";
                                break;

                            case 'DIGITAL':
                                $currentSensor = $sensor
                                    ->where('slotID', '=', $slotID)
                                    ->where('sensorOutput', '=', 'Digital')
                                    // ->select('id', 'sensorStatus', 'pollingIntervalType')
                                    ->first();
                                return $currentSensor ? $currentSensor->id.",".$currentSensor->sensorStatus.",".$currentSensor->pollingIntervalType : "NA";
                                break;

                            case 'METER':
                                $sensor = $sensor->where('sensorOutput', 'Modbus')->get();
                                return "MODBUS=".$sensor->count();
                                break;

                            case 'MODBUS':
                                $currentSensor = $sensor
                                    ->where('slotID', '=', $slotID)
                                    ->where('sensorOutput', '=', 'Modbus')
                                    // ->select('id', 'sensorStatus', 'pollingIntervalType')
                                    ->first();

                                $modBusInfo = isset($currentSensor->modBusInfo) ? json_decode($currentSensor->modBusInfo) : "";
                                return $currentSensor ? $currentSensor->id.",".$modBusInfo->slaveID.",".$this->getFunctionCode($modBusInfo->registerType).",".$modBusInfo->register.",".$this->getLength($modBusInfo->bitLength).",".$currentSensor->sensorStatus.",".$currentSensor->pollingIntervalType : "NA";
                                break;

                            case 'INBUILT':
                                $currentSensor = $sensor
                                    ->where('slotID', '=', $slotID)
                                    ->where('sensorOutput', '=', 'Inbuilt')
                                    // ->select('id', 'sensorStatus', 'pollingIntervalType')
                                    ->first();

                                $return = "NA";
                                if($currentSensor){
                                    $warningAlertInfo =json_decode($currentSensor->warningAlertInfo);
                                    $wAT = $warningAlertInfo->wAT;
                                    $wMin = "NA";
                                    $wMax = "NA";

                                    if($wAT == "High"){
                                        $wMax = $warningAlertInfo->wMax;
                                    } else if($wAT == "Low"){
                                        $wMin = $warningAlertInfo->wMin;
                                    } else {
                                        $wMax = $warningAlertInfo->wMax;
                                        $wMin = $warningAlertInfo->wMin;
                                    }

                                    $criticalAlertInfo =json_decode($currentSensor->criticalAlertInfo);
                                    $cAT = $criticalAlertInfo->cAT;
                                    $cMin = "NA";
                                    $cMax = "NA";

                                    if($cAT == "High"){
                                        $cMax = $criticalAlertInfo->cMax;
                                    } else if($cAT == "Low"){
                                        $cMin = $criticalAlertInfo->cMin;
                                    } else {
                                        $cMax = $criticalAlertInfo->cMax;
                                        $cMin = $criticalAlertInfo->cMin;
                                    }

                                    $outOfRangeAlertInfo =json_decode($currentSensor->outOfRangeAlertInfo);
                                    $oAT = $outOfRangeAlertInfo->oAT;
                                    $oMin = "NA";
                                    $oMax = "NA";

                                    if($oAT == "High"){
                                        $oMax = $outOfRangeAlertInfo->oMax;
                                    } else if($oAT == "Low"){
                                        $oMin = $outOfRangeAlertInfo->oMin;
                                    } else {
                                        $oMax = $outOfRangeAlertInfo->oMax;
                                        $oMin = $outOfRangeAlertInfo->oMin;
                                    }

                                    $alarmType = $currentSensor->alarmType == "Latch" ? 1 : 0;
                                    $isTwa = $currentSensor->isTwa;
                                    $isStel = $currentSensor->isStel;

                                    $return = $currentSensor->id.",".$currentSensor->sensorStatus.",".$currentSensor->pollingIntervalType.",".$wMin.",".$wMax.",".$cMin.",".$cMax.",".$oMin.",".$oMax.",".$alarmType.",".$isTwa;

                                    if($isStel){
                                        $stelInfo = json_decode($currentSensor->stelInfo);

                                        $return = $return.",".$stelInfo->stelLimit;

                                        $twaInfo = json_decode($currentSensor->twaInfo);


                                        if(isset($twaInfo->shift1)){
                                            $return = $return.",".$twaInfo->shift1->twaLimit.",".$twaInfo->shift1->twaStartTime;
                                        } else {
                                            $return = $return.",NA,NA";
                                        }

                                        if(isset($twaInfo->shift2)){
                                            $return = $return.",".$twaInfo->shift2->twaLimit.",".$twaInfo->shift2->twaStartTime;
                                        } else {
                                            $return = $return.",NA,NA";
                                        }

                                        if(isset($twaInfo->shift3)){
                                            $return = $return.",".$twaInfo->shift3->twaLimit.",".$twaInfo->shift3->twaStartTime;
                                        } else {
                                            $return = $return.",NA,NA";
                                        }
                                    } else {
                                        $return = $return.",NA,NA,NA,NA,NA,NA,NA";
                                    }
                                }

                                return $return;
                                break;

                            case 'ENABLE':
                                $enableDevice = $query->update([
                                    "deviceMode" => "enabled"
                                ]);
                                return "SUCCESS";
                                break;

                            case 'MODE':
                                return "AT-MODE=".$this->getModeNumber($device->deviceMode);
                                break;

                            default:
                                return "NA";
                                break;
                        }
                    } else {
                        return "INVALID_DEVICEID";
                    }
                }
            } else {
                return "INVALID_JSON";
            }
        }  else {
            return "Request method not allowed";
        }
    }

    public function createEventLog(Request $request, $fileName)
    {
        if($request->isMethod('POST')){
            try {
                $deviceID = explode("_", $fileName)[1];
                $device = $this->configTableDevicesConnection->where('id', $deviceID)->first();
                $deviceMode = $this->getModeNumber($device->deviceMode);

                if($this->getModeNumber($device->deviceMode) == 8){
                    $filePath = env('DEVICE_EVENT_LOG_FOLDER') . "/" . $fileName . ".log";
                    $data = $request->getContent();

                    if(file_exists($filePath)){
                        file_put_contents($filePath, "\n$data", FILE_APPEND);
                    } else {
                        $file = fopen($filePath, 'w');
                        fwrite($file, $data);
                        fclose($file);
                    }
                    return "SUCCESS";
                } else {
                    return "INVALID_MODE";
                }
            } catch (\Throwable $th) {
                return $th->getMessage();
            }
        } else {
            return "Request method not allowed";
        }
    }
}
