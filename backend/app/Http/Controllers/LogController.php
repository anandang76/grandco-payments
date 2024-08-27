<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use DB;

class LogController extends Controller
{
    protected $configTableSensorConnection;
    protected $reportTableLimitEditLogReportConnection;
    protected $reportTableEventLogReportConnection;

    public function __construct()
    {
        $this->configTableSensorConnection = DB::connection('mysqlConfig')->table('sensors');
        $this->reportTableLimitEditLogReportConnection = DB::connection('mysqlReport')->table('limitEditLogReport');
        $this->reportTableEventLogReportConnection = DB::connection('mysqlReport')->table('eventLogReport');
    }

    public function addLimitEditLog($userEmail, $device, $id, $new)
    {
        $old = $this->configTableSensorConnection->find($id);

        $oldCriticalAlertInfo = json_decode($old->criticalAlertInfo);
        $newCriticalAlertInfo = json_decode($new['criticalAlertInfo']);
        $oldWarningAlertInfo = json_decode($old->warningAlertInfo);
        $newWarningAlertInfo = json_decode($new['warningAlertInfo']);
        $oldOutOfRangeAlertInfo = json_decode($old->outOfRangeAlertInfo);
        $newOutOfRangeAlertInfo = json_decode($new['outOfRangeAlertInfo']);

        $auditLog = false;
        $limigLog = [];

        if($oldCriticalAlertInfo->cMax != $newCriticalAlertInfo->cMax){
            $auditLog = true;
            $limigLog['criticalMax'] = [
                "old" => $oldCriticalAlertInfo->cMax,
                "new" => $newCriticalAlertInfo->cMax,
            ];
        }

        if($oldCriticalAlertInfo->cMin != $newCriticalAlertInfo->cMin){
            $auditLog = true;
            $limigLog['criticalMin'] = [
                "old" => $oldCriticalAlertInfo->cMin,
                "new" => $newCriticalAlertInfo->cMin,
            ];
        }

        if($oldWarningAlertInfo->wMax != $newWarningAlertInfo->wMax){
            $auditLog = true;
            $limigLog['warningMax'] = [
                "old" => $oldWarningAlertInfo->wMax,
                "new" => $newWarningAlertInfo->wMax,
            ];
        }

        if($oldWarningAlertInfo->wMin != $newWarningAlertInfo->wMin){
            $auditLog = true;
            $limigLog['warningMin'] = [
                "old" => $oldWarningAlertInfo->wMin,
                "new" => $newWarningAlertInfo->wMin,
            ];
        }

        if($oldOutOfRangeAlertInfo->oMax != $newOutOfRangeAlertInfo->oMax){
            $auditLog = true;
            $limigLog['outOfRangeMax'] = [
                "old" => $oldOutOfRangeAlertInfo->oMax,
                "new" => $newOutOfRangeAlertInfo->oMax,
            ];
        }

        if($oldOutOfRangeAlertInfo->oMin != $newOutOfRangeAlertInfo->oMin){
            $auditLog = true;
            $limigLog['outOfRangeMin'] = [
                "old" => $oldOutOfRangeAlertInfo->oMin,
                "new" => $newOutOfRangeAlertInfo->oMin,
            ];
        }

        if($auditLog){
            $this->reportTableLimitEditLogReportConnection->insert([
                // "oldCriticalAlertInfo" => $oldCriticalAlertInfo,
                // "newCriticalAlertInfo" => $newCriticalAlertInfo,
                // "oldWarningAlertInfo" => $oldWarningAlertInfo,
                // "newWarningAlertInfo" => $newWarningAlertInfo,
                // "oldOutOfRangeAlertInfo" => $oldOutOfRangeAlertInfo,
                // "newOutOfRangeAlertInfo" => $newOutOfRangeAlertInfo,
                // "auditLog" => $auditLog,
                "locationID" => $old->locationID,
                "branchID" => $old->branchID,
                "facilityID" => $old->facilityID,
                "buildingID" => $old->buildingID,
                "floorID" => $old->floorID,
                "zoneID" => $old->zoneID,
                "deviceID" => $old->deviceID,
                "sensorID" => $old->id,
                "userEmail" => $userEmail,
                "limits" => json_encode($limigLog),
            ]);
        }
    }

    public function addEventLog($data)
    {
        $this->reportTableEventLogReportConnection->insert($data);
    }
}
