<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'usuario' => 'required|string',
            'contraseña' => 'required|string',
        ]);

        $usuario = Usuario::where('usuario', $request->usuario)->first();

        if (!$usuario || !Hash::check($request->contraseña, $usuario->contraseña)) {
            return response()->json([
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        // Cargar la relación con empleado
        $usuario->load('empleado.area', 'empleado.cargo');

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $usuario->id,
                'usuario' => $usuario->usuario,
                'rol' => $usuario->rol,
                'empleado' => $usuario->empleado
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    public function user(Request $request)
    {
        $usuario = $request->user();
        $usuario->load('empleado.area', 'empleado.cargo');

        return response()->json([
            'user' => [
                'id' => $usuario->id,
                'usuario' => $usuario->usuario,
                'rol' => $usuario->rol,
                'empleado' => $usuario->empleado
            ]
        ]);
    }

    // Endpoint temporal para debug
    public function test()
    {
        try {
            $usuario = Usuario::where('usuario', 'jose')->first();
            if ($usuario) {
                return response()->json([
                    'found' => true,
                    'usuario' => $usuario->usuario,
                    'password_length' => strlen($usuario->contraseña),
                    'starts_with_hash' => str_starts_with($usuario->contraseña, '$2y$')
                ]);
            } else {
                return response()->json(['found' => false]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    }
}
