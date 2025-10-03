<?php

// Probando endpoint de búsqueda directamente
$token = '3|tsgImxUmI2inQWsQBuGAk8dNkfANHBWRH0WatzFi9025b34d';
$base_url = 'http://127.0.0.1:8000/api';

echo "=== PROBANDO ENDPOINT DE BÚSQUEDA ===\n";

// Función para hacer peticiones HTTP
function makeRequest($url, $token, $method = 'GET') {
    $context = stream_context_create([
        'http' => [
            'method' => $method,
            'header' => [
                "Authorization: Bearer $token",
                "Accept: application/json",
                "Content-Type: application/json"
            ],
            'timeout' => 30
        ]
    ]);
    
    echo "URL: $url\n";
    
    $response = @file_get_contents($url, false, $context);
    
    if ($response === false) {
        $error = error_get_last();
        echo "ERROR: " . $error['message'] . "\n";
        
        // Mostrar headers de respuesta si están disponibles
        if (isset($http_response_header)) {
            echo "Response Headers:\n";
            foreach ($http_response_header as $header) {
                echo "$header\n";
            }
        }
        return false;
    }
    
    echo "SUCCESS!\n";
    echo "Response: $response\n";
    
    if (isset($http_response_header)) {
        echo "\nResponse Headers:\n";
        foreach ($http_response_header as $header) {
            if (strpos($header, 'HTTP/') === 0 || strpos($header, 'Content-Type') !== false) {
                echo "$header\n";
            }
        }
    }
    
    return json_decode($response, true);
}

// Test 1: Búsqueda con término específico
echo "\n1. Buscando 'juan':\n";
$result1 = makeRequest("$base_url/empleados/search?q=juan", $token);

// Test 2: Búsqueda vacía (debería devolver todos)
echo "\n2. Búsqueda vacía:\n";
$result2 = makeRequest("$base_url/empleados/search?q=", $token);

// Test 3: Búsqueda con término que no existe
echo "\n3. Buscando término inexistente 'xyz123':\n";
$result3 = makeRequest("$base_url/empleados/search?q=xyz123", $token);

echo "\n=== FIN DE PRUEBAS ===\n";