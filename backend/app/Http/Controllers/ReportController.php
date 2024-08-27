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

class ReportController extends Controller
{
    protected $table = "";
    protected $currentUser;
    protected $jwtToken;
    protected $calibrationReportTable;
    protected $bumpTestReportTable;
    protected $limitEditLogReportTable;
    protected $eventLogReportTable;

    function __construct(Request $request) {
        $getData = new UtilityController($request);
        $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $this->currentUser = DB::table('users')->where('id', $this->jwtToken['id'])->first();
        $this->calibrationReportTable = DB::connection('mysqlReport')->table('calibrationReport');
        $this->bumpTestReportTable = DB::connection('mysqlReport')->table('bumpTestReport');
        $this->limitEditLogReportTable = DB::connection('mysqlReport')->table('limitEditLogReport');
        $this->eventLogReportTable = DB::connection('mysqlReport')->table('eventLogReport');
    }

    public function sensorReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $deviceID = $request->deviceID;

            $query =  DB::connection('mysqlReport')
                ->table('sensorReportData')
                ->select('*')
                ->where('collectedTime', '>=', $fromDate)
                ->where('collectedTime', '<=', $toDate)
                ->orderBy('id', 'DESC');

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($deviceID != 'all'){
                $query = $query->where('deviceID', '=', $deviceID);
            }

            $response['data'] = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function aqiReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $zoneID = $request->zoneID;

            $response['data']  = DB::connection('mysqlReport')
            ->table('aqiZoneSummary')
            ->select('*')
            ->where('zoneID', '=', $zoneID)
            ->where('collectedTime', '>=', $fromDate)
            ->where('collectedTime', '<=', $toDate)
            ->orderBy('id', 'DESC')
            ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    //taking from TMS table as we need to take all not closed alarm also on the report.
    public function alarmReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $deviceID = $request->deviceID;

            $query = DB::connection('mysqlTms')
                        ->table('alertCrons')
                        ->select('*')
                        ->where('collectedTime', '>=', $fromDate)
                        ->where('collectedTime', '<=', $toDate)
                        ->orderBy('id', 'DESC');

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if ($deviceID != 'all' && $deviceID != '') {
                $query = $query->where('deviceID', '=', $deviceID);
            }

            $response['data'] = $query->get();

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

    public function serverUtilizationReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";

            $response['data']  = DB::connection('mysqlReport')
            ->table('serverUsageStatitics')
            ->select('*')
            ->where('collectedTime', '>=', $fromDate)
            ->where('collectedTime', '<=', $toDate)
            ->orderBy('id', 'DESC')
            ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function applicationVersionReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlAqms')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";

