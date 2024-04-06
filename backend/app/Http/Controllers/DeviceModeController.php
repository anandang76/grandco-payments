<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use DateTime;
use DateTimeZone;

class DeviceModeController extends Controller
{
    protected $tmsTableDeviceIncomingDataConnection;
    protected $tmsTableDeviceDebugDataModeConnection;
    protected $tmsTableDeviceIncomingDataBumpTestConnection;
    protected $configTableDevicesConnection;
    protected $configTableSensorsConnection;

    public function __construct()
    {
        $this->tmsTableDeviceIncomingDataConnection = DB::connection('mysqlTms')->table('deviceIncomingData');
        $this->tmsTableDeviceDebugDataModeConnection = DB::connection('mysqlTms')->table('deviceDebugDataMode');
        $this->tmsTableDeviceIncomingDataBumpTestConnection = DB::connection('mysqlTms')->table('deviceIncomingDataBumpTest');
        $this->configTableDevicesConnection = DB::connection('mysqlConfig')->table('devices');
        $this->configTableSensorsConnection = DB::connection('mysqlConfig')->table('sensors');
    }

    public function validateDate($dateString, $format = 'Y-m-d')
    {
      $dateTime = new DateTime($dateString, new DateTimeZone('UTC'));
      return $dateTime->format($format) === $dateString;
    }

    public function getDeviceMode($deviceID)
    {
        $return = "NO_DEVICE";
        $company = $this->configTableDevicesConnection->where("id", $deviceID)->first();

        if($company){
            $return = $company->deviceMode;
        }

        return $return;
    }

    public function setSensorStatus($data)
    {
        $sensors = $this->configTableSensorsConnection->where('deviceID', $data->DEVICE_ID)->get();

        if($sensors){
            foreach ($sensors as $sensor) {
                $sensorStatus = $data[$sensor->id] == "NA" ? 0 : 1;
                $update = DB::connection('mysqlConfig')->table('sensors')->where('id', $sensor->id)->update([
                    "sensorStatus" => $sensorStatus
                ]);
            }
        }
    }

    public function devicePushData(Request $request)
    {
        if($request->isMethod('post')){
            try {
                $return = "SUCCESS";
                $deviceMode = $this->getDeviceMode($request->DEVICE_ID);

                if($deviceMode != "NO_DEVICE"){
                    $deviceModeNumber = $this->getModeNumber($deviceMode);

                    if($deviceModeNumber == $request->MODE){
                        switch ($deviceModeNumber) {
                            case 2: // enable mode
                                $date = $request->DATE;
                                $time = $request->TIME;

                                $isValid = $this->validateDate($date);

                                if($isValid){
                                    $this->setSensorStatus($request);
                                    $this->tmsTableDeviceIncomingDataConnection->insert([
                                        "data" => json_encode($request->post())
                                    ]);
                                }
                                break;

                            case 5: // debug mode
                                $this->tmsTableDeviceDebugDataModeConnection->insert([
                                    "deviceID" => $request->DEVICE_ID,
                                    "data" => json_encode($request->post())
                                ]);
                                break;

                            case 6; // bump test mode
                                $this->tmsTableDeviceIncomingDataBumpTestConnection->insert([
                                    "data" => json_encode($request->post())
                                ]);
                                break;

                            default:
                                # code...
                                break;
                        }
                    } else {
                        $return = "AT-MODE=$deviceModeNumber";
                    }
                } else {
                    $return = $deviceMode;
                }

                return $return;
            } catch (\Throwable $th) {
                return $th->getMessage();
            }
        } else {
            $result = "Request method not allowed";
        }

        return $result;
    }
}
