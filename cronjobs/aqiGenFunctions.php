<?php

const AQI_PARAMS_ARRAY =  array("PM2.5", "PM10", "SO2", "NO2", "CO", "O3", "NH3", "Pb");
/*
// This is the normal AQI Standard values.  Currently taking from DB AQI table.
$aqiConstParams=[
    "AQI"=>[ "GOOD"=>[0,50], "SATISFACTORY"=>[51,100], "MODERATE"=>[101,200],  "POOR"=>[201,300], "VERY_POOR"=>[301,400], "SEVERE"=>[401,500]  ],
    "PM10"=>[ "GOOD"=>[0,50], "SATISFACTORY"=>[51,100], "MODERATE"=>[101,250],  "POOR"=>[251,350], "VERY_POOR"=>[351,430], "SEVERE"=>[431,510]  ],
    "PM2.5"=>[ "GOOD"=>[0,30], "SATISFACTORY"=>[31,60], "MODERATE"=>[61,90],  "POOR"=>[91,120], "VERY_POOR"=>[121,250], "SEVERE"=>[251,380]  ],
    "NO2"=>[ "GOOD"=>[0,0.0213], "SATISFACTORY"=>[0.0214,0.0426], "MODERATE"=>[0.0427,0.0957],  "POOR"=>[0.0958,0.1489], "VERY_POOR"=>[0.1490,0.2128], "SEVERE"=>[0.2129,0.2766]  ],
    "O3"=>[ "GOOD"=>[0,50], "SATISFACTORY"=>[51,100], "MODERATE"=>[101,168],  "POOR"=>[169,208], "VERY_POOR"=>[209,748], "SEVERE"=>[749,1287]  ],
    "CO"=>[ "GOOD"=>[0,1.0], "SATISFACTORY"=>[1.1,2.0], "MODERATE"=>[2.1,10],  "POOR"=>[10,17], "VERY_POOR"=>[17,34], "SEVERE"=>[35,51]  ],
    "SO2"=>[ "GOOD"=>[0,0.0153], "SATISFACTORY"=>[0.0154,0.0305], "MODERATE"=>[0.0306,0.1450],  "POOR"=>[0.1451,0.3053], "VERY_POOR"=>[0.3054,0.6107], "SEVERE"=>[0.6108,0.9160]  ],
    "NH3"=>[ "GOOD"=>[0,200], "SATISFACTORY"=>[201,400], "MODERATE"=>[401,800],  "POOR"=>[801,1200], "VERY_POOR"=>[1201,1800], "SEVERE"=>[1801,2400]  ],
    "Pb"=>[ "GOOD"=>[0,0.5], "SATISFACTORY"=>[0.5,1.0], "MODERATE"=>[1.1,2.0],  "POOR"=>[2.1,3.0], "VERY_POOR"=>[3.1,3.5], "SEVERE"=>[3.6,4]  ],
];
*/

function readAQIValues(){
    global $aqiConstParams;
    global $dbConfigConn;
    $aqiConstParams = [];
    $sql = "SELECT * FROM `aqi` ";
    $result = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
    while($row = mysqli_fetch_assoc($result)) {
        $parameter = $row['parameter'];
        $units = $row['units'];
        if ($units == '') {
            $units='ALL';
        }
        $aqiConstParams[$parameter]['units'] = $units;
        $aqiConstParams[$parameter][$units]['GOOD']=explode(',',$row['good']);
        $aqiConstParams[$parameter][$units]['SATISFACTORY']=explode(',',$row['satisfactory']);
        $aqiConstParams[$parameter][$units]['MODERATE']=explode(',',$row['moderately']);
        $aqiConstParams[$parameter][$units]['POOR']=explode(',',$row['poor']);
        $aqiConstParams[$parameter][$units]['VERY_POOR']=explode(',',$row['veryPoor']);
        $aqiConstParams[$parameter][$units]['SEVERE']=explode(',',$row['severe']);
    }
}

