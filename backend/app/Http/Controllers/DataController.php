<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\UTILITY\DataUtilityController;

use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use DateTime;
use DateInterval;
use JWTAuth;

class DataController extends Controller
{
    protected $jwtToken;
    protected $table = "";
    protected $currentUser;

    function __construct(Request $request) {
        $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $getData = new UtilityController($request);
        $this->currentUser = DB::table('users')->where('id', $this->jwtToken['id'])->first();
    }


    public function getInfo(Request $request)
    {
        try {
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlConfig')->enableQueryLog();};

            $response['data']=$this->getAllInfo();

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);

            if($this->debugFlag){  $response['query'] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }


    public function getAlerts(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); };

            $response['alertData']  = DB::connection('mysqlTms')
            ->table('alertCrons')
            ->select('*')
            ->where('status', '=', '0')
            ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }


    public function dashboard(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); \DB::connection('mysqlConfig')->enableQueryLog();};

            $user = $this->currentUser;
            $query = DB::connection('mysqlTms')
                ->table('alertCrons')
                ->select('id', 'locationID' , 'branchID' ,'facilityID' ,'buildingID' ,'floorID' ,'zoneID' , 'deviceID', 'deviceName', 'sensorID', 'sensorTag', 'alertType', 'value', 'collectedTime', 'status', 'notificationShow', 'alarmType', 'msg' )
                ->orderBy('id', 'DESC')
                ->where('status', '=', '0');

            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            if(!empty($userLocationFilters)){
                $query = $query->where($userLocationFilters);
            }

            $response['alertData']  = $query->get();

            $response['aqiData']  = DB::connection('mysqlConfig')
                ->table('zones')
                ->select('id as zoneID', 'aqiValue' )
                ->where('isAQI', '=', '1')
                ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $response['query'][] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }


    public function getDeviceDetails(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); \DB::connection('mysqlConfig')->enableQueryLog();};

            if ($request->zoneID == '') {
                $return = new Response([ "data" => [], "status" => "error", "message" => "No zoneID provided"] );
                $return->setStatusCode(500);
                return $return;
            }

            $zoneID = $request->zoneID;

            $response['data']  = DB::connection('mysqlConfig')
                ->table('zones')
                ->select('id', 'isAQI', 'aqiValue'  )
                ->where('id', '=', $zoneID)
                ->get();

            $response['device']  = DB::connection('mysqlConfig')
                ->table('devices')
                ->select('id', 'disconnectionStatus' )
                ->where('zoneID', '=', $zoneID)
                ->get();

            $response['alerts']  = DB::connection('mysqlTms')
                ->table('alertCrons')
                ->select('deviceID', DB::raw('count(*) as alarmCount') )
                ->where('zoneID', '=', $zoneID)
                ->where('status', '=', '0')
                ->groupBy('deviceID')
                ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $response['query'][] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function getSensorDetails(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); \DB::connection('mysqlConfig')->enableQueryLog();};

            if ($request->deviceID == '') {
                $return = new Response([ "data" => [], "status" => "error", "message" => "No deviceID provided"] );
                $return->setStatusCode(500);
                return $return;
            }

            $deviceID = $request->deviceID;

            $transaction  = DB::connection('mysqlConfig')
                ->table('transactions')
                ->select('*' )
                ->where('deviceID', '=', $deviceID)
                ->orderBy('id', 'desc')
                ->get();
       
            $response['data'] = $transaction;

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $response['query'][] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function getDeviceTableName($deviceID,$intervalMinute) {
        $tblIndex1 = $deviceID % 10;  // will send to database 0-9 based on device id
        $tblIndex2 = $intervalMinute; // based on minutes data will insert into that table
        return 'deviceSensorData_'.$tblIndex1.'_'.$tblIndex2;
    }

    public function getDateLessMinutes($minutes){
        // Get the current time
        $currentDateTime = new \DateTime();
        //if $minutes not given or 0 or > 1440 it will return current time with seconds roundoff.
        if ($minutes > 0 && $minutes <= 1440 ) {
            $minLessString = 'PT'.$minutes.'M';
            // Subtract $minutes
            $currentDateTime->sub(new \DateInterval($minLessString));
        }
        // Round to the nearest minute
        $currentDateTime->setTime($currentDateTime->format('H'), $currentDateTime->format('i'), 0);
        return $currentDateTime->format('Y-m-d H:i:s');
    }


    public function getSensorGraphDetails(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); \DB::connection('mysqlConfig')->enableQueryLog();};

            if ($request->deviceID == ''  && $request->sensorID == '' && $request->lastTime && $request->interval ) {
                $return = new Response([ "data" => [], "status" => "error", "message" => "Sensor ID, lastTime, interval Needed"] );
                $return->setStatusCode(500);
                return $return;
            }
            $deviceID = $request->deviceID;
            $sensorID = $request->sensorID;
            $interval = $request->interval;
            $lastTime = $request->lastTime;

            $deviceTableName =$this->getDeviceTableName($deviceID, $interval);

            // $lessDateTime =$this->getDateLessMinutes($lastTime);

            $query = DB::connection('mysqlTms')
                ->table($deviceTableName)
                ->select('id', 'minScaledVal', 'maxScaledVal', 'avgScaledVal', 'collectedTime', 'info')
                ->where('sensorID', '=', $sensorID)
                ->orderBy('id');

            if(str_contains($lastTime, "|")){
                $time = explode("|", $lastTime);
                $startTime = $time[0];
                $endTime = $time[1];
                $query = $query->where('collectedTime', '>=', $startTime)->where('collectedTime', '<=', $endTime);
            } else {
                $query = $query->where('collectedTime', '>=', $lastTime);
            }

            $response['data']  = $query->get();

            $response['limits']  = DB::connection('mysqlConfig')
                ->table('sensors')
                ->select('warningAlertInfo', 'criticalAlertInfo')
                ->where('id', '=', $sensorID)
                ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $response['query'][] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function alertCurrentStatus(Request $request)
    {
        try {
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog();};

            if ($request->alertID == '' ) {
                $return = new Response([ "data" => [],"status" => "error", "message" => "Alert ID should not be blank." ]);
                $return->setStatusCode(500);
                return $return;
            }
            $alertID = $request->alertID;

            $alertArray  = DB::connection('mysqlTms')
                ->table('alertCrons')
                ->select('id', 'sensorID', 'deviceID', 'alertType', 'shiftID')
                ->where('id', '=', $alertID)
                ->first();

            $sensorID = $alertArray->sensorID;

            $response['sensorLatestValue'] = DB::connection('mysqlTms')
            ->table('sensorSegregatedValues')
            ->select('id', 'scaledValue', 'info', 'collectedTime' )
            ->where('sensorID', '=', $sensorID)
            ->OrderBy('id', 'DESC')
            ->first();

            $infoString = $response['sensorLatestValue']->info;
            if($infoString == 'NORMAL'){
                //alert can be cleared now // because value is normal again.
                $response['clearValue'] = "TRUE";
            }
            else {
                $response['clearValue'] = "FALSE";
            }

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);

            if($this->debugFlag){  $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function getDifferenceString($date1, $date2) {
        $date1Obj = new DateTime($date1);
        $date2Obj = new DateTime($date2);

        $interval = $date1Obj->diff($date2Obj);
        // Convert the difference to minutes
        $diffString = (($interval->days * 24)  + $interval->h).":".str_pad($interval->i, 2, '0', STR_PAD_LEFT);
        return $diffString;
    }


    public function alertUserClear(Request $request)
    {
        try {
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog();};

            if ($request->alertID == '' || $request->clearMessage == '') {
                $return = new Response([ "data" => [],"status" => "error", "message" => "Alert ID / clearMessage should not be blank." ]);
                $return->setStatusCode(500);
                return $return;
            }
            $alertID = $request->alertID;
            $clearMessage = $request->clearMessage;
            $userEmail = $request->userEmail;

            $alertArray  = DB::connection('mysqlTms')
                ->table('alertCrons')
                ->select('id', 'collectedTime')
                ->where('id', '=', $alertID)
                ->first();

            $collectedTime = $alertArray->collectedTime;

            $currentDateTime = new \DateTime();
            $closedTime =  $currentDateTime->format('Y-m-d H:i:s');
            $diffInfo = $this->getDifferenceString($collectedTime, $closedTime);
            //echo "ClosedTime = $closedTime Collected = $collectedTime Duration = $diffInfo";

            $response['updateInfo']  = DB::connection('mysqlTms')
                ->table('alertCrons')
                ->where('id', '=', $alertID)
                ->update([
                    'closedTime' => $closedTime,
                    'diffMinutes' => $diffInfo,
                    'statusMessage' => $clearMessage,
                    'alarmClearedUser' => $userEmail,
                    'status' => '1'
                ]);

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);

            if($this->debugFlag){  $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function getAqiGraphDetails(Request $request)
    {
        try {
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog();};

            $zoneID = $request->zoneID;
            $time = $request->time;

            $aqiData = DB::connection('mysqlTms')->table('aqiZoneInfo')
                        ->where('zoneID', $zoneID)
                        ->where('collectedTime', '>=', $time)
                        // ->where('collectedTime', '<=', $toDate)
                        ->get();

            $data = [];

            foreach ($aqiData as $item) {
                $aqiInfo = json_decode($item->aqiInfo);
                foreach ($aqiInfo as $key => $value) {
                    if($key != 'info'){
                        if($value->sensorID != 0){
                            $subIndexH = 0;

                            if(isset($value->subIndexH)){
                                $subIndexH = $value->subIndexH;
                            }
                            $current['subIndex'] = $subIndexH;
                            $current['collectedTime'] = $item->collectedTime;
                            $data[$key][] = $current;
                        }
                    }
                }
            }

            $response['data'] = $data;
            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);

            if($this->debugFlag){  $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $return = $response;
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

}


?>
