<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
use JWTAuth;

class SaleController extends Controller
{
    protected $jwtPayload;
    protected $deviceID;
    protected $deviceName;
    protected $deviceAuthID;

    protected $configTransactionsConnection;

    
    public function __construct()
    {
        $this->configTransactionsConnection = DB::connection('mysql')->table('transactions');

        try {
            $user = JWTAuth::parseToken()->authenticate();
            $payload = JWTAuth::parseToken()->getPayload();
            $this->jwtPayload = JWTAuth::parseToken()->getPayload();
            $this->deviceID = $this->jwtPayload['id'];
            $this->deviceName = $this->jwtPayload['deviceName'];
            $this->deviceAuthID = $this->jwtPayload['deviceAuthID'];

            // Session::put('JWT', $payload);
            // $request->attributes->add(['jwtPayload' => $payload]);
            // dd($request);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Invalid token'], 401);
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token not found'], 401);
        }
    }

    public function listTransactions(Request $request, $id)
    {
        try {
            $data = [];
            $result = new Response([
                "status" => "success",
                "data" => $data,
                "message" => "Transaction list!!"
            ]);
            $result->setStatusCode(200);
        } catch (\Throwable $th) {
            $result = new Response([
                "status" => "error",
                "message" => $th->getMessage()
            ]);
            $result->setStatusCode(500);
        }
        return $result;
    }

    public function addTransactions(Request $request)
    {
        $rules = [
            "paymentInfo" => "required",
            "cardReaderInfo" => "required",
            "chanId" => "required",
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
                $customerID = $request->header('Customer-ID');

                $cardReaderInfo = $request->input('cardReaderInfo');
                $deviceName = $cardReaderInfo['name'];
                $deviceID = null;                
                $deviceDetails = DB::connection('mysql')->table('devices')
                    ->where('deviceTag', '=', $deviceName)->first();
                if($deviceDetails){
                    $deviceID = $deviceDetails->id;
                }
                $paymentInfo = $request->input('paymentInfo');
                $baseTransactionAmount = $paymentInfo['baseTransactionAmount'];
                $data_arr = array(
                    'customerID' => $customerID,
                    'transactionID' => $request->input('chanId'), 
                    'chanID' => $request->input('chanId'),  
                    'deviceID' => $deviceID, 
                    'cardReaderName' => $deviceName,
                    'paymentGatewayID' => $paymentInfo['paymentGatewayId'], 
                    'transactionType' =>  $paymentInfo['transactionType'], 
                    'amount' => @$baseTransactionAmount['value'], 
                    'currencyCode' => @$baseTransactionAmount['currencyCode'], 
                    'expDate' => date('Y-m-d H:i:s'), 
                    'result' => "PENDING"
                );
                $create = $this->configTransactionsConnection->insert($data_arr);
                $result = new Response([
                    "status" => "success",
                    "message" => "Added successfully",
                    "data_arr" => $data_arr,
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
        return $result;
    }

    public function updateTransactions(Request $request, $id)
    {
        $rules = [
            "paymentInfo" => "required",
        ];
        $validate = Validator::make($request->all(), $rules);
        if($validate->fails()){
            $result = new Response([
                "status" => "error",
                "message" => $validate->errors()
            ]);
            $result->setStatusCode(200);
        } else {
            try {
                $data = $request->post();
                $paymentInfo = $request->input('paymentInfo');
                if($paymentInfo){  
                    if($paymentInfo['result'] != "FAILED" ){
                        // $deviceID = null;                
                        $data_arr = array(
                            'firstName' => @$paymentInfo['firstName'], 
                            'lastName' => @$paymentInfo['lastName'], 
                            'amount' => @$paymentInfo['amount']['value'], 
                            'currencyCode' => @$paymentInfo['amount']['currencyCode'], 
                            'transactionType' => @$paymentInfo['transactionType'], 
                            'cardEntryType' => @$paymentInfo['cardEntryType'], 
                            'cardType' => @$paymentInfo['cardType'], 
                            'maskedPan' => @$paymentInfo['maskedPan'], 
                            'oarData' => @$paymentInfo['oarData'], 
                            'ps2000Data' => @$paymentInfo['ps2000Data'], 
                            'isFallback' => @$paymentInfo['isFallback'], 
                            'transactionDate' => @$paymentInfo['transactionDate'], 
                            'cardScheme' => @$paymentInfo['cardScheme'], 
                            'creditSurchargeStatus' => @$paymentInfo['creditSurchargeStatus'], 
                            'expDate' => @$paymentInfo['expDate'], 
                            'result' => @$paymentInfo['result'],
                            'transactionJson' => json_encode($paymentInfo)
                        );
                    }else{
                        $data_arr = array(
                            'result' => @$paymentInfo['result'],
                            'transactionJson' => json_encode($paymentInfo)
                        );
                    }
                    $create = $this->configTransactionsConnection->where('chanID', '=', $id)->update($data_arr);
                    $result = new Response([
                        "status" => "success",
                        "message" => "Updated successfully",
                        "data" => @$paymentInfo['result']
                    ]);
                }else{
                    $result = new Response([
                        "status" => "error",
                        "message" => "Payment info required",
                        "data" => []
                    ]);
                }
                $result->setStatusCode(200);
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