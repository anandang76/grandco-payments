<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
use DateTime;
use DateInterval;
use JWTAuth;
use App\Http\Controllers\LogController;

class DeviceConfigController extends Controller
{
    protected $jwtToken;
    protected $logController;
    protected $configTableLocationConnection;
    protected $configTableBranchConnection;
    protected $configTableFacilityConnection;
    protected $configTableBuildingConnection;
    protected $configTableFloorConnection;
    protected $configTableZoneConnection;
    protected $configTableCategoriesConnection;
    protected $configTableDevicesConnection;
    protected $configTableSensorConnection;
    protected $tmsTableAlertCronsConnection;
    protected $reportsTableBumpTestInfoConnection;
    protected $reportsTableBumpTestDeviceIncomingDataConnection;
    protected $reportsTableBumpTestSensorSegregatedValuesConnection;
    protected $tmsTableDeviceDebugDataModeConnection;
    protected $tmsTableDeviceEventLogData;
    protected $configTableUserConnection;

    const SENSOR_DECIMAL_PRECISION = 4;
    const SENSOR_TYPE_ANALOG = 'Analog';
    const SENSOR_TYPE_MODBUS = 'Modbus';
    const SENSOR_TYPE_INBUILT = 'Inbuilt';
    const SENSOR_TYPE_DIGITAL = 'Digital';

    public function __construct(LogController $logController)
    {
        $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $this->logController = $logController;
        $this->configTableLocationConnection = DB::connection('mysqlConfig')->table('locations');
        $this->configTableBranchConnection = DB::connection('mysqlConfig')->table('branches');
        $this->configTableFacilityConnection = DB::connection('mysqlConfig')->table('facilities');
        $this->configTableBuildingConnection = DB::connection('mysqlConfig')->table('buildings');
        $this->configTableFloorConnection = DB::connection('mysqlConfig')->table('floors');
        $this->configTableZoneConnection = DB::connection('mysqlConfig')->table('zones');
        $this->configTableCategoriesConnection = DB::connection('mysqlConfig')->table('categories');
        $this->configTableDevicesConnection = DB::connection('mysqlConfig')->table('devices');
        $this->configTableSensorConnection = DB::connection('mysqlConfig')->table('sensors');
        $this->tmsTableAlertCronsConnection = DB::connection('mysqlTms')->table('alertCrons');
        $this->reportsTableBumpTestInfoConnection = DB::connection('mysqlReport')->table('bumpTestInfo');
        $this->reportsTableBumpTestDeviceIncomingDataConnection = DB::connection('mysqlReport')->table('bumpTestDeviceIncomingData');
        $this->reportsTableBumpTestSensorSegregatedValuesConnection = DB::connection('mysqlReport')->table('bumpTestSensorSegregatedValues');
        $this->tmsTableDeviceDebugDataModeConnection = DB::connection('mysqlTms')->table('deviceDebugDataMode');
        $this->tmsTableDeviceEventLogData = DB::connection('mysqlTms')->table('deviceEventLogData');
        $this->configTableUserConnection = DB::connection('mysqlConfig')->table('users');
    }

    public function getLocation($locationID="", $branchID="", $facilityID="", $buildingID="", $floorID="", $zoneID="", $deviceID="")
    {
        $data = [];

        if($locationID != ""){
            $data[] = $this->configTableLocationConnection->where('id', $locationID)->first();
        }

        if($branchID != ""){
            $data[] = $this->configTableBranchConnection->where('id', $branchID)->first();
        }

        if($facilityID != ""){
            $data[] = $this->configTableFacilityConnection->where('id', $facilityID)->first();
        }

        if($buildingID != ""){
            $data[] = $this->configTableBuildingConnection->where('id', $buildingID)->first();
        }

        if($floorID != ""){
            $data[] = $this->configTableFloorConnection->where('id', $floorID)->first();
        }

        if($zoneID != ""){
            $data[] = $this->configTableZoneConnection->where('id', $zoneID)->first();
        }

        if($deviceID != ""){
            $data[] = $this->configTableDevicesConnection->where('id', $deviceID)->first();
        }

        return $data;

    }

    public function getZone($zoneID)
    {
        return $this->configTableZoneConnection->where('id', $zoneID)->first();
    }

    public function getDevice($deviceID)
    {
        return $this->configTableDevicesConnection->where('id', $deviceID)->first();
    }

