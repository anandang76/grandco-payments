<?php 

$accountID = "0029444"; // Virtual Merchant Account ID 
$userID = "apiuser642801"; // Virtual Merchant User ID 
$pinCode = "JTY770VXX0B3Y8VDID0DYNLAKO61IQGZFTR8H8W4LUXBEI6B7L4KFAE4H48PRBXD"; // Converge PIN 
$vendorID = "sc900389"; // Vendor ID 

$url = "https://api.demo.convergepay.com/hosted-payments/transaction_token"; // URL to Converge demo session token server 
//$url = "https://api.convergepay.com/hosted-payments/transaction_token"; // URL to Converge production session token server  

$amount = "1.00";

// Initialize cURL
$ch = curl_init($url);

// Set the options for the POST request
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Set the headers
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/x-www-form-urlencoded',
));

// Set the POST data
$postData = http_build_query(array(
    'ssl_transaction_type' => 'ccsale',
    'ssl_account_id' => $accountID,
    'ssl_user_id' => $userID,
    'ssl_pin' => $pinCode,
    'ssl_vendor_id' => $vendorID,
    'ssl_amount' => $amount,
    'ssl_add_token' => 'Y',
    'ssl_get_token' => 'Y',
));

curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);

// Execute the request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo 'Response: ' . $response;
}

// Close cURL
curl_close($ch);

?>