function getAqiCategory($aqiValue) {
    global $aqiConstParams;
    foreach ($aqiConstParams['AQI']['ALL'] as $aqiCategory => $aqiVal ) {
        echo "<br/>Category = $aqiCategory".$aqiVal[0]."-".$aqiVal[1];
        if ($aqiValue >= $aqiVal[0] && $aqiValue  <= $aqiVal[1] ) {
            return $aqiCategory;
        }
    }
    return 'SEVERE';
}


function aqiCalculateSubIndex($aqiSensorType, $units, $sensorAvgValue) {
    global $aqiConstParams;
    $aqiValSubIndex=0;
    $pollutantRange='SEVERE';
    if ($units == '') {
        $units = 'ALL';
    }

    foreach ($aqiConstParams[$aqiSensorType][$units] as $key => $aqiParamsArray) {
        //echo "<br/>Value[sensorAvgValue] $aqiSensorType - $key - ($sensorAvgValue >= ".$aqiParamsArray[0].") && ($sensorAvgValue <= ".$aqiParamsArray[1]." )";
        if ( ($sensorAvgValue >= $aqiParamsArray[0]) && ($sensorAvgValue <= $aqiParamsArray[1] ) ) {
            //echo "<br/>Setting $key";
            $pollutantRange=$key;
            break;
        }
    }
    
    //Ip = [IHi – ILo / BPHi – BPLo] (Cp – BPLo) + ILo
    $ILo = $aqiConstParams['AQI']['ALL'][$pollutantRange][0];
    $IHi = $aqiConstParams['AQI']['ALL'][$pollutantRange][1];
    $BPLo = $aqiConstParams[$aqiSensorType][$units][$pollutantRange][0];
    $BPHi = $aqiConstParams[$aqiSensorType][$units][$pollutantRange][1];
    
    echo "<br/>$pollutantRange - ILo[$ILo]-IHi[$IHi] BPHi[$BPHi]-BPLo[$BPLo]  == [$sensorAvgValue]";
    $aqiValSubIndex = ((($IHi - $ILo) / ($BPHi - $BPLo)) * ($sensorAvgValue - $BPLo)) + $ILo;
    echo "<br/>Type = $aqiSensorType Val=$sensorAvgValue -- SubIndex = $aqiValSubIndex";
    return number_format($aqiValSubIndex,2,'.','');
}


function initializeAqiArray(){
    global $gblAqiArray;
    $gblAqiArray['info']['aqiValue'] = 0;
    $gblAqiArray['info']['aqiCategory'] = '';
    $gblAqiArray['info']['prominentPollutantID'] = 0;
    $gblAqiArray['info']['sensorCnt'] = 0;
    foreach(AQI_PARAMS_ARRAY as $aqiName) {
        $gblAqiArray[$aqiName]['deviceID'] = 0; 
        $gblAqiArray[$aqiName]['sensorID'] = 0; 
        $gblAqiArray[$aqiName]['avg'] = 0; 
        $gblAqiArray[$aqiName]['subIndex'] = 0;
        $gblAqiArray[$aqiName]['avgH'] = 0; 
        $gblAqiArray[$aqiName]['subIndexH'] = 0;
        $gblAqiArray[$aqiName]['count'] = 0;
        $gblAqiArray[$aqiName]['sensorName'] = ''; 
        $gblAqiArray[$aqiName]['units'] = ''; 
    }
}

