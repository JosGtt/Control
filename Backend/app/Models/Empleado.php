<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $table = 'empleados';
    
    protected $fillable = [
        'nombre',
        'apellido',
        'ci',
        'nacionalidad',
        'area_id',
        'cargo_id',
        'fecha_entrada',
        'fecha_salida',
        'estado',
        'observaciones'
    ];
    
    protected $casts = [
        'fecha_entrada' => 'date',
        'fecha_salida' => 'date',
    ];
    
    public $timestamps = false;
    
    // Relación: Un empleado pertenece a un área
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }
    
    // Relación: Un empleado pertenece a un cargo
    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'cargo_id');
    }
    
    // Relación: Un empleado puede tener un usuario
    public function usuario()
    {
        return $this->hasOne(Usuario::class, 'empleado_id');
    }
}
