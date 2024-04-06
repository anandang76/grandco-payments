<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use JWTAuth;
use App\Http\Controllers\LogController;


class UsersController extends Controller
{
    protected $jwtToken;
    protected $logController;
    protected $aqmsTableConnection;
    protected $currentUser;
    protected $configTableEmailTextInfoConnection;

    public function __construct(LogController $logController)
    {
        $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $this->logController = $logController;
        $this->aqmsTableConnection = DB::table('users');
        $this->currentUser = DB::table('users')->where('id', $this->jwtToken['id'])->first();
        $this->configTableEmailTextInfoConnection = DB::connection('mysqlConfig')->table('emailTextInfo');
    }

    public function getAllUsers(Request $request)
    {
        if($request->isMethod('POST')){
            try {
                $user = $this->currentUser;
                $users = $this->aqmsTableConnection->select('id', 'employeeID', 'name', 'email', 'mobileNumber', 'userRole', 'locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID', 'emailNotification', 'smsNotification');

                $userLocationFilters = array_filter([
                    'locationID' => $user->locationID,
                    'branchID' => $user->branchID,
                    'facilityID' => $user->facilityID,
                    'buildingID' => $user->buildingID,
                    'floorID' => $user->floorID,
                    'zoneID' => $user->zoneID,
                ]);

                if(!empty($userLocationFilters)){
                    $users = $users->where($userLocationFilters);
                }

                if($user->userRole != 'systemSpecialist'){
                    $users = $users->where('userRole', '!=', 'systemSpecialist');
                }

                $result = new Response([
                    "status" => "success",
                    "data" => [
                        "users" => $users->get()
                    ]
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

    public function getUser(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $user = $this->aqmsTableConnection->where('id', $id)->first();

                $result = new Response([
                    "status" => "success",
                    "data" => $user
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

    public function addUser(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "employeeID" => "required",
                "email" => "required",
                "mobileNumber" => "required",
                "name" => "required",
                "userRole" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $result = new Response([
                    "status" => "error",
                    "message" => $validate->errors()
                ]);
                $result->setStatusCode(422);
            } else {
                $existingUser = DB::table('users')->where('email', $request->email)->get();
                if($existingUser->count()){
                    $result = new Response([
                        "status" => "error",
                        "message" => "User with email <b>$request->email</b> already exists"
                    ]);
                    $result->setStatusCode(409);
                } else {
                    try {
                        $data = $request->post();

                        $password = $this->getPassword(10);
                        $data['password'] = Hash::make($password);
                        $data['isVerified'] = 1;
                        $data['companyCode'] = env('COMPANY_CODE');

                        $locations = ['locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID'];

                        foreach ($data as $key => $value) {
                            if(in_array($key, $locations) && $data[$key] == "all"){
                                $data[$key] = Null;
                            }
                        }

                        $create = $this->aqmsTableConnection->insert($data);

                        $url = env('APPLICATION_URL');
                        $data = [
                            'userid'=> $request->email,
                            'subject' => 'Application employee Credentials',
                            'body' =>$password,
                            'url' => $url
                        ];

                        $emailTemplate = $this->configTableEmailTextInfoConnection->where("templateID", "NEW_USER_EMAIL")->first();

                        $body = $emailTemplate->body;
                        $body = str_replace("[APPLICATION_URL]", env('SERVER_URL'), $body);
                        $body = str_replace("[EMAIL]", $request->email, $body);
                        $body = str_replace("[PASSWORD]", $password, $body);

                        $subject = $emailTemplate->subject;

                        $this->send_mail($body, $subject, $request->email);

                        if($create){
                            $requestLocationFilters = array_filter([
                                'locationID' => isset($request->locationID) ? $request->locationID == "all" ? Null : $request->locationID : $old->locationID,
                                'branchID' => isset($request->branchID) ? $request->branchID == "all" ? Null : $request->branchID : $old->branchID,
                                'facilityID' => isset($request->facilityID) ? $request->facilityID == "all" ? Null : $request->facilityID : $old->facilityID,
                                'buildingID' => isset($request->buildingID) ? $request->buildingID == "all" ? Null : $request->buildingID : $old->buildingID,
                                'floorID' => isset($request->floorID) ? $request->floorID == "all" ? Null : $request->floorID : $old->floorID,
                                'zoneID' => isset($request->zoneID) ? $request->zoneID == "all" ? Null : $request->zoneID : $old->zoneID
                            ]);

                            $logData = array_merge($requestLocationFilters, [
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "User",
                                "eventDetails" => json_encode(["New User" => $request->post()])
                            ]);
                            // Event log for new users
                            $this->logController->addEventLog($logData);

                            $result = new Response([
                                "status" => "success",
                                "message" => "User Added Successfully"
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

    public function editUser(Request $request, $id)
    {
        if($request->isMethod('POST')){
            $rules = [
                "employeeID" => "required",
                "email" => "required",
                "mobileNumber" => "required",
                "name" => "required",
                "userRole" => "required"
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
                    $row = $this->aqmsTableConnection->where('id', $id);

                    // Record before updating
                    $old = $row->first();

                    $locations = ['locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID'];

                    foreach ($data as $key => $value) {
                        if(in_array($key, $locations) && $data[$key] == "all"){
                            $data[$key] = Null;
                        }
                    }

                    // Updating record
                    $update = $row->update($data);

                    $updatedFields = [];

                    // Checking for changed fields
                    foreach ($data as $field => $newValue) {
                        if (isset($old->$field) && $old->$field !== $newValue && $field != "id") {
                            // pushing the changed fields in updatedFields array
                            $updatedFields[$field] = [
                                'old_value' => $old->$field,
                                'new_value' => $newValue,
                            ];
                        }
                    }

                    if($update){
                        $requestLocationFilters = array_filter([
                            'locationID' => isset($request->locationID) ? $request->locationID == "all" ? Null : $request->locationID : $old->locationID,
                            'branchID' => isset($request->branchID) ? $request->branchID == "all" ? Null : $request->branchID : $old->branchID,
                            'facilityID' => isset($request->facilityID) ? $request->facilityID == "all" ? Null : $request->facilityID : $old->facilityID,
                            'buildingID' => isset($request->buildingID) ? $request->buildingID == "all" ? Null : $request->buildingID : $old->buildingID,
                            'floorID' => isset($request->floorID) ? $request->floorID == "all" ? Null : $request->floorID : $old->floorID,
                            'zoneID' => isset($request->zoneID) ? $request->zoneID == "all" ? Null : $request->zoneID : $old->zoneID
                        ]);

                        $logData = array_merge($requestLocationFilters, [
                            "userEmail" => $this->jwtToken['email'],
                            "eventName" => "User",
                            "eventDetails" => json_encode(["Edit User" => $updatedFields])
                        ]);

                        // Event log for edit users
                        if(count($updatedFields) > 0){
                            $this->logController->addEventLog($logData);
                        }

                        $result = new Response([
                            "status" => "success",
                            "message" => "User Updated Successfully"
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

    public function deleteUser(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $row = $this->aqmsTableConnection->where("id", $id);

                $old = $row->first();
                $delete = $row->delete();

                if($delete){
                    $requestLocationFilters = array_filter([
                        'locationID' => $old->locationID,
                        'branchID' => $old->branchID,
                        'facilityID' => $old->facilityID,
                        'buildingID' => $old->buildingID,
                        'floorID' => $old->floorID,
                        'zoneID' => $old->zoneID
                    ]);

                    $logData = array_merge($requestLocationFilters, [
                        "userEmail" => $this->jwtToken['email'],
                        "eventName" => "User",
                        "eventDetails" => json_encode(["Delete User" => $old->email])
                    ]);
                    // Event log for delete users
                    $this->logController->addEventLog($logData);

                    $result = new Response([
                        "status" => "success",
                        "message" => "User deleted successfully"
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

    public function changePassword(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                "confirmPassword" => "required",
                "newPassword" => "required",
                "oldPassword" => "required",
                "email" => "required"
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $data['status'] = 'error';
                $data['message'] = $validate->errors();

                $return = new Response($data);
                $return->setStatusCode(422);
            } else {
                try {
                    $user = DB::table('users')->where('email', '=', $request->email)->first();

                    if($user){
                        if(Hash::check($request->oldPassword, $user->password)){
                            $password = $request->newPassword;
                            $encryptedPassword = Hash::make($password);

                            DB::table('users')->where('email', '=', $request->email)->update([
                                "changePassword" => 0,
                                "isverified" => 1,
                                "secLevelAuth" => 0,
                                "password" => $encryptedPassword
                            ]);

                            // $user->changePassword = 0;
                            // $user->isverified = 1;
                            // $user->sec_level_auth = 0;
                            // $user->password = $encryptedPassword;
                            // $user->update();

                            $requestLocationFilters = array_filter([
                                'locationID' => $user->locationID,
                                'branchID' => $user->branchID,
                                'facilityID' => $user->facilityID,
                                'buildingID' => $user->buildingID,
                                'floorID' => $user->floorID,
                                'zoneID' => $user->zoneID
                            ]);

                            $logData = array_merge($requestLocationFilters, [
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Change Password",
                                "eventDetails" => "Email: ".$this->jwtToken['email'] . ", Password changed"
                            ]);

                            // Event log for delete users
                            $this->logController->addEventLog([
                                "userEmail" => $this->jwtToken['email'],
                                "eventName" => "Change Password",
                                "eventDetails" => "Email: ".$this->jwtToken['email'] . ", Password changed"
                            ]);

                            $return = new Response([
                                "status" => "success",
                                "message" => "Password is updated"
                            ]);
                            $return->setStatusCode(200);
                        } else {
                            $return = new Response([
                                "status" => "error",
                                "message" => "Old password is incorrect"
                            ]);
                            $return->setStatusCode(401);
                        }
                    }  else {
                        $data['message'] = 'User not found';
                        $data['status'] = 'error';
                        $return = new Response($data);
                        $return->setStatusCode(404);
                    }
                } catch(\Exception $e){
                    $return = new Response([
                        "message" => $e->getMessage(),
                        'status' => "error"
                    ]);
                    $return->setStatusCode(500);
                }
            }
        } else {
            $data['message'] = 'Request method not allowed';
            $data['status'] = 'error';
            $return = new Response($data);
            $return->setStatusCode(405);
        }
        return $return;
    }

    public function resetPassword(Request $request)
    {
        if($request->isMethod('POST')){
            $query = DB::table('users')->where('email', $request->email);
            $user = $query->first();

            if($user){
                $password = $this->getPassword(10);

                $update = $query->update([
                    "password" => Hash::make($password)
                ]);

                $url = env('APPLICATION_URL');
                $data = [
                    'userid'=> $request->email,
                    'subject' => 'Application employee Credentials',
                    'body' =>$password,
                    'url' => $url
                ];

                $emailTemplate = $this->configTableEmailTextInfoConnection->where("templateID", "PASSWORD_RESETTING")->first();

                $body = $emailTemplate->body;
                $body = str_replace("[APPLICATION_URL]", env('SERVER_URL'), $body);
                $body = str_replace("[EMAIL]", $request->email, $body);
                $body = str_replace("[PASSWORD]", $password, $body);

                $subject = $emailTemplate->subject;

                $this->send_mail($body, $subject, $request->email);

                $result = new Response([
                    "status" => "success",
                    "message" => "User password reset Successfully"
                ]);
                $result->setStatusCode(200);
            } else {
                $result = new Response([
                    "status" => "error",
                    "message" => "User with email not found"
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
}