            $response['data']  = DB::connection('mysqlAqms')
            ->table('applicationVersions')
            ->select('*')
            ->orderBy('id', 'DESC')
            ->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlAqms')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function firmwareVersionReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlConfig')->enableQueryLog(); };

            $response['data']='';
            $deviceID = '';
            $deviceID = $request->deviceID;

            $query = DB::connection('mysqlConfig')
                        ->table('devices')
                        ->select('id', 'modifiedAt', 'locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID',  'deviceName', 'hardwareModelVersion', 'firmwareVersion', 'modifiedBy', 'modifiedStatus')
                        ->orderBy('modifiedAt', 'DESC');

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($request->deviceID != 'all'){
                $query = $query->where('id', '=', $deviceID);
            }

            $response['data'] = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function getBumpTestReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $deviceID = $request->deviceID;
            $sensorID = $request->sensorID;

            $query = DB::connection('mysqlReport')
                        ->table('bumpTestReport')
                        ->select('*')
                        ->orderBy('id', 'DESC')
                        ->where('collectedTime', '>=', $fromDate)
                        ->where('collectedTime', '<=', $toDate);

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($deviceID != 'all'){
                $query = $query->where('deviceID', '=', $deviceID);
            }

            $response['data']  = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function addBumpTestReport(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $create = $this->bumpTestReportTable->insert($data);

                if($create){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Bump Test Report added successfully"
                    ]);
                    $result->setStatusCode(200);
                }
            }  catch (\Throwable $th) {
                $result = new Response([
                    "status" => "error",
                    "message" => $th->getMessage()
                ]);
                $result->setStatusCode(500);
            }
        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function getCalibrationReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $deviceID = $request->deviceID;
            $sensorID = $request->sensorID;

            $query = DB::connection('mysqlReport')
                        ->table('calibrationReport')
                        ->select('*')
                        ->orderBy('id', 'DESC')
                        ->where('collectedDate', '>=', $fromDate)
                        ->where('collectedDate', '<=', $toDate);

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($deviceID != 'all'){
                $query = $query->where('deviceID', '=', $deviceID);
            }

            $response['data'] = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function addCalibrationReport(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $create = $this->calibrationReportTable->insert($data);

                if($create){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Calibration Report added successfully"
                    ]);
                    $result->setStatusCode(200);
                }
            }  catch (\Throwable $th) {
                $result = new Response([
                    "status" => "error",
                    "message" => $th->getMessage()
                ]);
                $result->setStatusCode(500);
            }
        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function userLogReport(Request $request)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $userID = $request->userID;

            $query = DB::connection('mysqlReport')
                ->table('userLogsReport')
                ->select('id', 'createdAt', 'userEmail', 'action')
                ->orderBy('id', 'DESC')
                ->where('createdAt', '>=', $fromDate)
                ->where('createdAt', '<=', $toDate);

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($userID != 'all'){
                $query = $query->where('userID', '=', $userID);
            }

            $response['data']  = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function limitEditLogsReport(Request $request, $id)
    {
        try{
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $deviceID = $request->deviceID;
            $sensorID = $request->sensorID;

            $query = $this->limitEditLogReportTable->orderBy('id', 'DESC')->where('collectedDate', '>=', $fromDate)->where('collectedDate', '<=', $toDate);

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            if($id != 'all'){
                $query = $query->where('deviceID', '=', $id);
            }

            $response['data'] = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

    public function eventLogReport(Request $request)
    {
        try {
            if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlReport')->enableQueryLog(); };

            $fromDate = $request->fromDate." 00:00:00";
            $toDate = $request->toDate." 23:59:59";
            $eventName = $request->eventName;
            $validLocationFilters = ['Email Config', 'User', 'Change Password'];

            $query = $this->eventLogReportTable
                        ->orderBy('id', 'DESC')
                        ->where('collectedDate', '>=', $fromDate)
                        ->where('collectedDate', '<=', $toDate);

            if($eventName != 'all'){
                $query = $query->where('eventName', '=', $eventName);
            }

            $user = $this->currentUser;
            $userLocationFilters = array_filter([
                'locationID' => $user->locationID,
                'branchID' => $user->branchID,
                'facilityID' => $user->facilityID,
                'buildingID' => $user->buildingID,
                'floorID' => $user->floorID,
                'zoneID' => $user->zoneID,
            ]);

            $requestLocationFilters = array_filter([
                'locationID' => $request->locationID,
                'branchID' => $request->branchID,
                'facilityID' => $request->facilityID,
                'buildingID' => $request->buildingID,
                'floorID' => $request->floorID,
                'zoneID' => $request->zoneID
            ]);

            $filters = array_merge($userLocationFilters, $requestLocationFilters);

            if(!empty($filters)){
                $query = $query->where($filters);
            }

            $response['data'] = $query->get();

            if($this->debugFlag){ $response['query'] = DB::connection('mysqlReport')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };

            $response['status'] = "success";
            $return = new Response($response);
            $return->setStatusCode(200);
        } catch (\Throwable $th) {
            $return = new Response([ "data" => [],"status" => "error", "message" => $th->getMessage(). "in line no [".$th->getLine()."]" ]);
            $return->setStatusCode(500);
        }

        return $return;
    }

}


?>
