<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;

class DeviceManagementController extends Controller
{
    protected $configTableCategoriesConnection;
    protected $configTableUnitsConnection;
    protected $configTableSensorOutputTypesConnection;
    protected $configTableAQIParameterConnection;
    protected $configTableDefaultSensorsConnection;
    protected $configTableSensorTypeConnection;
    protected $configTableCommunicationConnection;

    public function __construct()
    {
        $this->configTableCategoriesConnection = DB::connection('mysqlConfig')->table('categories');
        $this->configTableUnitsConnection = DB::connection('mysqlConfig')->table('units');
        $this->configTableSensorOutputTypesConnection = DB::connection('mysqlConfig')->table('sensorOutputTypes');
        $this->configTableAQIParameterConnection = DB::connection('mysqlConfig')->table('aqi');
        $this->configTableDefaultSensorsConnection = DB::connection('mysqlConfig')->table('defaultSensors');
        $this->configTableSensorTypeConnection = DB::connection('mysqlConfig')->table('sensorsType');
        $this->configTableCommunicationConnection = DB::connection('mysqlConfig')->table('communication');
    }

    // Category
    public function getCategory(Request $request, $id="")
    {
        if($request->isMethod('POST')){
            try {
                if($id == ""){
                    $data = $this->configTableCategoriesConnection->get();
                } else {
                    $data = $this->configTableCategoriesConnection->where("id", $id)->first();
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

    public function addCategory(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "categoryName" => "required",
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
                        "categoryName" => $request->categoryName,
                        "categoryDescription" => $request->categoryDescription
                    ];

                    $create = $this->configTableCategoriesConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Category added successfully"
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

    public function editCategory(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "categoryID" => "required",
                "categoryName" => "required",
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
                        "categoryName" => $request->categoryName,
                        "categoryDescription" => $request->categoryDescription
                    ];

                    $create = $this->configTableCategoriesConnection->where("id", $request->categoryID)->update($data);

                    $result = new Response([
                        "status" => "success",
                        "message" => "Categroy Updated Successfully"
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

    public function deleteCategory(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "categoryID" => "required"
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
                    $delete = $this->configTableCategoriesConnection->where("id", $request->categoryID)->delete();

                    if($delete){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Category deleted successfully"
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

    // Unit
    public function getUnit(Request $request, $id="")
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableUnitsConnection->get();
                } else {
                    $data = $this->configTableUnitsConnection->where("id", $id)->first();
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

    public function addUnit(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "unitLabel" => "required"
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
                        "unitLabel" => $request->unitLabel,
                        "unitMeasure" => $request->unitMeasure
                    ];

                    $create = $this->configTableUnitsConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Unit Added Successfully"
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

    public function editUnit(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "unitLabel" => "required"
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
                        "unitLabel" => $request->unitLabel,
                        "unitMeasure" => $request->unitMeasure
                    ];

                    $create = $this->configTableUnitsConnection->where("id", $id)->update($data);

                    $result = new Response([
                        "status" => "success",
                        "message" => "Unit Updated Successfully"
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

    public function deleteUnit(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableUnitsConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Unit deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // Sensor Output Type
    public function getSensorOutput(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableSensorOutputTypesConnection->get();
                } else {
                    $data = $this->configTableSensorOutputTypesConnection->where("id", $id)->first();
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

    public function addSensorOutput(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "sensorOutputType" => "required"
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
                        "sensorOutputType" => $request->sensorOutputType,
                        "otherSensorInfo" => $request->otherSensorInfo
                    ];

                    $create = $this->configTableSensorOutputTypesConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Sensor Output Type Added Successfully"
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

    public function editSensorOutput(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "sensorOutputType" => "required"
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
                        "sensorOutputType" => $request->sensorOutputType,
                        "otherSensorInfo" => $request->otherSensorInfo
                    ];

                    $create = $this->configTableSensorOutputTypesConnection->where('id', $id)->update($data);

                    $result = new Response([
                        "status" => "success",
                        "message" => "Sensor Output Type Updated Successfully"
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

    public function deleteSensorOutput(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableSensorOutputTypesConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Sensor Output Type deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // AQI Parameter
    public function getAqiParameter(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableAQIParameterConnection->get();
                } else {
                    $data = $this->configTableAQIParameterConnection->where("id", $id)->first();
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

    public function addAqiParameter(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "parameter" => "required",
                "good" => "required",
                "satisfactory" => "required",
                "moderately" => "required",
                "poor" => "required",
                "veryPoor" => "required",
                "severe" => "required"
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
                    $data = $request->post();

                    $create = $this->configTableAQIParameterConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "New parameter Added Successfully"
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

    public function editAqiParameter(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "parameter" => "required",
                "good" => "required",
                "satisfactory" => "required",
                "moderately" => "required",
                "poor" => "required",
                "veryPoor" => "required",
                "severe" => "required"
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
                    $data = $request->post();

                    $create = $this->configTableAQIParameterConnection->where('id', $id)->update($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Parameter Updated Successfully"
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

    public function deleteAqiParameter(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableAQIParameterConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // Default Sensors
    public function getDefaultSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableDefaultSensorsConnection->get();
                } else {
                    $data = $this->configTableDefaultSensorsConnection->where("id", $id)->first();
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

    public function addDefaultSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "deviceCategory" => "required",
                "sensors" => "required",
                "sensorType" => "required",
                "stel" => "required",
                "twa" => "required",
                "critical" => "required",
                "warning" => "required",
                "outOfRange" => "required",
                "aqiPpm" => "required"
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
                    $data = $request->post();

                    $create = $this->configTableDefaultSensorsConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "New Default Sensor Added Successfully"
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

    public function editDefaultSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "deviceCategory" => "required",
                "sensors" => "required",
                "sensorType" => "required",
                "stel" => "required",
                "twa" => "required",
                "critical" => "required",
                "warning" => "required",
                "outOfRange" => "required",
                "aqiPpm" => "required"
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
                    $data = $request->post();

                    $create = $this->configTableDefaultSensorsConnection->where('id', $id)->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Updated Successfully"
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

    public function deleteDefaultSensor(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableDefaultSensorsConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Default sensor deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // Sensor Type
    public function getSensorType(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $query = $this->configTableSensorTypeConnection;

                if($id == "all"){
                    $data = $query->get();
                } else {
                    $data = $query->where("id", $id)->first();

                    $sensorOutput = $this->configTableSensorOutputTypesConnection->where("id", $data->sensorOutput)->first();
                    $sensorOutput->label = $sensorOutput->sensorOutputType;
                    $sensorOutput->value = $sensorOutput->id;

                    $data->sensorOutput = $sensorOutput;

                    if($data->units){
                        $unit = $this->configTableUnitsConnection->where("id", $data->units)->first();
                        $unit->label = $unit->unitLabel;
                        $unit->value = $unit->id;

                        $data->units = $unit;
                    }
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

    public function addSensorType(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "alarmType" => "required",
                "bumpTest" => "required",
                // "manufacturer" => "required",
                // "partID" => "required",
                "sensorType" => "required",
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
                    $data = $request->post();

                    $create = $this->configTableSensorTypeConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Sensor Added Successfully"
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

    public function editSensorType(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "alarmType" => "required",
                "bumpTest" => "required",
                // "manufacturer" => "required",
                // "partID" => "required",
                "sensorType" => "required",
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
                    $data = $request->post();

                    $create = $this->configTableSensorTypeConnection->where("id", $id)->update($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Sensor Updated Successfully"
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

    public function deleteSensorType(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableSensorTypeConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    // Communication Config
    public function getCommunicationConfig(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $query = $this->configTableCommunicationConnection;

                if($id == "all"){
                    $data = $query->get();
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
        } else {
            $result = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function addCommunicationConfig(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $create = $this->configTableCommunicationConnection->insert($data);

                if($create){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Config Added Successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function updateCommunicationConfig(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $data = $request->post();

                $create = $this->configTableCommunicationConnection->where('id', $id)->update($data);

                if($create){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Communication Config Updated Successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }

    public function deleteCommunicationConfig(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableCommunicationConnection->where("id", $id)->delete();

                if($delete){
                    $result = new Response([
                        "status" => "success",
                        "message" => "Communication Config Deleted successfully"
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
                "message" => "Request method not allowed"
            ]);
            $result->setStatusCode(405);
        }

        return $result;
    }
}
