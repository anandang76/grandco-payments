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
        $this->configTransactionsConnection = DB::connection('mysqlConfig')->table('transactions');
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
                $deviceDetails = DB::connection('mysqlConfig')->table('devices')
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