    public function getLocationDetails(Request $request)
    {
        if($request->isMethod('POST')){
            $data = $this->getLocation($request->locationID, $request->branchID, $request->facilityID, $request->buildingID, $request->floorID, $request->zoneID, $request->deviceID);

            $result = new Response([
                "status" => "success",
                "data" => $data
            ]);
            $result->setStatusCode(200);
        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // Location
    public function getConfigLocation(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableLocationConnection->get();
                } else {
                    $data = $this->configTableLocationConnection->where("id", $id)->first();
                }

                $result = new Response([
                    "status" => "success",
                    "data" => $data
                ]);
                $result->setStatusCode(200);

            } catch (\Throwable $th) {
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

    public function addConfigLocation(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationName" => $request->locationName,
                        "coordinates" => $request->coordinates
                    ];

                    if($request->hasFile('locationImage')){
                        $file = $request->file('locationImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('location'), $fileName);

                        $data['image'] = 'location/'.$fileName;
                    }

                    $create = $this->configTableLocationConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Location added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigLocation(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationName" => $request->locationName
                    ];

                    if($request->coordinates){
                        $data['coordinates'] = $request->coordinates;
                    }

                    if($request->hasFile('locationImage')){
                        $file = $request->file('locationImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('location'), $fileName);

                        $data['image'] = 'location/'.$fileName;
                    }

                    $row = $this->configTableLocationConnection->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($request->post() as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // if($update){
                        // Event log for edit location
                        if(count($updatedFields) > 0){
                            $this->logController->addEventLog([
                                "locationID" => $id,
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Location Details",
                                "eventDetails" => "Location Name: $old->locationName".json_encode($updatedFields)
                            ]);
                        }

                        $result = new Response([
                            "status" => "success",
                            "message" => "Location updated successfully"
                        ]);
                        $result->setStatusCode(200);
                    // }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function deleteConfigLocation(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteLocation = $this->configTableLocationConnection->where("id", $id)->delete();
                $deleteBranch = $this->configTableBranchConnection->where("locationID", $id)->delete();
                $deleteFacility = $this->configTableFacilityConnection->where("locationID", $id)->delete();
                $deleteBuilding = $this->configTableBuildingConnection->where("locationID", $id)->delete();
                $deleteFloor = $this->configTableFloorConnection->where("locationID", $id)->delete();
                $deleteZone = $this->configTableZoneConnection->where("locationID", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("locationID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("locationID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("locationID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("locationID", $id)->update([
                    "locationID" => Null,
                    "branchID" => Null,
                    "facilityID" => Null,
                    "buildingID" => Null,
                    "floorID" => Null,
                    "zoneID" => Null
                ]);

                // if($deleteLocation && $deleteBranch && $deleteFacility && $deleteBuilding && $deleteFloor && $deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Location deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Branch
    public function getConfigBranch(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableBranchConnection->where('locationID', $request->locationID);
                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID);
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);

                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigBranch(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "branchName" => "required",
                "locationID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationID" => $request->locationID,
                        "branchName" => $request->branchName,
                        "coordinates" => $request->coordinates
                    ];

                    if($request->hasFile('branchImage')){
                        $file = $request->file('branchImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('branch'), $fileName);

                        $data['image'] = 'branch/'.$fileName;
                    }

                    $create = $this->configTableBranchConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Branch added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigBranch(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "branchName" => "required",
                "locationID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "branchName" => $request->branchName
                    ];

                    if($request->coordinates){
                        $data['coordinates'] = $request->coordinates;
                    }

                    if($request->hasFile('branchImage')){
                        $file = $request->file('branchImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('branch'), $fileName);

                        $data['image'] = 'branch/'.$fileName;
                    }

                    $row = $this->configTableBranchConnection->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($request->post() as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // if($update){
                        // Event log for edit branches
                        if(count($updatedFields) > 0){
                            $this->logController->addEventLog([
                                "locationID" => $old->locationID,
                                "branchID" => $id,
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Branch Details",
                                "eventDetails" => "Branch Name: $old->branchName".json_encode($updatedFields)
                            ]);
                        }

                        $result = new Response([
                            "status" => "success",
                            "message" => "Branch updated successfully"
                        ]);
                        $result->setStatusCode(200);
                    // }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function deleteConfigBranch(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteBranch = $this->configTableBranchConnection->where("id", $id)->delete();
                $deleteFacility = $this->configTableFacilityConnection->where("branchID", $id)->delete();
                $deleteBuilding = $this->configTableBuildingConnection->where("branchID", $id)->delete();
                $deleteFloor = $this->configTableFloorConnection->where("branchID", $id)->delete();
                $deleteZone = $this->configTableZoneConnection->where("branchID", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("branchID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("branchID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("branchID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("branchID", $id)->update([
                    "branchID" => Null,
                    "facilityID" => Null,
                    "buildingID" => Null,
                    "floorID" => Null,
                    "zoneID" => Null
                ]);

                // if($deleteBranch && $deleteFacility && $deleteBuilding && $deleteFloor && $deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Branch deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Facility
    public function getConfigFacility(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableFacilityConnection->where('locationID', $request->locationID)->where('branchID', $request->branchID);

                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID);
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigFacility(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "facilityName" => "required",
                "locationID" => "required",
                "branchID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityName" => $request->facilityName,
                        "coordinates" => $request->coordinates
                    ];

                    if($request->hasFile('facilityImage')){
                        $file = $request->file('facilityImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('facility'), $fileName);

                        $data['image'] = 'facility/'.$fileName;
                    }

                    $create = $this->configTableFacilityConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Facility added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigFacility(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "facilityName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "facilityName" => $request->facilityName
                    ];

                    if($request->coordinates){
                        $data['coordinates'] = $request->coordinates;
                    }

                    if($request->hasFile('facilityImage')){
                        $file = $request->file('facilityImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('facility'), $fileName);

                        $data['image'] = 'facility/'.$fileName;
                    }

                    $row = $this->configTableFacilityConnection->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($request->post() as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // Event log for edit facility
                    if(count($updatedFields) > 0){
                        $this->logController->addEventLog([
                            "locationID" => $old->locationID,
                            "branchID" => $old->branchID,
                            "facilityID" => $id,
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "Facility Details",
                            "eventDetails" => "Facility Name: $old->facilityName".json_encode($updatedFields)
                        ]);
                    }

                    $result = new Response([
                        "status" => "success",
                        "message" => "Facility updated successfully"
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function deleteConfigFacility(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteFacility = $this->configTableFacilityConnection->where("id", $id)->delete();
                $deleteBuilding = $this->configTableBuildingConnection->where("facilityID", $id)->delete();
                $deleteFloor = $this->configTableFloorConnection->where("facilityID", $id)->delete();
                $deleteZone = $this->configTableZoneConnection->where("facilityID", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("facilityID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("facilityID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("facilityID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("facilityID", $id)->update([
                    "facilityID" => Null,
                    "buildingID" => Null,
                    "floorID" => Null,
                    "zoneID" => Null
                ]);

                // if($deleteFacility && $deleteBuilding && $deleteFloor && $deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Facility deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Building
    public function getConfigBuilding(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableBuildingConnection->where('locationID', $request->locationID)->where('branchID', $request->branchID)->where('facilityID', $request->facilityID);

                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID, $request->facilityID);
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigBuilding(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "buildingName" => "required",
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityID" => $request->facilityID,
                        "buildingName" => $request->buildingName,
                        "coordinates" => $request->coordinates
                    ];

                    if($request->hasFile('buildingImage')){
                        $file = $request->file('buildingImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('building'), $fileName);

                        $data['image'] = 'building/'.$fileName;
                    }

                    $create = $this->configTableBuildingConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Building added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }

                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigBuilding(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "buildingName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "buildingName" => $request->buildingName
                    ];

                    if($request->coordinates){
                        $data['coordinates'] = $request->coordinates;
                    }

                    if($request->hasFile('buildingImage')){
                        $file = $request->file('buildingImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('building'), $fileName);

                        $data['image'] = 'building/'.$fileName;
                    }

                    $row = $this->configTableBuildingConnection->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($request->post() as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // Event log for edit building
                    if(count($updatedFields) > 0){
                        $this->logController->addEventLog([
                            "locationID" => $old->locationID,
                            "branchID" => $old->branchID,
                            "facilityID" => $old->facilityID,
                            "buildingID" => $id,
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "Building Details",
                            "eventDetails" => "Building Name: $old->buildingName".json_encode($updatedFields)
                        ]);
                    }

                    $result = new Response([
                        "status" => "success",
                        "message" => "Building updated successfully"
                    ]);
                    $result->setStatusCode(200);

                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function deleteConfigBuilding(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteBuilding = $this->configTableBuildingConnection->where("id", $id)->delete();
                $deleteFloor = $this->configTableFloorConnection->where("buildingID", $id)->delete();
                $deleteZone = $this->configTableZoneConnection->where("buildingID", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("buildingID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("buildingID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("buildingID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("buildingID", $id)->update([
                    "buildingID" => Null,
                    "floorID" => Null,
                    "zoneID" => Null
                ]);

                // if($deleteBuilding && $deleteFloor && $deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Building deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Floor
    public function getConfigFloor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableFloorConnection->where('locationID', $request->locationID)->where('branchID', $request->branchID)->where('facilityID', $request->facilityID)->where('buildingID', $request->buildingID);

                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID, $request->facilityID, $request->buildingID);
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigFloor(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "floorName" => "required",
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityID" => $request->facilityID,
                        "buildingID" => $request->buildingID,
                        "floorName" => $request->floorName,
                        "coordinates" => $request->floorNumber,
                    ];

                    if($request->hasFile('floorImage')){
                        $file = $request->file('floorImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('floor'), $fileName);

                        $data['image'] = 'floor/'.$fileName;
                    }

                    $create = $this->configTableFloorConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Floor added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigFloor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "floorName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                $data = [
                    "floorName" => $request->floorName
                ];

                if($request->coordinates){
                    $data['coordinates'] = $request->coordinates;
                }

                if($request->hasFile('floorImage')){
                    $file = $request->file('floorImage');
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $file->move(public_path('floor'), $fileName);

                    $data['image'] = 'floor/'.$fileName;
                }

                $row = $this->configTableFloorConnection->where("id", $id);

                $old = $row->first();

                $updatedFields = [];

                // Checking for changed fields
                foreach ($request->post() as $field => $newValue) {
                    if (isset($old->$field) && $old->$field != $newValue) {
                        // pushing the changed fields in updatedFields[]
                        $updatedFields[$field] = [
                            'old_value' => $old->$field,
                            'new_value' => $newValue,
                        ];
                    }
                }

                $update = $row->update($data);

                // Event log for edit building
                if(count($updatedFields) > 0){
                    $this->logController->addEventLog([
                        "locationID" => $old->locationID,
                        "branchID" => $old->branchID,
                        "facilityID" => $old->facilityID,
                        "buildingID" => $old->buildingID,
                        "floorID" => $id,
                        "userEmail" => $this->jwtToken['email'],
                        "eventName" => "Floor Details",
                        "eventDetails" => "Floor Name: $old->floorName".json_encode($updatedFields)
                    ]);
                }

                $result = new Response([
                    "status" => "success",
                    "message" => "Floor updated successfully"
                ]);
                $result->setStatusCode(200);
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

    public function deleteConfigFloor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteFloor = $this->configTableFloorConnection->where("id", $id)->delete();
                $deleteZone = $this->configTableZoneConnection->where("floorID", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("floorID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("floorID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("floorID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("floorID", $id)->update([
                    "floorID" => Null,
                    "zoneID" => Null
                ]);

                // if($deleteFloor && $deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Floor deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Zone
    public function getAllZone(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $this->configTableZoneConnection->get();

                $result = new Response([
                    "status" => "success",
                    "data" => $data
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    public function getConfigZone(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableZoneConnection->where('locationID', $request->locationID)->where('branchID', $request->branchID)->where('facilityID', $request->facilityID)->where('buildingID', $request->buildingID)->where('floorID', $request->floorID);

                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID, $request->facilityID, $request->buildingID, $request->floorID);
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigZone(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "zoneName" => "required",
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityID" => $request->facilityID,
                        "buildingID" => $request->buildingID,
                        "floorID" => $request->floorID,
                        "zoneName" => $request->zoneName,
                        "isAQI" => $request->isAQI,
                    ];

                    if($request->hasFile('zoneImage')){
                        $file = $request->file('zoneImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('zone'), $fileName);

                        $data['image'] = 'zone/'.$fileName;
                    }

                    $create = $this->configTableZoneConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Zone added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigZone(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "zoneName" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $data = [
                        "zoneName" => $request->zoneName,
                        "isAQI" => $request->isAQI
                    ];

                    if($request->hasFile('zoneImage')){
                        $file = $request->file('zoneImage');
                        $fileName = time() . '_' . $file->getClientOriginalName();
                        $file->move(public_path('zone'), $fileName);

                        $data['image'] = 'zone/'.$fileName;
                    }

                    $row = $this->configTableZoneConnection->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($data as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // Event log for edit building
                    if(count($updatedFields) > 0){
                        $this->logController->addEventLog([
                            "locationID" => $old->locationID,
                            "branchID" => $old->branchID,
                            "facilityID" => $old->facilityID,
                            "buildingID" => $old->buildingID,
                            "floorID" => $old->floorID,
                            "zoneID" => $id,
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "Zone Details",
                            "eventDetails" => "Zone Name: $old->zoneName".json_encode($updatedFields)
                        ]);
                    }

                    $result = new Response([
                        "status" => "success",
                        "message" => "Zone updated successfully"
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function deleteConfigZone(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteZone = $this->configTableZoneConnection->where("id", $id)->delete();
                $deleteDevice = $this->configTableDevicesConnection->where("zoneID", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("zoneID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("zoneID", $id)->delete();
                $userLocationUpdate = $this->configTableUserConnection->where("zoneID", $id)->update([
                    "zoneID" => Null
                ]);

                // if($deleteZone && $deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Zone deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    // Devices
    public function getAllDevice(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $this->configTableDevicesConnection
                        ->select('id', 'deviceName', 'deviceTag', 'zoneID', 'deviceCategory', 'deviceMode')->get();

                $result = new Response([
                    "status" => "success",
                    "data" => $data
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    public function getConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required",
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableDevicesConnection->where('locationID', $request->locationID)->where('branchID', $request->branchID)->where('facilityID', $request->facilityID)->where('buildingID', $request->buildingID)->where('floorID', $request->floorID)->where('zoneID', $request->zoneID);

                    if($id == "all"){
                        $data['data'] = $query->get();
                        $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID, $request->facilityID, $request->buildingID, $request->floorID, $request->zoneID);
                    } else {
                        $data = $query
                                    ->where("id", $id)
                                    ->select('categoryID', 'deviceCategory', 'deviceName', 'deviceTag', 'macAddress', 'serialNumber','firmwareVersion', 'hardwareModelVersion', 'pollingPriority', 'nonPollingPriority', 'disconnectionStatus', 'binFileName', 'dataPushUrl', 'deviceMode', 'modifiedStatus', 'disconnectedOnGrid')
                                    ->first();

                        // $tempAry = explode("/", @$data->binFileName);
                        // $fileName = @$tempAry[count(@$tempAry) - 1];
                        // $filePath = public_path() . '/temp/' . @$fileName;

                        // @copy($data->binFileName, $filePath);
                        // while(!file_exists($filePath)) {
                        //     sleep(2);
                        // }

                        // $data->binFileName = asset('temp/' . $fileName);
                        $data->binFileName = '';
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function addConfigDevice(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required",

                "deviceName" => "required",
                "deviceCategory" => "required",
                "deviceTag" => "required",
                "macAddress" => "required",
                "pollingPriority" => "required",
                "nonPollingPriority" => "required",
                "disconnectedOnGrid" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                $query = $this->configTableDevicesConnection;

                $deviceTag = $query->where('deviceTag', $request->deviceTag)->get();

                if($deviceTag->count()){
                    $result = new Response([
                        "status" => "error",
                        "message" => $request->deviceTag." is already used, device tag must be unique"
                    ]);
                    $result->setStatusCode(409);
                } else {
                    // $category = $this->configTableCategoriesConnection->where('id', $request->deviceCategory)->first();
                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityID" => $request->facilityID,
                        "buildingID" => $request->buildingID,
                        "floorID" => $request->floorID,
                        "zoneID" => $request->zoneID,

                        "deviceName" => $request->deviceName,
                        "categoryID" => $request->deviceCategory,
                        "deviceCategory" => $request->deviceCategory,
                        "firmwareVersion" => $request->firmwareVersion,
                        "macAddress" => $request->macAddress,
                        "deviceTag" => $request->deviceTag,
                        "nonPollingPriority" => $request->nonPollingPriority,
                        "pollingPriority" => $request->pollingPriority,
                        "dataPushUrl" => null,
                        "firmwarePushUrl" => null,
                        "connStatus" => "",
                        "deviceMode" => "enabled",
                        "hardwareModelVersion" => $request->hardwareModelVersion,
                        // "disconnectionStatus" => 1,
                        "disconnectedOnGrid" => $request->disconnectedOnGrid,
                        "dataPushUrl" => $request->dataPushUrl
                    ];

                    if($request->hasFile('binFile')){
                        $file = $request->file('binFile');
                        $fileName = time() . '_' . $request->deviceName . '_' . $request->deviceTag . '_' .$request->firmwareVersion . '.' . $file->getClientOriginalExtension();
                        // $fileName = time() . '_' . $request->deviceName . $file->getClientOriginalName();
                        $file->move(env('BIN_FOLDER'), $fileName);

                        $data['binFileName'] = env('SERVER_URL'). '/binFiles/' .$fileName;
                    }

                    $create = $query->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Device added successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                }
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

    public function editConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required",

                "deviceName" => "required",
                "deviceCategory" => "required",
                "deviceTag" => "required",
                "pollingPriority" => "required",
                "nonPollingPriority" => "required",
                "disconnectedOnGrid" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                $query = $this->configTableDevicesConnection;

                $deviceTag = $query->where('id', '!=', $id)->where('deviceTag', $request->deviceTag)->get();

                if($deviceTag->count()){
                    $result = new Response([
                        "status" => "error",
                        "message" => $request->deviceTag." is already used, device tag must be unique"
                    ]);
                    $result->setStatusCode(409);
                } else {
                    $category = $this->configTableCategoriesConnection->where('categoryName', $request->deviceCategory)->first();

                    $data = [
                        "locationID" => $request->locationID,
                        "branchID" => $request->branchID,
                        "facilityID" => $request->facilityID,
                        "buildingID" => $request->buildingID,
                        "floorID" => $request->floorID,
                        "zoneID" => $request->zoneID,

                        "deviceName" => $request->deviceName,
                        "categoryID" => $category->id,
                        "deviceCategory" => $category->categoryName,
                        "firmwareVersion" => $request->firmwareVersion,
                        "macAddress" => $request->macAddress,
                        "serialNumber" => $request->serialNumber,
                        "deviceTag" => $request->deviceTag,
                        "nonPollingPriority" => $request->nonPollingPriority,
                        "pollingPriority" => $request->pollingPriority,
                        // "firmwarePushUrl" => $request->firmwarePushUrl,
                        "connStatus" => "",
                        "deviceMode" => "enabled",
                        "hardwareModelVersion" => $request->hardwareModelVersion,
                        // "disconnectionStatus" => 1,
                        "disconnectedOnGrid" => $request->disconnectedOnGrid,
                        "dataPushUrl" => $request->dataPushUrl,
                    ];

                    if($request->hasFile('binFile')){
                        $file = $request->file('binFile');
                        $fileName = time() . '_' . $request->deviceName . '_' . $request->deviceTag . '_' .$request->firmwareVersion . '.' . $file->getClientOriginalExtension();
                        $file->move(env('BIN_FOLDER'), $fileName);

                        $data['binFileName'] = env('SERVER_URL'). '/binFiles/' .$fileName;
                    }

                    $row = DB::connection('mysqlConfig')->table('devices')->where("id", $id);

                    $old = $row->first();

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($data as $field => $newValue) {
                        if (isset($old->$field) && $old->$field != $newValue) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    $update = $row->update($data);

                    // Event log for edit building
                    if(count($updatedFields) > 0){
                        $this->logController->addEventLog([
                            "locationID" => $old->locationID,
                            "branchID" => $old->branchID,
                            "facilityID" => $old->facilityID,
                            "buildingID" => $old->buildingID,
                            "floorID" => $old->floorID,
                            "zoneID" => $old->zoneID,
                            "deviceID" => $id,
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "Device Config",
                            "eventDetails" => "Edit Device: $old->deviceName".json_encode($updatedFields)
                        ]);
                    }

                    $result = new Response([
                        "status" => "success",
                        "message" => "Device updated successfully"
                    ]);
                    $result->setStatusCode(200);
                }
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

    public function editConfigDeviceBinFile(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                $data = [];
                if($request->hasFile('binFile')){
                    $file = $request->file('binFile');
                    $fileName = time() . '_' . $request->deviceName . '_' . $request->deviceTag . '_' .$request->firmwareVersion . '.' . $file->getClientOriginalExtension();
                    $file->move(env('BIN_FOLDER'), $fileName);

                    $data['binFileName'] = env('SERVER_URL'). '/binFiles/' .$fileName;
                }

                $row = $this->configTableDevicesConnection->where("id", $id);

                $old = $row->first();

                $updatedFields = [];

                // Checking for changed fields
                foreach ($data as $field => $newValue) {
                    if (isset($old->$field) && $old->$field != $newValue) {
                        // pushing the changed fields in updatedFields[]
                        $updatedFields[$field] = [
                            'old_value' => $old->$field,
                            'new_value' => $newValue,
                        ];
                    }
                }

                $update = $row->update($data);

                // Event log for edit building
                if(count($updatedFields) > 0){
                    $this->logController->addEventLog([
                        "locationID" => $old->locationID,
                        "branchID" => $old->branchID,
                        "facilityID" => $old->facilityID,
                        "buildingID" => $old->buildingID,
                        "floorID" => $old->floorID,
                        "zoneID" => $old->zoneID,
                        "deviceID" => $id,
                        "userEmail" => $this->jwtToken['email'],
                        "eventName" => "Device Config",
                        "eventDetails" => "Edit Device: $old->deviceName".json_encode($updatedFields)
                    ]);
                }

                $result = new Response([
                    "status" => "success",
                    "message" => "Bin File updated successfully"
                ]);
                $result->setStatusCode(200);
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

    public function changeModeConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $deviceMode = $request->deviceMode;
            $device = $this->configTableDevicesConnection->where('id', $id)->first();
            $changeDeviceMode = true;

            if($device){
                switch ($deviceMode) {
                    case 'config':
                    case 'firmwareUpgradation':
                    case 'bumpTest':
                    case 'debug':
                    case 'eventLog':
                        // 1 is for disconnected
                        if($device->disconnectionStatus == 1){
                            $changeDeviceMode = false;
                        }
                        break;
                    default:
                        # code...
                        break;
                }

                if($changeDeviceMode){
                    try {
                        $deviceMode = $request->deviceMode;
                        $row = $this->configTableDevicesConnection->where("id", $id);

                        $old = $row->first();

                        $updatedFields = [];

                        // Checking for changed fields
                        if ($old->deviceMode != $deviceMode) {
                            // pushing the changed fields in updatedFields[]
                            $updatedFields['deviceMode'] = [
                                'old_value' => $old->deviceMode,
                                'new_value' => $deviceMode,
                            ];
                        }

                        $update = $row->update([
                            "deviceMode" => $deviceMode
                        ]);

                        // Event log for edit building
                        if(count($updatedFields) > 0){
                            $this->logController->addEventLog([
                                "locationID" => $old->locationID,
                                "branchID" => $old->branchID,
                                "facilityID" => $old->facilityID,
                                "buildingID" => $old->buildingID,
                                "floorID" => $old->floorID,
                                "zoneID" => $old->zoneID,
                                "deviceID" => $id,
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Device Config",
                                "eventDetails" => "Mode Change: $old->deviceName".json_encode($updatedFields)
                            ]);
                        }

                        if($update){
                            $result = new Response([
                                "status" => "success",
                                "message" => "Device $request->deviceMode successfully"
                            ]);
                            $result->setStatusCode(200);
                        }
                    } catch (\Throwable $th) {
                        $result = new Response([
                            "status" => "error",
                            "message" => $th->getMessage()
                        ]);
                        $result->setStatusCode(500);
                    }
                } else {
                    $result = new Response([
                        "status" => "error",
                        "message" => "Device is not connected"
                    ]);
                    $result->setStatusCode(412);
                }
            } else {
                $result = new Response([
                    "status" => "error",
                    "message" => "Device not found"
                ]);
                $result->setStatusCode(404);
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

    public function deleteConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteDevice = $this->configTableDevicesConnection->where("id", $id)->delete();
                $deleteSensor = $this->configTableSensorConnection->where("deviceID", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("deviceID", $id)->delete();

                // if($deleteDevice && $deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Device deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    public function copyConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $device = $this->configTableDevicesConnection->where("id", $id)->first();
                // $sensor = $this->configTableSensorConnection->where("deviceID", $id)->first();

                if($device){
                    unset($device->id);
                    unset($device->createdAt);
                    unset($device->modifiedAt);
                    $device->deviceName = $device->deviceName.'-Copy';

                    $data = (array) $device;

                    $createDevice = $this->configTableDevicesConnection->insertGetID($data);

                    if($createDevice){
                        // if($sensor){
                        //     unset($sensor->id);
                        //     unset($sensor->created_at);
                        //     unset($sensor->updated_at);

                        //     $sensor->deviceID = $createDevice;

                        //     $sensorData = (array) $sensor;

                        //     $this->configTableSensorConnection->insert($sensorData);
                        // }

                        $result = new Response([
                            "status" => "success",
                            "message" => "Device copied successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } else {
                    $result = new Response([
                        "status" => "error",
                        "message" => "Could not find device"
                    ]);
                    $result->setStatusCode(404);
                }
            } catch (\Throwable $th) {
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

    public function communConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $row = $this->configTableDevicesConnection->where('id', $id);

                $old = $row->first();

                $updatedFields = [];

                if($data['connectionInfo'] != $old->connectionInfo){
                    $updatedFields['Edit Comm Setup'] = [
                        "old_value" => $old->connectionInfo,
                        "new_value" => $data['connectionInfo']
                    ];
                }

                $update = $row->update($data);

                // Event log for edit building
                if(count($updatedFields) > 0){
                    $this->logController->addEventLog([
                        "locationID" => $old->locationID,
                        "branchID" => $old->branchID,
                        "facilityID" => $old->facilityID,
                        "buildingID" => $old->buildingID,
                        "floorID" => $old->floorID,
                        "zoneID" => $old->zoneID,
                        "deviceID" => $id,
                        "userEmail" => $this->jwtToken['email'],
                        "eventName" => "Device Config",
                        "eventDetails" => "Device Name: ".$old->deviceName.json_encode($updatedFields)
                    ]);
                }

                $result = new Response([
                    "status" => "success",
                    "message" => "Device communication config added successfully"
                ]);
                $result->setStatusCode(200);

            } catch (\Throwable $th) {
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

    public function moveConfigDevice(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "zoneID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $zone = $this->getZone($request->zoneID);

                    $updateData = [
                        "locationID" => $zone->locationID,
                        "branchID" => $zone->branchID,
                        "facilityID" => $zone->facilityID,
                        "buildingID" => $zone->buildingID,
                        "floorID" => $zone->floorID,
                        "zoneID" => $request->zoneID
                    ];

                    $this->configTableDevicesConnection->where('id', '=', $id)->update($updateData);
                    $this->configTableSensorConnection->where('deviceID', '=', $id)->update($updateData);
                    $this->tmsTableAlertCronsConnection->where("deviceID", '=', $id)->delete();

                    $result = new Response([
                        "status" => "success",
                        "message" => "Device moved successfully"
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    // Sensor
    public function getAllSensor(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $this->configTableSensorConnection
                            ->select('sensorName', 'sensorTag', 'zoneID', 'deviceID', 'sensorOutput', 'id')
                            ->get();

                $result = new Response([
                    "status" => "success",
                    "data" => $data
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    public function getConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
                try {
                    $query = $this->configTableSensorConnection;

                    if($id == "all"){
                        $rules = [
                            "locationID" => "required",
                            "branchID" => "required",
                            "facilityID" => "required",
                            "buildingID" => "required",
                            "floorID" => "required",
                            "zoneID" => "required",
                            "deviceID" => "required",
                        ];

                        $validate = Validator::make($request->all(), $rules);

                        if($validate->fails()){
                            $result = new Response([
                                "status" => "error",
                                "message" => $validate->errors()
                            ]);
                            $result->setStatusCode(422);
                        } else {
                            $data['data'] = $query->where('locationID', $request->locationID)->where('branchID', $request->branchID)->where('facilityID', $request->facilityID)->where('buildingID', $request->buildingID)->where('floorID', $request->floorID)->where('zoneID', $request->zoneID)->where('deviceID', $request->deviceID)->get();
                            $data['locationDetails'] = $this->getLocation($request->locationID, $request->branchID, $request->facilityID, $request->buildingID, $request->floorID, $request->zoneID, $request->deviceID);
                        }
                    } else {
                        $data = $query->where("id", $id)->first();
                    }

                    $result = new Response([
                        "status" => "success",
                        "data" => $data
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
            // }
        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function addConfigSensor(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required",
                "deviceID" => "required",

                "sensorName" => "required",
                "sensorTag" => "required",
                "alarmType" => "required",
                "bumpTest" => "required",
                "sensorOutput" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $query = $this->configTableSensorConnection;

                    $uniqueSensorTag = $query->where('sensorTag', $request->sensorTag)->get();

                    if($request->slotID){
                        $uniqueSlots = DB::connection('mysqlConfig')->table('sensors')
                                        ->where('deviceID', $request->deviceID)
                                        ->where('sensorOutput', '=', $request->sensorOutput)
                                        ->where('slotID', $request->slotID)
                                        ->get();

                        if($uniqueSlots->count()){
                            $result = new Response([
                                "status" => "error",
                                "message" => "Slot <b>".$request->slotID."</b> is already deployed for device"
                            ]);
                            $result->setStatusCode(409);
                            return $result;
                        }
                    }

                    if($uniqueSensorTag->count()){
                        $result = new Response([
                            "status" => "error",
                            "message" => $request->sensorTag." is already deployed for device"
                        ]);
                        $result->setStatusCode(409);
                    } else {
                        $data = $request->post();
                        $device = $this->getDevice($request->deviceID);

                        $data['deviceCategory'] = $device->deviceCategory;

                        $create = $query->insert($data);

                        if($create){
                            $result = new Response([
                                "status" => "success",
                                "message" => "Sensor added successfully"
                            ]);
                            $result->setStatusCode(200);
                        }
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function editConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "locationID" => "required",
                "branchID" => "required",
                "facilityID" => "required",
                "buildingID" => "required",
                "floorID" => "required",
                "zoneID" => "required",
                "deviceID" => "required",

                "sensorName" => "required",
                "sensorTag" => "required",
                "alarmType" => "required",
                "bumpTest" => "required",
                "sensorOutput" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $uniqueSensorTag = $this->configTableSensorConnection->where('id', '!=', $id)->where('sensorTag', $request->sensorTag)->get();

                    if($request->slotID){
                        $uniqueSlots = DB::connection('mysqlConfig')->table('sensors')
                                        ->where('deviceID', $request->deviceID)
                                        ->where('sensorOutput', '=', $request->sensorOutput)
                                        ->where('slotID', $request->slotID)
                                        ->where('id', '!=', $id)
                                        ->get();

                        if($uniqueSlots->count()){
                            $result = new Response([
                                "status" => "error",
                                "message" => "Slot <b>".$request->slotID."</b> is already deployed for device"
                            ]);
                            $result->setStatusCode(409);
                            return $result;
                        }
                    }

                    if($uniqueSensorTag->count()){
                        $result = new Response([
                            "status" => "error",
                            "message" => $request->sensorTag." is already deployed for device"
                        ]);
                        $result->setStatusCode(409);
                    } else {
                        $device = $this->getDevice($request->deviceID);

                        $this->logController->addLimitEditLog($this->jwtToken['email'], $device, $id, $request->post());

                        $data = $request->post();
                        $data['deviceCategory'] = $device->deviceCategory;

                        $row = DB::connection('mysqlConfig')->table('sensors')->where("id", $id);

                        $old = $row->first();

                        $updatedFields = [];

                        // Checking for changed fields
                        foreach ($data as $field => $newValue) {
                            if (isset($old->$field) && $old->$field != $newValue) {
                                // pushing the changed fields in updatedFields[]
                                $updatedFields[$field] = [
                                    'old_value' => $old->$field,
                                    'new_value' => $newValue,
                                ];
                            }
                        }

                        $update = $row->update($data);

                        // Event log for edit building
                        if(count($updatedFields) > 0){
                            $this->logController->addEventLog([
                                "locationID" => $old->locationID,
                                "branchID" => $old->branchID,
                                "facilityID" => $old->facilityID,
                                "buildingID" => $old->buildingID,
                                "floorID" => $old->floorID,
                                "zoneID" => $old->zoneID,
                                "deviceID" => $old->deviceID,
                                "sensorID" => $id,
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Sensor Config",
                                "eventDetails" => "Edit Sensor: $old->sensorName".json_encode($updatedFields)
                            ]);
                        }

                        $result = new Response([
                            "status" => "success",
                            "message" => "Sensor Updated successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function settingsConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $row = $this->configTableSensorConnection->where('id', '=', $id);

                $old = $row->first();

                $updatedFields = [];

                // Checking for changed fields
                foreach ($data as $field => $newValue) {
                    if (isset($old->$field) && $old->$field != $newValue) {
                        // pushing the changed fields in updatedFields[]
                        $updatedFields[$field] = [
                            'old_value' => $old->$field,
                            'new_value' => $newValue,
                        ];
                    }
                }

                $row->update($data);

                // Event log for edit building
                if(count($updatedFields) > 0){
                    $this->logController->addEventLog([
                        "locationID" => $old->locationID,
                        "branchID" => $old->branchID,
                        "facilityID" => $old->facilityID,
                        "buildingID" => $old->buildingID,
                        "floorID" => $old->floorID,
                        "zoneID" => $old->zoneID,
                        "deviceID" => $old->deviceID,
                        "sensorID" => $id,
                        "userEmail" => $this->jwtToken['email'],
                        "eventName" => "Sensor Config",
                        "eventDetails" => "Edit Sensor: $old->sensorName".json_encode($updatedFields)
                    ]);
                }

                $result = new Response([
                    "status" => "success",
                    "message" => "Sensor settings updated successfully"
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    public function deleteConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteSensor = $this->configTableSensorConnection->where("id", $id)->delete();
                $deleteAlerts = $this->tmsTableAlertCronsConnection->where("sensorID", $id)->delete();

                // if($deleteSensor && $deleteAlerts){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Sensor deleted successfully"
                    ]);
                    $result->setStatusCode(200);
                // }
            } catch (\Throwable $th) {
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

    public function copyConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $sensor = $this->configTableSensorConnection->where("id", $id)->first();

                if($sensor){
                    unset($sensor->id);
                    unset($sensor->createdAt);
                    unset($sensor->modifiedAt);
                    $sensor->sensorName = $sensor->sensorName.'-Copy';
                    $sensor->sensorTag = $sensor->sensorTag.'-Copy';

                    $data = (array) $sensor;

                    $createSensor = $this->configTableSensorConnection->insertGetID($data);

                    if($createSensor){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Sensor copied successfully"
                        ]);
                        $result->setStatusCode(200);
                    }
                } else {
                    $result = new Response([
                        "status" => "error",
                        "message" => "Could not find sensor"
                    ]);
                    $result->setStatusCode(404);
                }
            } catch (\Throwable $th) {
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

    public function moveConfigSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "deviceID" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $device = $this->getDevice($request->deviceID);

                    $this->configTableSensorConnection->where('id', '=', $id)->update([
                        "locationID" => $device->locationID,
                        "branchID" => $device->branchID,
                        "facilityID" => $device->facilityID,
                        "buildingID" => $device->buildingID,
                        "floorID" => $device->floorID,
                        "zoneID" => $device->zoneID,
                        "deviceID" => $request->deviceID
                    ]);
                    $this->tmsTableAlertCronsConnection->where("sensorID", '=', $id)->delete();

                    $result = new Response([
                        "status" => "success",
                        "message" => "Sensor moved successfully"
                    ]);
                    $result->setStatusCode(200);
                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    // bumpTest
    public function startBumpTest(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "duration" => "required",
                "gasPercentage" => "required",
                "testType" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                try {
                    $startTime = date('Y-m-d H:i:s');
                    $bumpTestInfo=[];
                    $resultOK='';

                    $sensor = $this->configTableSensorConnection
                                ->where('id', $request->sensorID)
                                ->select('defaultValue', 'scaleInfo', 'sensorOutput')
                                ->first();

                    if($sensor){
                        $data = [
                            "startTime" => $startTime,
                            "deviceID" => $request->deviceID,
                            "sensorID" => $request->sensorID,
                            "testType" => $request->testType,
                            "gasPercentage" => $request->gasPercentage,
                            "duration" => $request->duration,
                            "info" => json_encode($sensor),
                        ];

                        $insertedId = $this->reportsTableBumpTestInfoConnection->insertGetId($data);
                        $result = new Response([
                            "status" => "success",
                            "bumpTestID" => $insertedId,
                            "message" => "Bump Test started successfully"
                        ]);
                        $result->setStatusCode(200);
                    } else {
                        $result = new Response([
                            "status" => "error",
                            "message" => "Sensor not found"
                        ]);
                        $result->setStatusCode(404);
                    }

                } catch (\Throwable $th) {
                    $result = new Response([
                        "status" => "error",
                        "message" => $th->getMessage()
                    ]);
                    $result->setStatusCode(500);
                }
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

    public function getBumpTestInfo($deviceID, $sensorID)
    {
        $return = ["resultOK" => "NO"];
        $currentDateTime = new DateTime();
        $currentDateTime->sub(new DateInterval('PT50M'));
        $adjustedTime = $currentDateTime->format('Y-m-d H:i:s');

        $bumpTestInfo = $this->reportsTableBumpTestInfoConnection
            ->where('deviceID', '=', $deviceID)
            ->where('sensorID', '=', $sensorID)
            ->where('startTime', '>', $adjustedTime)
            ->whereNull('endTime')
            ->limit(1)
            ->first();

        if($bumpTestInfo){
            $bumpTestData = json_decode($bumpTestInfo->info);
            $defaultValue = $bumpTestData->defaultValue;
            $sensorOutput = $bumpTestData->sensorOutput;
            $scaleInfo = $bumpTestData->scaleInfo;

            $return = [
                "resultOK" => "YES",
                "bumpTestID" => $bumpTestInfo->id,
                "startTime" => $bumpTestInfo->startTime,
                "testType" => $bumpTestInfo->testType,
                "gasPercentage" => $bumpTestInfo->gasPercentage,
                "duration" => $bumpTestInfo->duration,
                "defaultValue" => $defaultValue,
                "sensorOutput" => $sensorOutput,
                "scaleInfo" => $scaleInfo,
            ];
        }

        return $return;

    }

    public function runBumpTestSimulator($deviceID, $sensorID, $bumpTestInfo)
    {
        $dateInfo=date("Y-m-d");
        $timeInfo=date("H:i:s");
        $collectTime = $dateInfo." ".$timeInfo;
        $insertCount=0;

        $jsonSimulatorData=array();
        $jsonSimulatorData["DATE"]=$dateInfo;
        $jsonSimulatorData["TIME"]=$timeInfo;
        $jsonSimulatorData["DEVICE_ID"]=(string)$deviceID;
        $jsonSimulatorData["SD_CARD"] = "1"; //hardcoded
        $jsonSimulatorData["RSSI"] = "28"; //hardcoded
        $jsonSimulatorData["MODE"]= "2"; // hardcoded
        $jsonSimulatorData["ACCESS_CODE"]="1003"; // hardcoded

        $val=$bumpTestInfo['defaultValue'];
        $randVal=rand(5,10);
        $randValPercent=$randVal/100;
        $valDyn = number_format( (($val*$randValPercent)+$val), self::SENSOR_DECIMAL_PRECISION, '.','');

        $jsonSimulatorData[$sensorID]=(string)$valDyn;

        $data=json_encode($jsonSimulatorData);

        $this->reportsTableBumpTestDeviceIncomingDataConnection->insert([
            "data" => $data
        ]);
    }

    public function getDiffSeconds($startTime)  {
        $currentTime = date('Y-m-d H:i:s');

        $date1 = new DateTime($currentTime);
        $date2 = new DateTime($startTime);

        $interval = $date1->diff($date2);
        $secondsDifference = $interval->s + ($interval->i * 60) + ($interval->h * 3600) + ($interval->days * 86400);
        return $secondsDifference;
    }

    public function scalingValue( $sensorID, $sensorValue, $bumpTestInfo){
        $scaledValue = 0;

        $minRatedReading = $bumpTestInfo['scaleInfo']['minR'];
        $maxRatedReading =  $bumpTestInfo['scaleInfo']['maxR'];
        $minRatedReadingScale =  $bumpTestInfo['scaleInfo']['minRS'];
        $maxRatedReadingScale =  $bumpTestInfo['scaleInfo']['maxRS'];

        //((Ymax-Ymin)/(Xmax-Xmin)) * ($val - Xmin) + Ymin  //formula for scalling
        $scaledValue = (($maxRatedReadingScale-$minRatedReadingScale)/($maxRatedReading-$minRatedReading)) * ($sensorValue - $minRatedReading) + $minRatedReadingScale;
        //echo "SensorID=[$sensorID][$sensorValue][$scaledValue] minRatedReading [$minRatedReading] maxRatedReading [$maxRatedReading] minRatedReadingScale [$minRatedReadingScale]  maxRatedReadingScale [$maxRatedReadingScale] <br/>";
        return $scaledValue;
    }

    public function processBumpTestData($deviceID, $sensorID, $bumpTestInfo, $bumpTestID)
    {
        try {
            $dataIDString='';
            $recordCount=0;

            $bumpTestData = $this->reportsTableBumpTestDeviceIncomingDataConnection
                                ->select('id', 'data')
                                ->orderBy('id', 'asc')
                                ->limit(100)
                                ->get();

            foreach ($bumpTestData as $data) {
                $jsonData = $data->data;
                $jsonDataObj = json_decode($jsonData,true);
                $collectedTime = $jsonDataObj["DATE"]." ".$jsonDataObj["TIME"];
                $incomingDeviceID = $jsonDataObj["DEVICE_ID"];

                if($incomingDeviceID == $deviceID){
                    $secondsDifference = $this->getDiffSeconds($bumpTestInfo['startTime']);

                    if($secondsDifference > 15){
                        $segregatedValuesSql = '';
                        foreach($jsonDataObj as $key => $value) {
                            if($key !== "DATE" && $key !== "TIME" && $key !== "DEVICE_ID" &&  $key !== "SD_CARD" && $key !== "RSSI" && $key !== "MODE" && $key !== "ACCESS_CODE"){
                                $sensorID = $key;
                                $sensorValue = $value;
                                $scaledValue = $sensorValue;

                                if ($bumpTestInfo['sensorOutput'] != self::SENSOR_TYPE_INBUILT) {
                                    $scaledValue = $this->scalingValue($sensorID, $sensorValue, $bumpTestInfo);
                                }

                                $this->reportsTableBumpTestSensorSegregatedValuesConnection->insert([
                                    "bumpTestID" => $bumpTestID,
                                    "deviceID" => $deviceID,
                                    "sensorID" => $sensorID,
                                    "sensorValue" => $sensorValue,
                                    "scaledValue" => $scaledValue,
                                    "collectedTime" => $collectedTime
                                ]);
                            }
                        }
                    }

                    if ($dataIDString == ""){
                        $dataIDString = $result['id'];
                    } else {
                        $dataIDString .= ", ".$result['id'];
                    }
                    $recordCount++;
                }
            }

            if($recordCount!=0){
                $this->reportsTableBumpTestDeviceIncomingDataConnection->whereIn('id', $dataIDString)->delete();
            } else {
                echo '\n<br/>No records from bumpTestDeviceIncomingData';
            }
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }

    public function getBumpTestRunningValue($deviceID, $sensorID, $bumpTestInfo, $bumpTestID)
    {
        $insertCount = 0;
        $dataInfo = [];

        $dataInfo = $this->reportsTableBumpTestSensorSegregatedValuesConnection
                        ->where('bumpTestID', $bumpTestID)
                        ->select('sensorID', DB::raw('MIN(scaledValue) as minScaledVal'), DB::raw('MAX(scaledValue) as maxScaledVal'), DB::raw('AVG(scaledValue) as avgScaledVal'))
                        ->groupBy('sensorID')
                        ->first();

        $dataInfo->sampleCount = $this->reportsTableBumpTestSensorSegregatedValuesConnection
                                    ->where('bumpTestID', $bumpTestID)
                                    ->get()
                                    ->count();

        return $dataInfo;
    }

    public function runBumpTest(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $deviceID = $request->deviceID;
                $sensorID = $request->sensorID;
                $bumpTestInfo = $this->getBumpTestInfo($deviceID, $sensorID);

                if($bumpTestInfo['resultOK'] == "YES"){
                    $bumpTestID = $bumpTestInfo['bumpTestID'];
                    $this->runBumpTestSimulator($deviceID, $sensorID, $bumpTestInfo);
                    $this->processBumpTestData($deviceID, $sensorID, $bumpTestInfo, $bumpTestID);
                    $datainfo = $this->getBumpTestRunningValue($deviceID, $sensorID, $bumpTestInfo, $bumpTestID);

                    $getDiffSeconds = $this->getDiffSeconds($bumpTestInfo['startTime']);

                    $result = new Response([
                        'status' => 'success',
                        'bumpTestID' => $bumpTestInfo['bumpTestID'],
                        'dataInfo' => $datainfo
                    ]);
                    $result->setStatusCode(200);
                } else {
                    $result = new Response([
                        "status" => "error",
                        "message" => "Unable to Fetch Bump Test ID!"
                    ]);
                    $result->setStatusCode(404);
                }
            } catch (\Throwable $th) {
                $result = new Response([
                    "status" => "error",
                    "message" => $th->getMessage()
                ]);
                $result->setStatusCode(500);
            }
            $resultOK='';
            $bumpTestID='';
            $bumpTestInfo=[];

        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function getDebugData(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $this->tmsTableDeviceDebugDataModeConnection
                            ->where('deviceID', $request->deviceID)
                            ->where('createdAt', '>=', date('Y-m-d H:i:s'))
                            ->latest('id')
                            ->first();

                $result = new Response([
                    "status" => "success",
                    "data" => $data
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    // Device Event Log
    public function getEventLog(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $deviceID = $request->deviceID;
                $data = $this->tmsTableDeviceEventLogData->where("deviceID", $deviceID)->latest('id')->first();

                $result = new Response([
                    'status' => 'success',
                    'data' => $data
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    public function deleteEventLog(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $deleteEventLog = $this->tmsTableDeviceEventLogData->where("id", $id)->delete();

                $result = new Response([
                    "status" => "success",
                    "message" => "Event log deleted successfully"
                ]);
                $result->setStatusCode(200);
            } catch (\Throwable $th) {
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

    // Image delete
    public function deleteImage(Request $request, $table, $id)
    {
        if($request->isMethod('POST')){
            try {
                switch ($table) {
                    case 'Branch':
                        $query = $this->configTableBranchConnection;
                        $name = "branchName";
                        break;

                    case 'Facility':
                        $query = $this->configTableFacilityConnection;
                        $name = "facilityName";
                        break;

                    case 'Building':
                        $query = $this->configTableBuildingConnection;
                        $name = "buildingName";
                        break;

                    case 'Floor':
                        $query = $this->configTableFloorConnection;
                        $name = "floorName";
                        break;

                    case 'Zone':
                        $query = $this->configTableZoneConnection;
                        $name = "zoneName";
                        break;

                    case 'Device':
                        $query = $this->configTableDevicesConnection;
                        $name = "deviceName";
                        break;

                    default:
                        $query = $this->configTableLocationConnection;
                        $name = "locationName";
                        break;
                }

                $row = $query->where('id', $id);

                $old = $row->first();

                $name = $old->$name;

                switch ($table) {
                    case 'Branch':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $id;
                        break;

                    case 'Facility':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $old->branchID;
                        $logData['facilityID'] = $id;
                        break;

                    case 'Building':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $old->branchID;
                        $logData['facilityID'] = $old->facilityID;
                        $logData['buildingID'] = $id;
                        break;

                    case 'Floor':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $old->branchID;
                        $logData['facilityID'] = $old->facilityID;
                        $logData['buildingID'] = $old->buildingID;
                        $logData['floorID'] = $id;
                        break;

                    case 'Zone':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $old->branchID;
                        $logData['facilityID'] = $old->facilityID;
                        $logData['buildingID'] = $old->buildingID;
                        $logData['floorID'] = $old->floorID;
                        $logData['zoneID'] = $id;
                        break;

                    case 'Device':
                        $logData['locationID'] = $old->locationID;
                        $logData['branchID'] = $old->branchID;
                        $logData['facilityID'] = $old->facilityID;
                        $logData['buildingID'] = $old->buildingID;
                        $logData['floorID'] = $old->floorID;
                        $logData['zoneID'] = $old->zoneID;
                        $logData['deviceID'] = $id;
                        break;

                    default:
                        $logData['locationID'] = $id;
                        break;
                }

                $row->update([
                    "image" => Null
                ]);

                $logData = [
                    "userEmail" => $this->jwtToken['email'],
                    "eventName" => "$table Details",
                    "eventDetails" => json_encode([
                        "image" => [
                            "old_value" => $old->image,
                            "new_value" => Null
                        ]
                    ])
                ];


                $logData["eventDetails"] = "$table Name: $name".$logData["eventDetails"];

                $this->logController->addEventLog($logData);


                $result = new Response([
                    "status" => "success",
                    "message" => "$table image removed successfully"
                ]);
                $result->setStatusCode(200);

            } catch (\Throwable $th) {
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
}
