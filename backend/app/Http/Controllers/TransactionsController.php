<?php

namespace App\Http\Controllers;
use App\Http\Controllers\LogController;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

use DB;
use JWTAuth;

class TransactionsController extends Controller
{
    protected $jwtToken;
    protected $logController;
    protected $configTransactionsConnection;

    public function __construct(LogController $logController)
    {
        // $this->jwtToken = JWTAuth::parseToken()->getPayload();
        $this->logController = $logController;
        $this->configTransactionsConnection = DB::connection('mysqlConfig')->table('transaction');
    }

    public function listTransactions(Request $request, $id)
    {
        if($request->isMethod('POST')){
            try {
                $data = [];
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

    public function addTransactions(Request $request)
    {
        $rules = [
            "paymentGatewayId" => "nullable",
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

                $deviceName = $request->input('name');
                $deviceID = null;                
                $deviceDetails = DB::connection('mysqlConfig')->table('devices')
                    ->where('deviceTag', '=', $deviceName)->first();

                if($deviceDetails){
                    $deviceID = $deviceDetails->id;
                }

                $data_arr = array(
                    'transactionID' => $request->input('chanId'), 
                    'deviceID' => $deviceID, 
                    // 'userID' => $request->input('userID'), 
                    'paymentGatewayID' => $request->input('paymentGatewayId'), 
                    'chanID' => $request->input('chanId'), 
                    // 'firstName' => $request->input('firstName'), 
                    // 'lastName' => $request->input('lastName'), 
                    // 'amount' => $request->input('amount'), 
                    // 'currencyCode' => $request->input('currencyCode'), 
                    // 'transactionType' => $request->input('transactionType'), 
                    // 'cardEntryType' => $request->input('cardEntryType'), 
                    // 'cardType' => $request->input('cardType'), 
                    // 'maskedPan' => $request->input('maskedPan'), 
                    // 'oarData' => $request->input('oarData'), 
                    // 'ps2000Data' => $request->input('ps2000Data'), 
                    // 'isFallback' => $request->input('isFallback'), 
                    // 'transactionDate' => $request->input('transactionDate'), 
                    // 'cardScheme' => $request->input('cardScheme'), 
                    // 'creditSurchargeStatus' => $request->input('creditSurchargeStatus'), 
                    // 'expDate' => $request->input('expDate'), 
                    // 'result' => $request->input('result')
                );
                
                $create = $this->configTransactionsConnection->insert($data_arr);

                $result = new Response([
                    "status" => "success",
                    "message" => "Added successfully",
                    "data" => $data_arr
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
            "paymentGatewayId" => "nullable",
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
                $paymentGatewayCommand =  @$request->input('paymentGatewayCommand');
                $paymentTransactionData = @$paymentGatewayCommand['paymentTransactionData'];
                if($paymentTransactionData){  
                    if($paymentTransactionData['result'] != "FAILED" ){
                        // $deviceID = null;                
                        $data_arr = array(
                            // 'transactionID' => $request->input('chanId'), 
                            // 'deviceID' => $deviceID, 
                            // 'userID' => $request->input('userID'), 
                            // 'paymentGatewayID' => $request->input('paymentGatewayId'), 
                            // 'chanID' => $request->input('chanId'), 
                            'firstName' => @$paymentTransactionData['firstName'], 
                            'lastName' => @$paymentTransactionData['lastName'], 
                            'amount' => @$paymentTransactionData['amount']['value'], 
                            'currencyCode' => @$paymentTransactionData['amount']['currencyCode'], 
                            'transactionType' => @$paymentTransactionData['transactionType'], 
                            'cardEntryType' => @$paymentTransactionData['cardEntryType'], 
                            'cardType' => @$paymentTransactionData['cardType'], 
                            'maskedPan' => @$paymentTransactionData['maskedPan'], 
                            'oarData' => @$paymentTransactionData['oarData'], 
                            'ps2000Data' => @$paymentTransactionData['ps2000Data'], 
                            'isFallback' => @$paymentTransactionData['isFallback'], 
                            'transactionDate' => @$paymentTransactionData['transactionDate'], 
                            'cardScheme' => @$paymentTransactionData['cardScheme'], 
                            'creditSurchargeStatus' => @$paymentTransactionData['creditSurchargeStatus'], 
                            'expDate' => @$paymentTransactionData['expDate'], 
                            'result' => @$paymentTransactionData['result'],
                            'transactionJson' => json_encode($paymentTransactionData)
                        );
                    }else{
                        $data_arr = array(
                            'result' => @$paymentTransactionData['result'],
                            'transactionJson' => json_encode($paymentTransactionData)
                        );
                    }
                    $create = $this->configTransactionsConnection->where('chanID', '=', $id)->update($data_arr);
                }

                $result = new Response([
                    "status" => "success",
                    "message" => "Updated successfully",
                    "data" => @$paymentTransactionData['result']
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

    public function updateTransactionsOld(Request $request, $id)
    {
        $result = new Response([
            "status" => "",
            "message" => ""
        ]);
        $result->setStatusCode(200);

        if($request->isMethod('POST')){
            $rules = [
                "paymentID" => "required",
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

}