function printAqiArray(){
    global $gblAqiArray;
    echo "<hr/>";
    echo "AQI Value = [".$gblAqiArray['info']['aqiValue']."] Category = [".$gblAqiArray['info']['aqiCategory']."] ProminentPollutant = [".$gblAqiArray['info']['prominentPollutantID']."] #sensors = [".$gblAqiArray['info']['sensorCnt']."]<br/>";
    foreach(AQI_PARAMS_ARRAY as $aqiName) {
        echo " [".$aqiName."] Device[".$gblAqiArray[$aqiName]['deviceID']."] Sensor[".$gblAqiArray[$aqiName]['sensorID']."] Avg[".$gblAqiArray[$aqiName]['avg']."] SubIdx[".$gblAqiArray[$aqiName]['subIndex']."] AvgH[".$gblAqiArray[$aqiName]['avgH']."] SubIdxH[".$gblAqiArray[$aqiName]['subIndexH']."] Cnt[".$gblAqiArray[$aqiName]['count']."]  Name[".$gblAqiArray[$aqiName]['sensorName']."]  Units[".$gblAqiArray[$aqiName]['units']."] <br/>";
    }
}

function subAqiCheckMandatoryValue() {
    global $gblAqiArray;

    if ($gblAqiArray['PM2.5']['avg'] == 0 && $gblAqiArray['PM10']['avg'] == 0 ) {
        return true;
    }
    else {
        return false;
    }
}

function aqiCheckMandatoryValue() {
    global $gblAqiArray;
    $recordCount = 0;

    foreach( AQI_PARAMS_ARRAY as $aqiParams) {
        if ( $gblAqiArray[$aqiParams]['avg'] != 0 ) {
            $gblAqiArray[$aqiParams]['count'] = 1;
            $recordCount++;
        }
    }
    if ( $recordCount < 3 ) {
        //cannot calculate AQI as less than 3 params
        return true;
    }
    else {
        return false;
    }
}


function getAqiTimeInterval($sensorNameUnit) {
    if ($sensorNameUnit == 'PM2.5' || $sensorNameUnit == 'PM10' || $sensorNameUnit == 'SO2' || $sensorNameUnit == 'NO2' || $sensorNameUnit == 'NH3') {
        //return SIXTEEN_HOUR;
        return TWENTY_FOUR_HOUR;
    }
    else if ($sensorNameUnit == 'CO' || $sensorNameUnit == 'O3') {
        //return EIGHT_HOUR;
        return TWENTY_FOUR_HOUR;
    }
    else {
        return TWENTY_FOUR_HOUR;
    }
}

function getCalculatedAqiValueFromArray() {
    global $gblAqiArray;
    $recordCount = 0;
    $maxAqiValue = 0;

    foreach( AQI_PARAMS_ARRAY as $aqiParams) {
        if ( $gblAqiArray[$aqiParams]['count'] == 1 ) {
            $recordCount++;
            if ($gblAqiArray[$aqiParams]['subIndex'] > $maxAqiValue) {
                $maxAqiValue = number_format($gblAqiArray[$aqiParams]['subIndex'],0, '.','');
                echo "<br/>Setting max $maxAqiValue and pollutant id ".$gblAqiArray[$aqiParams]['sensorID'];
                $gblAqiArray['info']['prominentPollutantID'] = $gblAqiArray[$aqiParams]['sensorID'];
                $gblAqiArray['info']['aqiValue'] = $maxAqiValue;
            }
        }
    }
    if ( $recordCount < 3 ) {
        //cannot calculate AQI as less than 3 params
        return '';
    }

    $gblAqiArray['info']['aqiCategory']= getAqiCategory($gblAqiArray['info']['aqiValue']);
    $gblAqiArray['info']['sensorCnt']= $recordCount;

    return $maxAqiValue;
}


function fillAqiSubIndex(){
    global $gblAqiArray;
    foreach(AQI_PARAMS_ARRAY as $aqiParams) {
        if ( $gblAqiArray[$aqiParams]['avg'] > 0 ) {
            $gblAqiArray[$aqiParams]['subIndex'] = aqiCalculateSubIndex($aqiParams, $gblAqiArray[$aqiParams]['units'], $gblAqiArray[$aqiParams]['avg']);
            $gblAqiArray[$aqiParams]['subIndexH'] = aqiCalculateSubIndex($aqiParams, $gblAqiArray[$aqiParams]['units'], $gblAqiArray[$aqiParams]['avgH']);
        }
    }
}

?>
