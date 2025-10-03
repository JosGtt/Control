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
    echo "=== AGREGANDO EMPLEADOS DE PRUEBA ===\n";
    
    // Primero verificar si ya existen empleados
    $count = $capsule->getConnection()->selectOne("SELECT COUNT(*) as count FROM empleados");
    echo "Empleados existentes: " . $count->count . "\n";
    
    if ($count->count == 0) {
        echo "Agregando empleados de prueba...\n";
        
        // Obtener IDs de áreas y cargos
        $area = $capsule->getConnection()->selectOne("SELECT id FROM areas LIMIT 1");
        $cargo = $capsule->getConnection()->selectOne("SELECT id FROM cargos LIMIT 1");
        
        if (!$area || !$cargo) {
            echo "Creando área y cargo de prueba...\n";
            
            // Crear área de prueba
            $area_id = $capsule->getConnection()->table('areas')->insertGetId([
                'nombre' => 'Tecnología',
                'descripcion' => 'Área de Tecnología y Sistemas'
            ]);
            
            // Crear cargo de prueba
            $cargo_id = $capsule->getConnection()->table('cargos')->insertGetId([
                'nombre' => 'Desarrollador',
                'descripcion' => 'Desarrollador de Software'
            ]);
        } else {
            $area_id = $area->id;
            $cargo_id = $cargo->id;
        }
        
        // Insertar empleados de prueba
        $empleados = [
            ['Juan', 'Pérez', '12345678'],
            ['María', 'González', '87654321'],
            ['Carlos', 'Rodríguez', '11223344'],
            ['Ana', 'Martínez', '44332211'],
            ['Luis', 'Fernández', '55667788']
        ];
        
        foreach ($empleados as $emp) {
            $capsule->getConnection()->table('empleados')->insert([
                'nombre' => $emp[0],
                'apellido' => $emp[1],
                'ci' => $emp[2],
                'telefono' => '091' . rand(100000, 999999),
                'email' => strtolower($emp[0] . '.' . $emp[1]) . '@empresa.com',
                'fecha_ingreso' => '2024-01-01',
                'salario' => rand(30000, 80000),
                'area_id' => $area_id,
                'cargo_id' => $cargo_id
            ]);
        }
        
        echo "✅ Empleados agregados exitosamente!\n";
    } else {
        echo "✅ Ya existen empleados en la base de datos\n";
    }
    
    // Mostrar empleados existentes
    echo "\n=== EMPLEADOS EN LA BASE DE DATOS ===\n";
    $empleados = $capsule->getConnection()->select("SELECT nombre, apellido, ci FROM empleados LIMIT 10");
    foreach ($empleados as $emp) {
        echo "- {$emp->nombre} {$emp->apellido} (CI: {$emp->ci})\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}