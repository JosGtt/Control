<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    protected $table = 'areas';
    
    protected $fillable = [
        'nombre'
    ];
    
    public $timestamps = false;
    
    // Relación: Un área tiene muchos empleados
    public function empleados()
    {
        return $this->hasMany(Empleado::class, 'area_id');
    }
}
