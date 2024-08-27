<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
use JWTAuth;

class AuthController extends Controller
{

    public function __construct(){

    }

    public function login( Request $request){
        $rules = [
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
            try {
                $data = [];
                $deviceID = $request->input('deviceID');
                $devices = DB::connection('mysql')
                    ->table('devices')
                    ->where('deviceAuthID', '=', $deviceID);
                if($devices->count() > 0){
                    $token = $this->generateJWT($devices->first());
                    // $cookie = cookie('jwt', $token, 60*24);

                    $data['access_token'] = $token;
                    $data['status'] = 'success';
                    $data['message'] = 'Device token created successfully !!';

                    $result = new Response($data);
                    $result->setStatusCode(200);
                }else{
                    throw new \Exception('Invalid device');
                }
            } catch (\Throwable $th) {
                $result = new Response([
                    "status" => "error",
                    "message" => $th->getMessage()
                ]);
                $result->setStatusCode(500);
            }
        }
        return $result;
    }




}