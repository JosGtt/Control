<?php

// Test login endpoint
$url = 'http://127.0.0.1:8000/api/login';
$data = json_encode([
    'usuario' => 'jose',
    'contraseña' => '123456'
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => [
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        'content' => $data
    ]
]);

echo "Testing LOGIN endpoint...\n";
echo "URL: $url\n";
echo "Data: $data\n";

$response = file_get_contents($url, false, $context);

if ($response === false) {
    echo "ERROR: No response\n";
    $headers = $http_response_header ?? [];
    foreach ($headers as $header) {
        echo "Header: $header\n";
    }
} else {
    echo "SUCCESS!\n";
    echo "Response: $response\n";
    
    // Show response headers
    $headers = $http_response_header ?? [];
    echo "\nResponse Headers:\n";
    foreach ($headers as $header) {
        echo "$header\n";
    }
}