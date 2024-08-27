<?php
$apiUrl = 'http://site.ping4sms.com/api/smsapi';
$message = 'AQMS - AI-DEA LABS Alert Received';
$message .= ' Sensor:PM2.5-IAQ Critical-267';
$messageEncoded = $message;

// Set your parameters
$params = array(
    'key' => 'b2177aadb4678c10f395c0a75691428e',
    'route' => '2',
    'sender' => 'AILABS',
    'number' => '9003259719,9449026060,9940013472',
    'sms' => $messageEncoded,
    'templateid' => '1607100000000298946'
);

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if(curl_errno($ch)) {
    echo 'cURL error: ' . curl_error($ch);
}
curl_close($ch);
// Process response
if ($response === false) {
    echo "Failed to fetch data from API.";
} else {
    echo "API response: " . $response;
}
?>