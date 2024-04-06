<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use JWTAuth;
use App\Http\Controllers\Auth\CustomUser;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Http;
use DB;
use File;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    protected $debugFlag = 1;

    public function generateJWT($user)
    {
        $encryption_key = env('APP_KEY');
        $time = time();
        $current_user = new CustomUser($user, $time);
        $token = JWTAuth::fromUser($current_user);
        return $token;
    }

    protected function gen_secret()
    {
        $length = 512;
        $val = '';
        for ($i = 0; $i < $length; $i++) {
            $val .= rand(0, 9);
        }
        $fp = fopen('/dev/urandom', 'rb');
        $val = fread($fp, 32);
        fclose($fp);
        $val .= uniqid(mt_rand(), true);
        $hash = hash('sha512', $val, true);
        $result = rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');
        return $result;
    }

    protected function send_mail($content, $subject, $to)
    {
        try {
            $name = env('APP_NAME');
            $from_email = env("MAIL_FROM_ADDRESS");
            $from_name = env('APP_NAME');

            Mail::html($content, function($message) use ($to, $subject, $from_email, $from_name) {
                $message->to($to)
                    ->from($from_email, $from_name)
                    ->subject($subject);
            });
        } catch (\Throwable $th) {
            return $th->getMessage();
        }
    }

    protected function send_sms($phone, $message)
    {
        try {
            $body = [
                'key' => 'b2177aadb4678c10f395c0a75691428e',
                'route' => 2,
                'sender' => 'AQMS',
                'number' => $phone,
                'sms' => $content,
                'templateid' => $template_id,
            ];
            $apiUrl = 'http://site.ping4sms.com/api/smsapi';
            $apiResponse = Http::post($apiUrl, $body);
            $apiBody = "";
            if ($apiResponse->successful()) {
                $apiBody = json_decode($apiResponse->body());
            }
            $return =array(
                "data" => $apiBody,
                "message" => 'Mail sent successfully!!!',
                'status' => "success"
            );
        } catch(\Exception $e){
            $return =array(
                "data" => "",
                "message" => $e->getMessage(),
                'status' => "error"
            );
        }
        return response()->json($return);
    }

    protected function send_otp($phone, $user_id)
    {
        try {
            $code = rand(1000, 9999);
            $exist = DB::table('user_otp')->where('user_id', '=', $user_id)->first();
            $data1 = array(
                'user_id' => $user_id,
                'code' => $code
            );
            if ($exist) {
                $data1['updated_at'] = date('Y-m-d h:i:s');
                DB::table('user_otp')->where('user_id', '=', $user_id)->update($data1);
            } else {
                $data1['created_at'] = date('Y-m-d h:i:s');
                DB::table('user_otp')->insert($data1);
            }
            $message = "2FA login code is ". $code;
            $sms = [];
            // $sms = $this->send_sms($phone, $message);
            $return =array(
                "data" => $sms,
                "message" => 'SMS sent successfully!!!',
                'status' => "success"
            );
        } catch(\Exception $e){
            $return =array(
                "data" => "",
                "message" => $e->getMessage(),
                'status' => "error"
            );
        }
        return $return;
    }

    public function get_const_data($file_name)
    {
       // return json_decode(File::get(resource_path() . '/constants/'. $file_name));
       return;
    }

    //internal function not called from outside.
    public function getAllInfo() {
        $response=[];

        $response['appVersion']  = DB::connection('mysqlAqms')
            ->table('applicationVersions')
            ->select('versionNumber', 'summary', 'userManual', 'createdAt' )
            ->orderBy('id', 'DESC')
            ->first();

        $response['location']  = DB::connection('mysqlConfig')
            ->table('locations')
            ->select('id', 'id AS locationID', 'locationName', 'coordinates', 'image', 'parentID' )
            ->get();

        $response['branch']  = DB::connection('mysqlConfig')
            ->table('branches')
            ->select('id', 'locationID', 'id AS branchID', 'branchName', 'coordinates', 'image', 'parentID' )
            ->get();

        $response['facility']  = DB::connection('mysqlConfig')
            ->table('facilities')
            ->select( 'id', 'locationID', 'branchID', 'id AS facilityID', 'facilityName','coordinates', 'image', 'parentID' )
            ->get();

        $response['building']  = DB::connection('mysqlConfig')
            ->table('buildings')
            ->select('id', 'locationID', 'branchID', 'facilityID', 'id AS buildingID', 'buildingName' ,'coordinates', 'image', 'parentID' )
            ->get();

        $response['floor']  = DB::connection('mysqlConfig')
            ->table('floors')
            ->select( 'id', 'locationID', 'branchID',  'facilityID', 'buildingID', 'id AS floorID', 'floorName', 'coordinates', 'image' , 'parentID' )
            ->get();

        $response['zone']  = DB::connection('mysqlConfig')
            ->table('zones')
            ->select('id', 'locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'id AS zoneID', 'zoneName', 'coordinates', 'image', 'parentID', 'isAQI', 'aqiValue' )
            ->get();

        $response['devices']  = DB::connection('mysqlConfig')
            ->table('devices')
            ->select('id', 'locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID', 'id as deviceID', 'deviceName', 'coordinates', 'image', 'parentID', 'categoryID', 'deviceCategory', 'connStatus', 'deviceTag', 'deviceMode', 'disconnectionStatus', 'notificationShow', 'disconnectedOnGrid' )
            ->get();

        $response['sensors']  = DB::connection('mysqlConfig')
            ->table('sensors')
            ->select('id', 'locationID', 'branchID', 'facilityID', 'buildingID', 'floorID', 'zoneID', 'deviceID', 'id as sensorID', 'parentID', 'sensorName', 'sensorTag', 'sensorCategory', 'alarmType',  'sensorCategory' , 'units' , 'isStel', 'isTwa', 'stelInfo', 'twaInfo', 'warningAlertInfo', 'criticalAlertInfo', 'outofRangeAlertInfo', 'digitalAlertInfo', 'sensorOutput')
            ->get();

        return $response;
    }

    public function getPassword($n) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < $n; $i++) {
            $index = rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }

    public function getModeNumber($deviceMode)
    {
        $return = 2; // Enable mode
        switch ($deviceMode) {
            case 'config':
                $return = 1;
                break;
            case 'enabled':
                $return = 2;
                break;
            case 'disabled':
                $return = 3;
                break;
            case 'firmwareUpgradation':
                $return = 4;
                break;
            case 'debug':
                $return = 5;
                break;
            case 'bumpTest':
                $return = 6;
                break;
            case 'calibration':
                $return = 7;
                break;
            case 'eventLog':
                $return = 8;
                break;
            default:
                $return = 2;
                break;
        }

        return $return;
    }

}
