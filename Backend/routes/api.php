<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmpleadoController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\CargoController;
use App\Http\Controllers\Api\UsuarioController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas de autenticación (públicas)
Route::post('/login', [AuthController::class, 'login']);
Route::get('/test', [AuthController::class, 'test']); // Endpoint temporal para debug

// Rutas temporales para probar sin autenticación
Route::get('/empleados/search', [EmpleadoController::class, 'search']);
Route::get('/empleados/test', [EmpleadoController::class, 'index']);

// Rutas protegidas por autenticación
Route::middleware('auth:sanctum')->group(function () {
    // Autenticación
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Empleados - Todos los roles pueden ver
    Route::get('/empleados', [EmpleadoController::class, 'index']);
    // Route::get('/empleados/search', [EmpleadoController::class, 'search']); // Temporalmente comentado
    Route::get('/empleados/{id}', [EmpleadoController::class, 'show']);
    
    // Áreas - Todos los roles pueden ver
    Route::get('/areas', [AreaController::class, 'index']);
    
    // Cargos - Todos los roles pueden ver
    Route::get('/cargos', [CargoController::class, 'index']);
    Route::get('/areas/{id}/cargos', [CargoController::class, 'getByArea']);
    
    // Rutas solo para administradores
    Route::middleware(['role:Administrador'])->group(function () {
        // Empleados - Solo admin puede crear, editar, eliminar
        Route::post('/empleados', [EmpleadoController::class, 'store']);
        Route::put('/empleados/{id}', [EmpleadoController::class, 'update']);
        Route::delete('/empleados/{id}', [EmpleadoController::class, 'destroy']);
        
        // Áreas - Solo admin puede gestionar
        Route::post('/areas', [AreaController::class, 'store']);
        Route::put('/areas/{id}', [AreaController::class, 'update']);
        Route::delete('/areas/{id}', [AreaController::class, 'destroy']);
        
        // Cargos - Solo admin puede gestionar
        Route::post('/cargos', [CargoController::class, 'store']);
        Route::put('/cargos/{id}', [CargoController::class, 'update']);
        Route::delete('/cargos/{id}', [CargoController::class, 'destroy']);
        
        // Usuarios - Solo admin puede gestionar
        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::post('/usuarios', [UsuarioController::class, 'store']);
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
        Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
    });
});