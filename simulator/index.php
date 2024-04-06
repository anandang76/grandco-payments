<?php
date_default_timezone_set('Asia/Kolkata');
include("../includes/config.php");
include("../includes/dbConfigConn.php");
include("../includes/constantsVals.php");
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AQMS Simulator</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 12px;
            }
            .container {
                max-width: 400px;
                margin: 0 auto;
                background-color: #fff;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            label {
                display: block;
                margin-bottom: 8px;
            }
            select {
                width: 100%;
                padding: 8px;
                margin-bottom: 16px;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
            }
            button {
                background-color: #4caf50;
                padding: 10px 15px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            .mt-2{
                margin-top: 8px;
            }
            .overflow-auto{
                overflow: auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>AQMS Simulator </h2>
            <form action="#" method="post">
                <div>
                    <label for="simulatorDevice">Simulator Device List:</label>
                    <select id="simulatorDevice" name="simulatorDevice">
                        <option value="all">All</option>
                        <?php
                            $sql = "SELECT id, deviceName, deviceMode FROM `devices` where deviceMode = '".DEVICE_MODE_SIMULATOR."' ";
                            $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
                            while ($result = mysqli_fetch_assoc($getResult))
                            {
                                echo '<option value="'.$result['id'].'">['.$result['id'].'] - '.$result['deviceName'].' - ['.$result['deviceMode'].']</option>';
                            }
                        ?>
                    </select>
                </div>
                <!-- <div class="mt-2">
                    <input type="text" id="defaultSeconds" value="57" readonly />seconds
                </div> -->
                <div id="sensorFields"></div>
                <div class="mt-2">
                    <button id="simStart" onclick="simulatorRun()" disabled>RUN</button>
                    <button id="simStop" onclick="simulatorStop()" disabled>STOP</button>
                </div>
                <code>
                    <div id="timeContainer" class="mt-2"></div>
                </code>
                <code>
                    <div id="lastValContainer" class="mt-2 overflow-auto"></div>
                </code>
                <hr/>
                <div>
                    <label for="deviceDropdown">Device List:</label>
                    <select id="deviceDropdown" name="deviceDropdown">
                        <option value="all">All</option>
                        <?php
                            $sql = "SELECT id, deviceName, deviceMode FROM `devices` ";
                            $getResult = mysqli_query($dbConfigConn,$sql) or die(mysqli_error($dbConfigConn));
                            while ($result = mysqli_fetch_assoc($getResult))
                            {
                                echo '<option value="'.$result['id'].'">['.$result['id'].'] - '.$result['deviceName'].' - ['.$result['deviceMode'].']</option>';
                            }
                        ?>
                    </select>
                </div>
                <div>
                    <label>Choose an option:</label>
                    <div class="mt-2">
                        <?php
                        echo '<input type="radio" id="'.DEVICE_MODE_ENABLED.'" name="deviceStatusGroup" value="'.DEVICE_MODE_ENABLED.'">'.DEVICE_MODE_ENABLED.' ';
                        echo '<input type="radio" id="'.DEVICE_MODE_DISABLED.'" name="deviceStatusGroup" value="'.DEVICE_MODE_DISABLED.'">'.DEVICE_MODE_DISABLED.' ';
                        echo '<input type="radio" id="'.DEVICE_MODE_SIMULATOR.'" name="deviceStatusGroup" value="'.DEVICE_MODE_SIMULATOR.'">'.DEVICE_MODE_SIMULATOR.' ';
                        ?>
                    </div>
                </div>
                <div class="mt-2">
                    <button type="button" id="devUpd" onclick="processdeviceUpdate()">Update Device Mode</button>
                </div>
                <hr/>
            </form>
        </div>

        <script>
            let intervalID;
            let remainingSeconds=0;
            let lastValueSent;
            let deviceID='';
            let lastDateTime ='';
            let lastSentTime = '';
            const sensors = [];
            function startTimer() {
                // Call the interval function
                updateMessage();
        
                 // Set a new timeout for the next interval
                 intervalID= setTimeout(startTimer, 1000); // Call startTimer again after 1 second
            }


            function simulatorRun() {
                document.getElementById("simStart").disabled = true;
                document.getElementById("simStop").disabled = false;
                console.log("Simulator Run Started");
                remainingSeconds=0;
                //intervalID = setInterval(updateMessage, 1000);
                //intervalID = setInterval(function() {
                //    updateMessage();
                //}, 1000);
                //clearInterval(intervalID);
                startTimer();
                //updateMessage();
            }

            function updateMessage() {
                var newDt = new Date();
                var difference_ms=0;
                var diff_ms = 0;
                if (lastSentTime=='') {
                    lastSentTime=new Date();
                    lastDateTime=new Date();
                    difference_ms=60000;
                }
                else {
                    difference_ms = (newDt - lastSentTime);
                    diff_ms= (newDt - lastDateTime);
                    lastDateTime=new Date();
                }
                
                if (diff_ms > 5000) {
                    console.log(newDt.toLocaleString()+" Waiting for ["+difference_ms+ "] millseconds ");
                }
                //sending data every 55 seconds
                if (difference_ms > 50000) {
                    //form this type of array
                    //{"DATE":"2024-01-14","TIME":"09:46:02","DEVICE_ID":"2","SD_CARD":"1","RSSI":"28","MODE":"2","ACCESS_CODE":"1003","1":"10.3242"}
                    //console.log(deviceID);
                    let valueSendingArray = {};
                    let textboxes = document.querySelectorAll('#sensorFields input[type="text"]');
                    let textBoxInfo = {};
                    textboxes.forEach(function(textbox) {
                        let textBoxId = textbox.id;
                        let textBoxValue = textbox.value;

                        // Regular expression to match numbers or dots
                        const regex = /^[0-9.]+$/;

                        if (regex.test(textBoxValue)) {
                            valueSendingArray[textBoxId] = textBoxValue;
                        } else {
                            console.log("[" + textBoxValue + "]Input contains invalid characters... Not adding to the string");
                        }
                        
                    });

                    //valueSendingArray['deviceID']=deviceID;
                    
                    let jsonString = JSON.stringify(valueSendingArray);
                    lastValueSent = jsonString;
                    const lastValContainer = document.getElementById("lastValContainer");
                    lastValContainer.textContent = jsonString;
                    console.log(newDt.toLocaleString() +" Sending Data " + jsonString);
                    //console.log("New Checck");

                    var formData = new FormData();
                    formData.append('deviceID', deviceID);
                    formData.append('jsonData', jsonString);

                    fetch('updateSimulatorValues.php', {
                    method: 'POST',
                    body: formData
                    })
                    .then(response => response.text()) // Assuming backend returns plain text
                    .then(data => {
                    console.log(data);
                    lastValContainer.textContent = jsonString + "<br/>Return " + data;
                    // You can update the UI or perform other actions based on the response
                    })
                    .catch(error => {
                    console.error('Error:', error);
                    });
                    //console.log("Completed");
                    lastSentTime=new Date();
                }
                var timeContainer = document.getElementById("timeContainer");
                var now = new Date();
                var currentDateTime = now.toLocaleString() ;
                timeContainer.textContent = currentDateTime ;
            }

            function simulatorStop() {
                clearTimeout(intervalID);
                remainingSeconds=0;
                document.getElementById("simStop").disabled = true;
                document.getElementById("simStart").disabled = false;
                document.getElementById("simulatorDevice").disabled = false;
                console.log("Simulator Stopped");
            }

            function addDynamicFields(data) {
                var sensorFields = document.getElementById("sensorFields");
                // Clear existing dynamic fields
                sensorFields.innerHTML = "";
                // Add new text box fields based on the received data
                data.forEach(function(sensorData) {
                    //console.log("******");
                    //console.log("ID " + sensorData['id']);
                    //console.log("Tag " + sensorData['sensorTag']);
                    //console.log("DefaultValue " + sensorData['defaultValue']);

                    var label = document.createElement("label");
                    label.textContent = "["+ sensorData['id'] + "] " +sensorData['sensorTag'] + ": W="+ sensorData['warning'] + " C="+ sensorData['critical'] + " O="+ sensorData['outOfRange'] + " D="+ sensorData['defaultValue'];
                    sensorFields.appendChild(label);
                    /* sensors[sensorData['id']]['minR'] = sensorData['minR'];
                    sensors[sensorData['id']]['maxR'] = sensorData['maxR'];
                    sensors[sensorData['id']]['minRS'] = sensorData['minRS'];
                    sensors[sensorData['id']]['maxRS'] = sensorData['maxRS']; */

                    var input = document.createElement("input");
                    input.id = sensorData['id'];
                    input.type = "text";
                    input.name = sensorData['sensorTag'];
                    input.value = sensorData['defaultValue'];

                    sensorFields.appendChild(input); 
                });
            }

            function processdeviceUpdate() {
                var selectedMode = '';
                var deviceID = '';
                var radioButtons = document.getElementsByName("deviceStatusGroup");
                for (var i = 0; i < radioButtons.length; i++) {
                    if (radioButtons[i].checked) {
                        var selectedMode = radioButtons[i].value;
                        break; // Exit the loop since we found the selected value
                    }
                }

                var deviceID = document.getElementById("deviceDropdown").value;
                if (deviceID == 'all') {
                    alert("Please select device");
                    return;
                }
                if (selectedMode == '') {
                    alert("Please select Mode");
                    return;
                }
                console.log("Selected ID : " + deviceID + " Mode : " + selectedMode );
                updateDeviceStatus(deviceID, selectedMode);
            }

            function updateDeviceStatus(deviceID, selectedMode) {
                var formData = new FormData();
                formData.append('deviceID', deviceID);
                formData.append('selectedMode', selectedMode);

                fetch('updateDeviceMode.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text()) // Assuming backend returns plain text
                .then(data => {
                    alert(data);
                    window.location.reload();
                    // You can update the UI or perform other actions based on the response
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }

            document.getElementById("simulatorDevice").addEventListener("change", function() {
                var simulatorDeviceID = this.value;
                deviceID = simulatorDeviceID;
                if (simulatorDeviceID == 'all') {
                    console.log("All Selected display None " + simulatorDeviceID);
                    var sensorFields = document.getElementById("sensorFields");
                    sensorFields.innerHTML = "";
                    document.getElementById("simStart").disabled = true;
                    document.getElementById("simulatorDevice").disabled = false;
                }
                else {
                    //console.log("Calling backend function ");
                    var formData = new FormData();
                    formData.append('deviceID', simulatorDeviceID);

                    fetch('getSensorList.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.json())
                    .then(data => {
                        addDynamicFields(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                    document.getElementById("simStart").disabled = false;
                }
                //console.log("On change function end");
            });
        </script>
    </body>
</html>