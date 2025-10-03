<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empleado;
use Illuminate\Validation\Rule;

class EmpleadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Empleado::with(['area', 'cargo']);

        // Filtros
        if ($request->has('area_id') && $request->area_id) {
            $query->where('area_id', $request->area_id);
        }

        if ($request->has('cargo_id') && $request->cargo_id) {
            $query->where('cargo_id', $request->cargo_id);
        }

        if ($request->has('estado') && $request->estado) {
            $query->where('estado', $request->estado);
        }

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nombre', 'ilike', "%{$search}%")
                  ->orWhere('apellido', 'ilike', "%{$search}%")
                  ->orWhere('ci', 'ilike', "%{$search}%");
            });
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'nombre');
        $sortDirection = $request->get('sort_direction', 'asc');
        $query->orderBy($sortBy, $sortDirection);

        // Paginación
        $perPage = $request->get('per_page', 15);
        $empleados = $query->paginate($perPage);

        return response()->json($empleados);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:50',
            'apellido' => 'required|string|max:50',
            'ci' => 'required|string|max:20|unique:empleados',
            'nacionalidad' => 'nullable|string|max:30',
            'area_id' => 'required|exists:areas,id',
            'cargo_id' => 'required|exists:cargos,id',
            'fecha_entrada' => 'required|date',
            'fecha_salida' => 'nullable|date|after:fecha_entrada',
            'estado' => 'required|in:activo,finalizado',
            'observaciones' => 'nullable|string'
        ]);

        $empleado = Empleado::create($request->all());
        $empleado->load(['area', 'cargo']);

        return response()->json([
            'message' => 'Empleado creado exitosamente',
            'empleado' => $empleado
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $empleado = Empleado::with(['area', 'cargo', 'usuario'])->findOrFail($id);

        return response()->json($empleado);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $empleado = Empleado::findOrFail($id);

        $request->validate([
            'nombre' => 'required|string|max:50',
            'apellido' => 'required|string|max:50',
            'ci' => ['required', 'string', 'max:20', Rule::unique('empleados')->ignore($empleado->id)],
            'nacionalidad' => 'nullable|string|max:30',
            'area_id' => 'required|exists:areas,id',
            'cargo_id' => 'required|exists:cargos,id',
            'fecha_entrada' => 'required|date',
            'fecha_salida' => 'nullable|date|after:fecha_entrada',
            'estado' => 'required|in:activo,finalizado',
            'observaciones' => 'nullable|string'
        ]);

        $empleado->update($request->all());
        $empleado->load(['area', 'cargo']);

        return response()->json([
            'message' => 'Empleado actualizado exitosamente',
            'empleado' => $empleado
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $empleado = Empleado::findOrFail($id);
        
        // Verificar si tiene usuario asociado
        if ($empleado->usuario) {
            return response()->json([
                'message' => 'No se puede eliminar el empleado porque tiene un usuario asociado'
            ], 400);
        }

        $empleado->delete();

        return response()->json([
            'message' => 'Empleado eliminado exitosamente'
        ]);
    }

    /**
     * Search employees by query string
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (empty($query)) {
            return $this->index($request);
        }

        $empleados = Empleado::with(['area', 'cargo'])
            ->where(function($q) use ($query) {
                $q->where('nombre', 'ilike', "%{$query}%")
                  ->orWhere('apellido', 'ilike', "%{$query}%")
                  ->orWhere('ci', 'ilike', "%{$query}%");
            })
            ->orderBy('nombre')
            ->get();

        return response()->json($empleados);
    }
}
