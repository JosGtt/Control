<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cargo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CargoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $cargos = Cargo::with('area')->get();
            return response()->json([
                'data' => $cargos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener cargos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cargos by area ID
     */
    public function getByArea(string $id): JsonResponse
    {
        try {
            $cargos = Cargo::where('area_id', $id)->get();
            return response()->json([
                'data' => $cargos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener cargos por área',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'area_id' => 'required|exists:areas,id'
            ]);

            $cargo = Cargo::create($request->all());
            $cargo->load('area');

            return response()->json($cargo, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $cargo = Cargo::with('area')->findOrFail($id);
            return response()->json($cargo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Cargo no encontrado',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'nombre' => 'required|string|max:255',
                'area_id' => 'required|exists:areas,id'
            ]);

            $cargo = Cargo::findOrFail($id);
            $cargo->update($request->all());
            $cargo->load('area');

            return response()->json($cargo);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $cargo = Cargo::findOrFail($id);
            $cargo->delete();

            return response()->json([
                'message' => 'Cargo eliminado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar cargo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
