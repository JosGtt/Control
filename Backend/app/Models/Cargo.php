<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    protected $table = 'cargos';
    
    protected $fillable = [
        'nombre'
    ];
    
    public $timestamps = false;
    
    // Relación: Un cargo tiene muchos empleados
    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'cargo_id');
    }
}
