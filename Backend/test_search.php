<?php

require_once 'vendor/autoload.php';

use App\Models\Empleado;
use App\Models\Area;  
use App\Models\Cargo;
use Illuminate\Database\Capsule\Manager as Capsule;

// Initialize database connection
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

echo "=== PROBANDO BÚSQUEDA DE EMPLEADOS ===\n";

try {
    // Test 1: Get all employees
    echo "\n1. Probando obtener todos los empleados...\n";
    $empleados = $capsule->getConnection()->select("SELECT nombre, apellido, ci FROM empleados LIMIT 5");
    foreach ($empleados as $emp) {
        echo "- {$emp->nombre} {$emp->apellido} (CI: {$emp->ci})\n";
    }
    
    // Test 2: Search by name using ILIKE
    echo "\n2. Probando búsqueda por nombre 'Juan'...\n";
    $query = 'Juan';
    $empleados = $capsule->getConnection()->select("
        SELECT e.nombre, e.apellido, e.ci, a.nombre as area, c.nombre as cargo
        FROM empleados e
        LEFT JOIN areas a ON e.area_id = a.id
        LEFT JOIN cargos c ON e.cargo_id = c.id
        WHERE e.nombre ILIKE ? OR e.apellido ILIKE ? OR e.ci ILIKE ?
        ORDER BY e.nombre
        LIMIT 10
    ", ["%{$query}%", "%{$query}%", "%{$query}%"]);
    
    echo "Resultados encontrados: " . count($empleados) . "\n";
    foreach ($empleados as $emp) {
        echo "- {$emp->nombre} {$emp->apellido} (CI: {$emp->ci}) - {$emp->area} / {$emp->cargo}\n";
    }
    
    // Test 3: Test search method logic
    echo "\n3. Probando lógica del método search...\n";
    
    function testSearchMethod($query = '') {
        global $capsule;
        
        if (empty($query)) {
            echo "Query vacío, retornando todos los empleados...\n";
            $empleados = $capsule->getConnection()->select("
                SELECT e.nombre, e.apellido, e.ci, a.nombre as area, c.nombre as cargo
                FROM empleados e
                LEFT JOIN areas a ON e.area_id = a.id
                LEFT JOIN cargos c ON e.cargo_id = c.id
                ORDER BY e.nombre
                LIMIT 10
            ");
        } else {
            echo "Buscando empleados con query: '$query'...\n";
            $empleados = $capsule->getConnection()->select("
                SELECT e.nombre, e.apellido, e.ci, a.nombre as area, c.nombre as cargo
                FROM empleados e
                LEFT JOIN areas a ON e.area_id = a.id
                LEFT JOIN cargos c ON e.cargo_id = c.id
                WHERE (e.nombre ILIKE ? OR e.apellido ILIKE ? OR e.ci ILIKE ?)
                ORDER BY e.nombre
            ", ["%{$query}%", "%{$query}%", "%{$query}%"]);
        }
        
        return $empleados;
    }
    
    // Test with empty query
    $result1 = testSearchMethod('');
    echo "Empleados con query vacío: " . count($result1) . "\n";
    foreach (array_slice($result1, 0, 3) as $emp) {
        echo "  - {$emp->nombre} {$emp->apellido}\n";
    }
    
    // Test with 'ana' query
    $result2 = testSearchMethod('ana');
    echo "\nEmpleados con query 'ana': " . count($result2) . "\n";
    foreach ($result2 as $emp) {
        echo "  - {$emp->nombre} {$emp->apellido}\n";
    }
    
    echo "\n✅ Todas las pruebas de búsqueda funcionaron correctamente!\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}