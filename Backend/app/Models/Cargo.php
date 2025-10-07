<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    protected $table = 'cargos';
    
    protected $fillable = [
        'nombre',
        'area_id'
    ];
    
    public $timestamps = false;
    
    // Relación: Un cargo pertenece a un área
    public function area()
    {
        return $this->belongsTo(Area::class, 'area_id');
    }
    
    // Relación: Un cargo tiene muchos empleados
    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'cargo_id');
    }
}
