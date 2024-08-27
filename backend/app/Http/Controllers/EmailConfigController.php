<?php

namespace App\Http\Controllers;
use App\Http\Controllers\LogController;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
use JWTAuth;

class EmailConfigController extends Controller
{
    protected $jwtToken;
    protected $logController;
    protected $configTableEmailTextInfoConnection;

    public function __construct(LogController $logController)
    {
        $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $this->logController = $logController;
        $this->configTableEmailTextInfoConnection = DB::connection('mysqlConfig')->table('emailTextInfo');
    }

    public function getEmailConfig(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                if($id == "all"){
                    $data = $this->configTableEmailTextInfoConnection->get();
                } else {
                    $data = $this->configTableEmailTextInfoConnection->where("id", $id)->first();
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

    public function addEmailConfig(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "templateID" => "required",
                "subject" => "required",
                "body" => "required"
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

                    $create = $this->configTableEmailTextInfoConnection->insert($data);

                    if($create){
                        $result = new Response([
                            "status" => "success",
                            "message" => "Added successfully"
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

    public function editEmailConfig(Request $request, $id)
    {
        $result = new Response([
            "status" => "",
            "message" => ""
        ]);
        $result->setStatusCode(200);

        if($request->isMethod('POST')){
            $rules = [
                "templateID" => "required",
                "subject" => "required",
                "body" => "required"
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

                    $row = $this->configTableEmailTextInfoConnection->where('id', $id);

                    $old = $row->first();

                    $updatedFields = "";

                    // Checking for changed fields
                    foreach ($request->post() as $field => $newValue) {
                        if (isset($old->$field) && $old->$field !== $newValue && $field != "id") {
                            // pushing the changed fields in updatedFields array
                            if ($updatedFields == ""){
                                $updatedFields = $field;
                            } else {
                                $updatedFields .= ", ".$field;
                            }
                        }
                    }

                    // Event log for edit email config
                    if(!empty($updatedFields)){
                        $this->logController->addEventLog([
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "Email Config",
                            "eventDetails" => json_encode([$request->templateID => $updatedFields." - Configuration changes done"])
                        ]);
                    }

                    $update = $row->update($data);

                    $result = new Response([
                        "status" => "success",
                        "message" => "Updated successfully"
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

    public function deleteEmailConfig(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $delete = $this->configTableEmailTextInfoConnection->where("id", $id)->delete();

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
}
