<?php

namespace App\Http\Controllers\UTILITY;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AlertCron;
use App\Models\Device;
use App\Models\labDepartment;
use App\Models\Floor;
use App\Models\Building;
use Illuminate\Support\Facades\DB; 
use Carbon\Carbon;

class DataUtilityController extends Controller
{
    protected $total = "";
    protected $page = "";
    protected $perPage = "";
    protected $result = "";  
    protected $sort = "";   
    protected $column = ""; 
    protected $aqiIndex = ""; 
    protected $sensorCount = 0;
    protected $alertCount = 0;
    protected $disconnectedDevices = 0;
    protected $labHooterStatus = 1;
    protected $returnedData = [];
    protected $imageBuildingURL = "";
    protected $imageFloorURL = "";
    protected $imageLabURL = "";
    
    function __construct($request,$query) {
        $device_max_aqi=array();
        if($query) {            
            if($request->zoneID != ''){
                // fetch lab image
                $lab = labDepartment::where('id', $request->zoneID)->first(); 
                if($lab){
                    $this->imageLabURL = $lab->labDepMap;
                }
            } else if($request->floorID != ""){
                // fetch floor image Floor
                $floor = Floor::where('id', $request->floorID)->first(); 
                if($floor){
                    $this->imageFloorURL = $floor->floorMap;
                }
            } else if($request->buildingID != ''){
                // fetch building image
                $building = Building::where('id', $request->buildingID)->first(); 
                if($building){
                    $this->imageBuildingURL = $building->buildingImg;
                }
            }
            
            if($request->zoneID != ""){
                
                $devices = $query->get();
                $length = count($devices);      
                
                for($x=0;$x<$length;$x++){
                    $deviceID = $devices[$x]->id;
                    $companyCode = $devices[$x]->companyCode;
                    $alertCount = 1;
                    $alertQuery = AlertCron::select('*')
                     ->where('deviceID','=',$deviceID)
                     ->where('companyCode','=',$companyCode)
                     ->where('status','=','0')
                     ->take(100)
                     ->get();
                    
                    $alertCount = count($alertQuery);
                    $this->alertCount += $alertCount;
                }
               
                $deviceQuery = Device::select('*')
                     ->where('zoneID','=',$request->zoneID)
                     ->where('companyCode','=',$request->Header('companyCode'))
                     ->where('disconnectedStatus','=','1')
                     ->get();
                     
                $this->disconnectedDevices = $deviceQuery->count();
                
                $labQuery =  DB::table('lab_departments')
                             ->where('id','=',$request->zoneID)
                             ->where('companyCode','=',$request->Header('Companycode'))
                             ->first();
                             
               //(int)$this->labHooterStatus = $labQuery->labHooterStatus;
               //anand
               (int)$this->labHooterStatus = 0;
            }
            
            $this->perPage = $request->input(key:'perPageData') == "" ? 100 : $request->input(key:'perPageData');
            $this->sort = $request->input(key:'sort') == "" ? "ASC" : $request->input(key:'sort');
            $this->column = $request->input(key:'column') == "" ? "id" : $request->input(key:'sort');
            $query->orderBy($this->column,$this->sort);
            
            $this->page = $request->input(key:'page', default:1);
            $this->total = $query->count();    
            $this->result = $query->offset(value:($this->page - 1) * $this->perPage)->limit($this->perPage)->get();   
            
            //only for devices getting alertcount
            if($request->zoneID != ""){
                $deviceData = array();
                
                $deviceCount = count($this->result);
            
                for($x=0;$x<$deviceCount;$x++){
                    $deviceAlertCount = DB::table('alert_crons')
                        ->selectRaw('count(*) as alertCount')
                        ->where('deviceID','=',$this->result[$x]->id)
                        ->where('status','=','0')
                        ->get();
                      
                    $this->result[$x]['alertDataCount'] = $deviceAlertCount[0]->alertCount;
                    $deviceData[] = $this->result[$x];
                }
                
                $this->result = $deviceData;
            }
            // search aqi index api start
           
            if($request->locationID != "" && $request->branchID != "" && $request->facilityID != ""  && $request->buildingID !="" && $request->floorID !="" && $request->zoneID !=""){
              
                $labData = array();
                $deviceCount = count($this->result);
                $labAQIvalues=array();
                
                // Modified on 24-04-2023
                $sensorsList = array();
                for($i=0; $i<count($this->result); $i++)
                {
                    $data = DB::table('Aqi_values_per_deviceSensor')
                        ->select('Aqi_values_per_deviceSensor.sensorId','s.sensorNameUnit')
                        ->distinct()
                        ->join('sensors as s','s.id','=','Aqi_values_per_deviceSensor.sensorId')
                        ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
                        ->where('Aqi_values_per_deviceSensor.deviceID', $this->result[$i]->id)
                        ->get();
                        
                    if($data){
                       foreach($data as $k => $v){
                           $sensorsList[] = $v;
                       }
                    }
                } 
                
                $maxAverage = array();
                for($i=0; $i<count($sensorsList); $i++)
                {
                    $calculate = false;
                    
                    if($sensorsList[$i]->sensorNameUnit == 'CO' || $sensorsList[$i]->sensorNameUnit == 'O3'){
                        
                        $data = DB::table('Aqi_values_per_deviceSensor')
                            ->select(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00') AS hour"), DB::raw("AVG(AqiValue) AS average"))
                            ->where('sampled_date_time', '>=', Carbon::now()->subHours(24))
                            ->where('sensorId', $sensorsList[$i]->sensorId)
                            ->where('AqiValue','!=','0')
                            ->groupBy(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00')"))
                            ->orderBy('hour', 'ASC')
                            ->get();
                            
                        if(count($data) >= 8){
                            $calculate = true;
                        }
        
                    }else{
                         $data = DB::table('Aqi_values_per_deviceSensor')
                            ->select(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00') AS hour"), DB::raw("AVG(AqiValue) AS average"))
                            ->where('sampled_date_time', '>=', Carbon::now()->subHours(24))
                            ->where('sensorId', $sensorsList[$i]->sensorId)
                            ->where('AqiValue','!=','0')
                            ->groupBy(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00')"))
                            ->orderBy('hour', 'ASC')
                            ->get();
                            
                        if(count($data) >= 16){
                            $calculate = true;
                        }
                    }
                    
                    if($calculate == true){
                        $maxAverage[] = $data->avg('average');
                    }
                }
                
                if($maxAverage)
                {
                    $max = round(max($maxAverage), 0);
                    $this->aqiIndex =  "$max";
                }
                else
                {
                    $this->aqiIndex =  "0";
                }
            }
            
            else if($request->locationID != "" && $request->branchID != "" && $request->facilityID != ""  && $request->buildingID !="" && $request->floorID !=""){
            
                // modified on 24-04-2023
                $labData = array();
                $labCount = count($this->result);
                $labAQIvalues=array();

                for($x=0; $x<$labCount;$x++){
                    $sensors = array();
                    $deviceData = array();
                    $aqi = DB::table('Aqi_values_per_deviceSensor')
                        ->select('Aqi_values_per_deviceSensor.sensorId','s.sensorNameUnit')
                        ->distinct()
                        ->join('sensors as s','s.id','=','Aqi_values_per_deviceSensor.sensorId')
                        ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
                        ->where('labId', $this->result[$x]->id)
                        ->get();
                                    
                    foreach($aqi as $id){
                        $sensors[] = $id;
                    }
                    
                    for($i=0; $i<count($sensors); $i++)
                    {
                        $calculate = false;
                        
                        if($sensors[$i]->sensorNameUnit == 'CO' ||$sensors[$i]->sensorNameUnit == 'O3'){
                            $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                
                            if(count($data) >= 8){
                                $calculate = true;
                            }
            
                        }else{
                            $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                
                            if(count($data) >= 16){
                                $calculate = true;
                            }
                        }
                        
                        if($calculate == true){
                            $deviceData[] = $data->avg('average');
                        }
                    }
                      
                    if(!$deviceData || max($deviceData) == 0){
                        $this->result[$x]->aqiIndex = "NA";
                    }else{
                        $this->result[$x]->aqiIndex = number_format(max($deviceData),0);
                    }
                }
            }

            else if($request->locationID != "" && $request->branchID != "" && $request->facilityID != ""  && $request->buildingID !=""){ 
                
                // Modified on 25-04-2023
                $labData = array();
                $floorCount = count($this->result);
                $labList = array();
                
                for($x=0; $x<$floorCount; $x++)
                {
                    $sensors = array();
                    $deviceData = array();
                    $labList = DB::table('lab_departments')
                        ->where('floorID','=',$this->result[$x]->id)
                        ->get();
                        
                    for($j=0; $j<count($labList); $j++){
                        
                        $data = array();
                        $deviceData = array();
                        $aqi = DB::table('Aqi_values_per_deviceSensor')
                            ->select('Aqi_values_per_deviceSensor.sensorId','s.sensorNameUnit')
                            ->distinct()
                            ->join('sensors as s','s.id','=','Aqi_values_per_deviceSensor.sensorId')
                            ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
                            ->where('labId', $labList[$j]->id)
                            ->get();
                                        
                        foreach($aqi as $id){
                            $sensors[] = $id;
                        }
                        
                        for($i=0; $i<count($sensors); $i++)
                        {
                            $calculate = false;
                            
                            if($sensors[$i]->sensorNameUnit == 'CO' ||$sensors[$i]->sensorNameUnit == 'O3'){
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 8){
                                    $calculate = true;
                                }
                
                            }else{
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 16){
                                    $calculate = true;
                                }
                            }
                            
                            if($calculate == true){
                                $deviceData[] = $data->avg('average');
                            }
                        }  
                    }
                    
                    if(!$deviceData || max($deviceData) == 0){
                            $this->result[$x]->aqiIndex = "NA";
                    }else{
                        $this->result[$x]->aqiIndex = number_format(max($deviceData),0);
                    }
                }
            }
            
            else if($request->locationID != "" && $request->branchID != "" && $request->facilityID != ""){
                
                // Modified on 25-04-2023
                $labData = array();
                $buidingCount = count($this->result);
                $labAQIvalues=array();
                
                for($x=0; $x<$buidingCount; $x++)
                {
                    $sensors = array();
                    $deviceData = array();
                    $labList = array();
                    $labList = DB::table('lab_departments')
                        ->where('locationID','=',$request->locationID)
                        ->where('branchID','=',$request->branchID)
                        ->where('facilityID','=',$request->facilityID)
                        ->where('buildingID','=',$this->result[$x]->id)
                        ->get();
                        
                        
                    for($j=0; $j<count($labList); $j++)
                    {
                        $data = array();
                        $deviceData = array();
                        $aqi = DB::table('Aqi_values_per_deviceSensor')
                            ->select('Aqi_values_per_deviceSensor.sensorId','s.sensorNameUnit')
                            ->distinct()
                            ->join('sensors as s','s.id','=','Aqi_values_per_deviceSensor.sensorId')
                            ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
                            ->where('labId', $labList[$j]->id)
                            ->get();
                                        
                        foreach($aqi as $id){
                            $sensors[] = $id;
                        }
                            
                        for($i=0; $i<count($sensors); $i++)
                        {
                            $calculate = false;
                            
                            if($sensors[$i]->sensorNameUnit == 'CO' ||$sensors[$i]->sensorNameUnit == 'O3'){
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 8){
                                    $calculate = true;
                                }
                
                            }else{
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 16){
                                    $calculate = true;
                                }
                            }
                            
                            if($calculate == true){
                                $deviceData[] = $data->avg('average');
                            }
                        }  
                    }
                    
                    if(!$deviceData || max($deviceData) == 0){
                        $this->result[$x]->aqiIndex = "NA";
                    }else{
                        $this->result[$x]->aqiIndex = number_format(max($deviceData),0);
                    }
                }
            }
            
            else if($request->locationID != "" && $request->branchID != ""){                 
                
                // Modified on 24-04-2023
                $labData = array();
                $facilityCount = count($this->result);
                $labList = array();
                $sensors = array();
                
                for($x=0; $x<$facilityCount; $x++)
                {
                    $sensors = array();
                    $deviceData = array();
                    $labList = array();
                    $labList = DB::table('lab_departments')
                        ->where('locationID','=',$request->locationID)
                        ->where('branchID','=',$request->branchID)
                        ->where('facilityID','=',$this->result[$x]->id)
                        ->get();
                        
                        
                    for($j=0; $j<count($labList); $j++)
                    {
                        $data = array();
                        $deviceData = array();
                        $aqi = DB::table('Aqi_values_per_deviceSensor')
                            ->select('Aqi_values_per_deviceSensor.sensorId','s.sensorNameUnit')
                            ->distinct()
                            ->join('sensors as s','s.id','=','Aqi_values_per_deviceSensor.sensorId')
                            ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
                            ->where('labId', $labList[$j]->id)
                            ->get();
                                        
                        foreach($aqi as $id){
                            $sensors[] = $id;
                        }
                            
                        for($i=0; $i<count($sensors); $i++)
                        {
                            $calculate = false;
                            
                            if($sensors[$i]->sensorNameUnit == 'CO' ||$sensors[$i]->sensorNameUnit == 'O3'){
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 8){
                                    $calculate = true;
                                }
                
                            }else{
                                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                                    
                                if(count($data) >= 16){
                                    $calculate = true;
                                }
                            }
                            
                            if($calculate == true){
                                $deviceData[] = $data->avg('average');
                            }
                        }  
                    }
                    
                    if(!$deviceData || max($deviceData) == 0){
                        $this->result[$x]->aqiIndex = "NA";
                    }else{
                        $this->result[$x]->aqiIndex = number_format(max($deviceData), 0);
                    }
                }
            }
        
            else if($request->locationID != ""){  
               
                $labData = array();
        		$branchCount = count($this->result);
        		$labList = array();
        		$sensors = array();
        		$deviceData = [];
        		$avgCount = [];
        		
        		for ($z = 0; $z < $branchCount; $z++) {
        		    $avgCount = [];
        		    
        		    $facilityCount = DB::table('facilities')
        			->where('locationID', '=', $request->locationID)
        			->where('branchID', '=', $this->result[$z]->id)
        			->get();
        
        		    foreach ($facilityCount as $facility) {
        			$labList = DB::table('lab_departments')
        			    ->where('locationID', '=', $request->locationID)
        			    ->where('branchID', '=', $facility->branchID) // Use $facility->branchID
        			    ->where('facilityID', '=', $facility->id)
        			    ->get();
        
        			foreach ($labList as $lab) {
        			    $deviceData = [];
        			    
        			    $aqi = DB::table('Aqi_values_per_deviceSensor')
        				->select('Aqi_values_per_deviceSensor.sensorId', 's.sensorNameUnit')
        				->distinct()
        				->join('sensors as s', 's.id', '=', 'Aqi_values_per_deviceSensor.sensorId')
        				->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())				->where('labId', $lab->id) // Use $lab->id
        				->get();
        
        			    foreach ($aqi as $id) {
        				    $sensors[] = $id;
        			    }
        
        			    foreach ($sensors as $sensor) {
            				$calculate = false;
            
            				$data = $this->getInfo($sensor->sensorId, 24);
            
            				if ($sensor->sensorNameUnit == 'CO' || $sensor->sensorNameUnit == 'O3') {
            				    if (count($data) >= 8) {
            				        $calculate = true;
            				    }
            				} else {
            				    if (count($data) >= 16) {
            				        $calculate = true;
            				    }
            				}
            
            				if ($calculate) {
            				    $deviceData[] = $data->avg('average');
            				}
        			    }
        
        			    if ($deviceData) {
        				$avgCount[] = max($deviceData);
        			    }
        			}
        		    }
        
        		    if (empty($avgCount) || max($avgCount) == 0) {
        			    $this->result[$z]->aqiIndex = "NA";
        		    } else {
            			$average = collect($avgCount)->avg();
            			$this->result[$z]->aqiIndex = number_format($average, 0);
        		    }
        		}
            }
            
