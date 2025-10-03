<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;

$capsule = new Capsule;

$capsule->addConnection([
    'driver' => 'pgsql',
    'host' => '127.0.0.1',
    'database' => 'Control',
    'username' => 'postgres',
    'password' => '123456',
    'charset' => 'utf8',
    'prefix' => '',
    'schema' => 'public',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

try {
    // Test connection
    echo "Probando conexión...\n";
    $pdo = $capsule->getConnection()->getPdo();
    echo "✓ Conexión exitosa!\n";
    
    // Test if table exists
    echo "\nProbando si la tabla 'usuarios' existe...\n";
    $result = $capsule->getConnection()->select("SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'usuarios' AND table_schema = 'public'");
    echo "Resultado de búsqueda de tabla: " . json_encode($result) . "\n";
    
    if ($result[0]->count > 0) {
        echo "✓ Tabla 'usuarios' encontrada!\n";
        
        // Try to select from usuarios table
        echo "\nProbando SELECT en tabla usuarios...\n";
        $usuarios = $capsule->getConnection()->select("SELECT * FROM usuarios LIMIT 1");
        echo "Resultado: " . json_encode($usuarios) . "\n";
    } else {
        echo "✗ Tabla 'usuarios' NO encontrada!\n";
        
        // List all tables
        echo "\nListando todas las tablas disponibles:\n";
        $tables = $capsule->getConnection()->select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        foreach ($tables as $table) {
            echo "- " . $table->table_name . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}