<?php

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Support\Facades\Hash;

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
    echo "=== VERIFICANDO USUARIO JOSE ===\n";
    
    // Buscar usuario jose
    $usuario = $capsule->getConnection()->select("SELECT * FROM usuarios WHERE usuario = 'jose'");
    
    if (empty($usuario)) {
        echo "❌ Usuario 'jose' NO encontrado\n";
        
        // Buscar todos los usuarios
        echo "\nUsuarios disponibles:\n";
        $todos = $capsule->getConnection()->select("SELECT usuario FROM usuarios");
        foreach ($todos as $u) {
            echo "- " . $u->usuario . "\n";
        }
    } else {
        $user = $usuario[0];
        echo "✅ Usuario encontrado: " . $user->usuario . "\n";
        echo "Contraseña hash: " . $user->contraseña . "\n";
        echo "Rol: " . $user->rol . "\n";
        
        // Verificar contraseña
        echo "\n=== VERIFICANDO CONTRASEÑA ===\n";
        $password_plain = '123456';
        $password_hash = $user->contraseña;
        
        // Manual password verification (Laravel style)
        echo "Contraseña original: $password_plain\n";
        echo "Hash almacenado: $password_hash\n";
        
        // Test with PHP's password_verify
        if (password_verify($password_plain, $password_hash)) {
            echo "✅ Contraseña CORRECTA con password_verify()\n";
        } else {
            echo "❌ Contraseña INCORRECTA con password_verify()\n";
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}