<?php

namespace App\Http\Controllers;
use App\Http\Controllers\LogController;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
// use JWTAuth;

class CoreController extends Controller
{
    // protected $jwtToken;
    // protected $logController;
    // protected $configTransactionsConnection;

    public function __construct()
    {

    }

    public function healthCheck(Request $request){
        try{
            // if($this->debugFlag){ $funcStartTime = microtime(true); \DB::connection('mysqlTms')->enableQueryLog(); \DB::connection('mysqlConfig')->enableQueryLog();};

            $response = [];
            $response['data'] = "Good";

            // if($this->debugFlag){ $response['query'] = DB::connection('mysqlTms')->getQueryLog() ; $response['query'][] = DB::connection('mysqlConfig')->getQueryLog() ; $funcEndTime = microtime(true); $functionTimer = ['StartTime' => $funcStartTime, 'EndTime'=>$funcEndTime, 'Exec Time' => ($funcEndTime - $funcStartTime)]; $response['time'] = $functionTimer; };
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