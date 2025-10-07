<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CargoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primero obtener las áreas disponibles
        $areas = DB::table('areas')->get();
        
        // Definir cargos por área
        $cargosPorArea = [
            'Administración' => ['Administrador', 'Asistente Administrativo', 'Contador'],
            'Recursos Humanos' => ['Gerente de RRHH', 'Reclutador', 'Especialista en Nómina'],
            'Ventas' => ['Gerente de Ventas', 'Vendedor', 'Representante Comercial'],
            'Producción' => ['Supervisor', 'Operario', 'Técnico'],
            'IT' => ['Desarrollador', 'Administrador de Sistemas', 'Analista de Datos']
        ];
        
        // Actualizar cargos existentes y crear nuevos
        $cargosExistentes = DB::table('cargos')->get();
        
        foreach ($areas as $area) {
            if (isset($cargosPorArea[$area->nombre])) {
                foreach ($cargosPorArea[$area->nombre] as $index => $cargoNombre) {
                    // Buscar si ya existe un cargo con este nombre
                    $cargoExistente = $cargosExistentes->firstWhere('nombre', $cargoNombre);
                    
                    if ($cargoExistente) {
                        // Actualizar el area_id del cargo existente
                        DB::table('cargos')
                            ->where('id', $cargoExistente->id)
                            ->update(['area_id' => $area->id]);
                    } else {
                        // Crear nuevo cargo
                        DB::table('cargos')->insert([
                            'nombre' => $cargoNombre,
                            'area_id' => $area->id,
                        ]);
                    }
                }
            }
        }
    }
}
