<?php
// Basic authentication details
$merchantAlias = 'james'; // Replace with your merchant alias (username)
$apiKey = 'zyn6dCF@EL3kUr!'; // Replace with your API key (password)

// API endpoint for creating a payment link
$paymentLinkEndpoint = 'https://api.eu.convergepay.com/payment-links'; // Replace with the actual endpoint

// Prepare the request headers
$headers = [
    'Authorization: Basic ' . base64_encode("$merchantAlias:$apiKey"),
    'Accept: application/json;charset=UTF-8',
    'Accept-Version: 1',
    'Content-Type: application/json;charset=UTF-8'
];

// Payment link request data
$requestData = [
    'account' => 'https://api.example.com/merchant-account', // Replace with the account URL
    'returnUrl' => 'https://your-website.com/payment-complete', // Replace with your return URL
    'expiresAt' => date('c', strtotime('+1 day')), // Expire in 1 day (adjust as needed)
    'doCancel' => false, // Default value
    'doCapture' => true, // Default value
    'description' => 'Payment for Order #12345', // Payment description
    'total' => [
        'amount' => 10000, // Amount in smallest currency unit (e.g., 10000 = $100.00)
        'currency' => 'USD' // Currency code (ISO 4217)
    ],
    'conversionLimit' => 1, // Can be used only once
    'debtorAccount' => [
        'accountNumber' => '1234567890', // Debtor account details if required
        'bankCode' => '987654321'
    ],
    'orderReference' => 'ORD123456', // Optional order reference
    'shopperEmailAddress' => 'shopper@example.com', // Shopper's email address
    'customReference' => 'CUSTOM123', // Optional custom reference
    'customFields' => [
        'extraInfo' => 'Some additional info'
    ],
    'shopper' => 'https://api.example.com/shopper-account' // Replace with shopper URL
];

// Initialize cURL
$ch = curl_init($paymentLinkEndpoint);

// Set cURL options
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
} else {
    // Decode and handle the response
    $responseData = json_decode($response, true);
    // echo "Payment Link created successfully:\n";
    print_r($responseData);
}

// Close cURL
curl_close($ch);
?>
