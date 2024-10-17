<?php 

$merchantID = "0029444"; // Virtual Merchant Account ID 
$merchantUserID = "apiuser642801"; // Virtual Merchant User ID 
$merchantPinCode = "JTY770VXX0B3Y8VDID0DYNLAKO61IQGZFTR8H8W4LUXBEI6B7L4KFAE4H48PRBXD"; // Converge PIN 
$vendorID = "sc900389"; // Vendor ID 

$url = "https://api.demo.convergepay.com/hosted-payments/transaction_token"; // URL to Converge demo session token server 
//$url = "https://api.convergepay.com/hosted-payments/transaction_token"; // URL to Converge production session token server  

$amount = "1.00"; // Post Transaction Amount

$ch = curl_init(); // Initialize curl handle 
curl_setopt($ch, CURLOPT_URL, $url); // Set URL to post to 
curl_setopt($ch, CURLOPT_POST, true); // Set POST method 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

// Set up the post fields
curl_setopt($ch, CURLOPT_POSTFIELDS, 
    "ssl_merchant_id=$merchantID" .
    "&ssl_user_id=$merchantUserID" .
    "&ssl_pin=$merchantPinCode" .
    "&ssl_vendor_id=$vendorID" .
    "&ssl_invoice_number=Inv123" .
    "&ssl_transaction_type=ccsale" .
    "&ssl_verify=N" . // Set to 'Y' if transaction type is ccgettoken, otherwise not needed 
    "&ssl_get_token=Y" . // Pass with 'Y' if you wish to tokenize the card as part of a ccsale 
    "&ssl_add_token=Y" . // Should always be Y if using card manager
    "&ssl_amount=$amount"
); 

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
curl_setopt($ch, CURLOPT_VERBOSE, true);

$result = curl_exec($ch); // Run the curl process 
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch); // Print curl errors
}
curl_close($ch); // Close cURL

echo $result; // Show the session token

?>
