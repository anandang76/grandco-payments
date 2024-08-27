<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use App\Models\User;

use Auth;
use DB;
use Session;
use Hash;
use Exception;
use JWTAuth;

class LoginController extends Controller
{
    protected $jwtPayload;
    protected $ReportTableUserLogsConnection;
    protected $configTableEmailTextInfoConnection;

    public function __construct()
    {
        $this->ReportTableUserLogsConnection = DB::connection('mysqlReport')->table('userLogsReport');
        $this->configTableEmailTextInfoConnection = DB::connection('mysqlConfig')->table('emailTextInfo');
    }

    public function register(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                'name' => 'required|string',
                'email' => 'required|email',
                'password' => 'required|min:8|string',
            ];
            $validate = Validator::make($request->all(), $rules);
            if($validate->fails()){
                $data['status'] = 'error';
                $data['message'] = $validate->errors();
                $return = new Response($data);
                $return->setStatusCode(422);
            } else {
                $exisiting_email = User::where('email', $request->email)->count();
                if($exisiting_email){
                    $data['status'] = 'error';
                    $data['message']['user'] = 'User with the email already exists';
                    $return = new Response($data);
                    $return->setStatusCode(409);
                } else {
                    $new_user = [
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                    ];
                    // return $new_user;
                    $new_user_id = User::create($new_user);
                    if($new_user_id){
                        /*
                            if($request->first_name){
                                $email_data['name'] = $request->first_name;
                            } else {
                                $email_data['name'] = explode('@', $request->email)[0];
                            }
                            // $email_data['app_name'] = env('APP_NAME');
                            if($request->server('HTTP_REFERER')){
                                $email_data['app_name'] = explode('.', explode('/', $request->server('HTTP_REFERER'))[2])[0];
                                $email_data['login_url'] = $request->server('HTTP_ORIGIN');
                                $email_data['error_message'] = '';
                            } else {
                                $email_data['app_name'] = env('APP_NAME');
                                $email_data['login_url'] = 'javascript:void(0)';
                                $email_data['error_message'] = 'Unable to generate URL on test';
                            }

                            $title = 'Welcome to '.$email_data['app_name'];

                            $htmlContent = env('NEW_USER_EMAIL');
                            $htmlContent = str_replace('{{ $Email_name }}', $email_data['name'], $htmlContent);
                            $htmlContent = str_replace('{{ $Email_app_name }}', $email_data['app_name'], $htmlContent);
                            $htmlContent = str_replace('{{ $Email_error_message }}', $email_data['error_message'], $htmlContent);
                            $htmlContent = str_replace('{{ $Email_login_url }}', $email_data['login_url'], $htmlContent);

                            $this->send_mail_env('emails.new_user', $email_data, $title, $request->email, 1, $htmlContent);
                        */

                        $data['status'] = 'success';
                        $data['message'] = 'User created successfully';
                        $return = new Response($data);
                        $return->setStatusCode(201);
                    } else {
                        $data['status'] = 'error';
                        $data['message'] = 'Unable to  create user';
                        $return = new Response($data);
                        $return->setStatusCode(500);
                    }
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

    public function login(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                'email' => 'required|email',
                'password' => 'required|string'
            ];
            $validate = Validator::make($request->all(), $rules);
            if($validate->fails()){
                $data['status'] = 'error';
                $data['message'] = $validate->errors();

                $return = new Response($data);
                $return->setStatusCode(422);
            } else {
                $email = $request->email;
                $password = $request->password;
                $credentials = [
                    "email" => $email,
                    "password" => $password,
                    "isVerified" => 1
                ];

                try {
                    $user = DB::table('users')->where('email', '=', $email)->first();

                    if($user){
                        if($user->blocked){
                            $return = new Response([
                                "status" => "error",
                                "message" => "User is blocked, please contact admin"
                            ]);
                            $return->setStatusCode(403);
                        } else {
                            $islogin =  Auth::attempt($credentials);
                            if($islogin){
                                $userLogData = array_filter([
                                    'userID' => $user->id,
                                    'userEmail' => $user->email,
                                    'action' =>  "LoggedIn",
                                    "locationID" => $user->locationID,
                                    "branchID" => $user->branchID,
                                    "facilityID" => $user->facilityID,
                                    "buildingID" => $user->buildingID,
                                    "floorID" => $user->floorID,
                                    "zoneID" => $user->zoneID
                                ]);

                                $this->ReportTableUserLogsConnection->insert($userLogData);
                                // DB::table('userLogs')->insert($userLogData);
                                // $twofa_status = $user_details->twofa_status;
                                // if($twofa_status == 1 && $request->tfa != "verified" ){
                                //     $status = $this->send_otp($user_details->phone, $user_details->id);
                                //     if($status['status'] == 'success'){
                                //         $data['status'] = 'success';
                                //         $data['twoFA'] = true;
                                //         $data['user_id'] = $user_details->id;
                                //         $data['message'] = $status['message'];
                                //         $return = new Response($data);
                                //         $return->setStatusCode(200);
                                //     } else {
                                //         $data['status'] = 'error';
                                //         $data['message']['user'] = 'Unable to send OTP';
                                //         $return = new Response($data);
                                //         $return->setStatusCode(500);
                                //     }
                                // } else {
                                    // $customers = DB::table('customers')->where('customerId', $user->companyCode)->first();
                                    $company = DB::table('company')->where('companyCode', $user->companyCode)->first();
                                    $token = $this->generateJWT($user);
                                    $allData=$this->getAllInfo();
                                    $return = new Response([
                                        "accessToken" => $token,
                                        "status" => "success",
                                        "message" => "Successfully logged in",
                                        "twoFA" => false,
                                        "debug" => 1,
                                        "userDetails" => [
                                            "name" => $user->name,
                                            "email" => $user->email,
                                            "mobileNumber" => $user->mobileNumber,
                                            "employeeID" => $user->employeeID,
                                            "companyCode" => $user->companyCode,
                                            "companyName" => $company->companyName,
                                            "locationID" => $user->locationID,
                                            "branchID" => $user->branchID,
                                            "facilityID" => $user->facilityID,
                                            "buildingID" => $user->buildingID,
                                            "floorID" => $user->floorID,
                                            "zoneID" => $user->zoneID,
                                            "defaultImageInfo" => $company->imageInfo,
                                            "imageInfo" => $user->imageInfo,
                                            "userRole" => $user->userRole,
                                            "allData" => $allData
                                        ]
                                    ]);
                                    $return->setStatusCode(200);
                                // }
                            } else {
                                $return = new Response([
                                    'status' => 'error',
                                    'message' => 'Email or password is incorrect'
                                ]);
                                $return->setStatusCode(401);
                            }
                        }
                    } else {
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

    public function otp_login_verify(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                'otp' => 'required|string'
            ];
            $validate = Validator::make($request->all(), $rules);
            if($validate->fails()){
                $data['status'] = 'error';
                $data['message'] = $validate->errors();
                $return = new Response($data);
                $return->setStatusCode(422);
            } else {
                $user_id = $request->user_id;
                $otp = $request->otp;
                $check_otp = DB::table('user_otp')->where('user_id', '=', $user_id)->where('code', '=', $otp)->first();
                if($check_otp){
                    $user = DB::table('users')
                        ->where('id', '=', $user_id)
                        ->where('isVerified', '=', '1');
                    if($user->first()){
                        // return $credentials;
                        try {
                            $islogin =  Auth::loginUsingId($user->first()->id);
                            // return $islogin;
                            if($islogin){
                                $token = $this->generateJWT($user->first());
                                $data['status'] = 'success';
                                $data['message']['user'] = 'Login successful';
                                $data['twoFA'] = false;
                                $data['access_token'] = $token;
                                $return = new Response($data);
                                $return->setStatusCode(200);
                            } else {
                                $data['status'] = 'error';
                                $data['message']['user'] = 'Email or password is incorrect';
                                $return = new Response($data);
                                $return->setStatusCode(401);
                            }
                        } catch(\Exception $e){
                            $return =array(
                                "data" => "",
                                "message" => $e->getMessage(),
                                'status' => "error"
                            );
                        }
                    } else {
                        $data['message']['user'] = 'User not found';
                        $data['status'] = 'error';
                        $return = new Response($data);
                        $return->setStatusCode(404);
                    }
                }else{
                    $data['message']['user'] = 'Invalid OTP';
                    $data['status'] = 'error';
                    $return = new Response($data);
                    $return->setStatusCode(404);
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

    public function forgotPassword(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                'email' => 'required|email'
            ];
            $validate = Validator::make($request->all(), $rules);
            if($validate->fails()){
                $return = new Response([
                    "status" => 'error',
                    "message" => $validate->errors()
                ]);
                $return->setStatusCode(422);
            } else {
                $email = $request->email;

                $query = DB::table('users')->where('email', $email);
                $user = $query->first();

                if($user){
                    $password = $this->getPassword(10);

                    $update = $query->update([
                        "password" => Hash::make($password)
                    ]);

                    $url = env('APPLICATION_URL');
                    $data = [
                        'userid'=> $email,
                        'subject' => 'Application employee Credentials',
                        'body' =>$password,
                        'url' => $url
                    ];

                    $emailTemplate = $this->configTableEmailTextInfoConnection->where("templateID", "PASSWORD_RESETTING")->first();

                    $body = $emailTemplate->body;
                    $body = str_replace("[APPLICATION_URL]", env('SERVER_URL'), $body);
                    $body = str_replace("[EMAIL]", $email, $body);
                    $body = str_replace("[PASSWORD]", $password, $body);

                    $subject = $emailTemplate->subject;

                    $this->send_mail($body, $subject, $email);

                    $return = new Response([
                        "status" => "success",
                        "message" => "Password reset successfully sent to email"
                    ]);
                    $return->setStatusCode(200);
                } else {
                    $return = new Response([
                        "status" => "error",
                        "message" => "User with email not found"
                    ]);
                    $return->setStatusCode(404);
                }
            }
        } else {
            $data['message'] = 'Request method not allowed';
            $data['status'] = 'error';
            $return = new Response([
                "status" => "error",
                "message" => "Request method not allowed"
            ]);
            $return->setStatusCode(405);
        }
        return $return;

    }

    public function reset_password(Request $request, $token="")
    {
        $id = $token;
        // dd($token);

        if($id){
            $user = User::where('password', $id);
            if($user->first()){
                $rules = [
                    'password' => 'required|min:8'
                ];
                $validate = Validator::make($request->all(), $rules);
                if($validate->fails()){
                    $data['status'] = 'error';
                    $data['message'] = $validate->errors();
                    $return = new Response($data);
                    $return->setStatusCode(400);
                } else {
                    $email = $user->first()->email;
                    $password = substr_replace(Hash::make($request->password),"$2a",0,3);
                    $user->update([
                        'password' => $password
                    ]);
                    /*
                    $email_data['name'] = explode('@', $email)[0];
                    $email_data['app_name'] = $request->server('HTTP_REFERER') ? explode('.', explode('/', $request->server('HTTP_REFERER'))[2])[0] : env('APP_NAME');
                    $htmlContent = env('PASSWORD_RESET_SUCCESS');
                    $htmlContent = str_replace('{{ $Email_name }}', $email_data['name'], $htmlContent);
                    $htmlContent = str_replace('{{ $Email_app_name }}', $email_data['app_name'], $htmlContent);
                    $this->send_mail_env('auth.auth.password_reset_success', $email_data, 'Successfull password reset', $email, 1, $htmlContent);

                    // $send_mail = $this->send_mail('emails.auth.password_reset_success', $email_data, 'Successfull password reset', $email, 1);
                    */

                    $return['status'] = 'success';
                    $return['message'] = 'Password reset successful';

                    $return = new Response($return);
                    $return->setStatusCode(200);
                }

            } else {
                $return['status'] = 'error';
                $return['message'] = "Invalid request";
                $return = new Response($return);
                $return->setStatusCode(404);
            }

        } else {
            $data['status'] = 'error';
            $data['message'] = 'reset token is required';

            $return = new Response($data);
            $return->setStatusCode(422);
        }

        return $return;
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
                // try {
                //     $return = JWTAuth::parseToken()->getPayload();
                // } catch (TokenInvalidException $e) {
                //     $return = new Response([
                //         "status" => "error",
                //         "message" => "Invalid token"
                //     ]);
                //     $return->setStatusCode(401);
                // } catch (TokenExpiredException $e) {
                //     $return = new Response([
                //         "status" => "error",
                //         "message" => "Token expired"
                //     ]);
                //     $return->setStatusCode(401);
                // } catch (\Exception $e) {
                //     $return = new Response([
                //         "status" => "error",
                //         "message" => "Token not found"
                //     ]);
                //     $return->setStatusCode(401);
                // } catch (\Throwable $th) {
                //     $return = new Response([
                //         "status" => "error",
                //         "message" => $th->getMessage()
                //     ]);
                //     $return->setStatusCode(401);
                // }

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

    public function logout(Request $request)
    {
        if($request->isMethod('POST')){
            $rules = [
                'email' => 'required|email'
            ];

            $validate = Validator::make($request->all(), $rules);

            if($validate->fails()){
                $data['status'] = 'error';
                $data['message'] = $validate->errors();

                $return = new Response($data);
                $return->setStatusCode(422);
            } else {
                $email = $request->email;
                $user = DB::table('users')->where('email', '=', $email)->first();

                if($user){
                    $userLogData = [
                        'userId' => $user->id,
                        'userEmail' => $user->email,
                        'action' =>  "LoggedOut"
                    ];

                    $logout = $this->ReportTableUserLogsConnection->insert($userLogData);
                }

                $return = new Response([
                    "status" => "success",
                    "message" => "Logged Out successfully"
                ]);
                $return->setStatusCode(200);
            }
        } else {
            $data['message'] = 'Request method not allowed';
            $data['status'] = 'error';
            $return = new Response($data);
            $return->setStatusCode(405);
        }
        return $return;
    }

}