            else {
                $locCount = count($this->result);
        		$labList = array();
        		$sensors = array();
        		$deviceData = [];
        		$avgCount = [];
        		
        		for ($z = 0; $z < $locCount; $z++) {
        		    $avgCount = [];
        		    
        		    $branchCount = DB::table('branches')
        			->where('locationID', '=', $this->result[$z]->id)
        			->get();
        
        		    foreach ($branchCount as $branch) {
        		        $labList = DB::table('lab_departments')
        		            ->where('locationID', '=', $branch->locationID)
        		            ->where('branchID', '=', $branch->id) // Use $branch->branchID
        		            ->get();
        
        		        foreach ($labList as $lab) {
        		            $deviceData = [];
        		            
        		            $aqi = DB::table('Aqi_values_per_deviceSensor')
        				    ->select('Aqi_values_per_deviceSensor.sensorId', 's.sensorNameUnit')
        				    ->distinct()
        				    ->join('sensors as s', 's.id', '=', 'Aqi_values_per_deviceSensor.sensorId')
        				    ->where('Aqi_values_per_deviceSensor.sampled_date_time', '>=' ,Carbon::now()->subMinutes(1440)->toDateTimeString())
        				    ->where('labId', $lab->id) // Use $lab->id
        				    ->get();
        
        		            foreach ($aqi as $id) {
        		                $sensors[] = $id;
        		            }
        
        		            foreach ($sensors as $sensor) {
        		                $calculate = false;
        
        		                $data = $this->getInfo($sensor->sensorId, 24);
        
        		                if ($sensor->sensorNameUnit == 'CO' || $sensor->sensorNameUnit == 'O3') {
        		                    if (count($data) >= 8) {
        		                        $calculate = true;
        		                    }
        		                } else {
        		                    if (count($data) >= 16) {
        		                        $calculate = true;
        		                    }
        		                }
        
        		                if ($calculate) {
        		                    $deviceData[] = $data->avg('average');
        		                }
        		            }
        
        		            if ($deviceData) {
        		                $avgCount[] = max($deviceData);
        		            }
        		        }
        		    }
        		    if (empty($avgCount) || max($avgCount) == 0) {
        			    $this->result[$z]->aqiIndex = "NA";
        		    } else {
        			$average = collect($avgCount)->avg();
        			    $this->result[$z]->aqiIndex = number_format($average, 0);
        		    }
        		}
            }
        }
    }    

    function getData(){
       return $returnedData[] = array(
                "data"=>$this->result,
                "sortedType"=>$this->sort,
                "totalData"=>$this->total,
                "perPageData"=>$this->perPage,
                "page"=>$this->page,
                "lastPage"=>ceil(num:$this->total/ $this->perPage),
                "alertCount"=>$this->alertCount,
                "disconnectedDevices"=>$this->disconnectedDevices,
                "labHooterStatus"=>$this->labHooterStatus,
                "aqiIndex"=>$this->aqiIndex,
                "imageBuildingURL"=>$this->imageBuildingURL,
                "imageFloorURL"=>$this->imageFloorURL,
                "imageLabURL"=>$this->imageLabURL,
       );
    }
    
    
    public function getInfo($sensor, $hour)
    {
        $data = DB::table('Aqi_values_per_deviceSensor')
            ->select(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00') AS hour"), DB::raw("AVG(AqiValue) AS average"))
            ->where('sampled_date_time', '>=', Carbon::now()->subHours($hour))
            ->where('sensorId', $sensor)
            ->where('AqiValue','!=','0')
            ->groupBy(DB::raw("DATE_FORMAT(sampled_date_time, '%Y-%m-%d %H:00:00')"))
            ->orderBy('hour', 'ASC')
            ->get();
        
        return $data;
    }
    
    
    public function getSensorDetails($sensors)
    {
        $calculate = false;
        
        for($i=0; $i<count($sensors); $i++)
        {
            if($sensors[$i]->sensorNameUnit == 'CO' ||$sensors[$i]->sensorNameUnit == 'O3'){
                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                    
                if(count($data) >= 8){
                    $calculate= true;
                    break;
                }

            }else{
                $data = $this->getInfo($sensors[$i]->sensorId, 24);
                    
                if(count($data) >= 16){
                    $calculate = true;
                    break;
                }
            }
        } 
        
        return $calculate;
    }
}