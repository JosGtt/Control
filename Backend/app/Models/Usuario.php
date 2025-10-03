<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;
    
    protected $table = 'usuarios';
    
    protected $fillable = [
        'usuario',
        'contraseña',
        'rol',
        'empleado_id'
    ];
    
    protected $hidden = [
        'contraseña',
    ];
    
    public $timestamps = false;
    
    // Override para usar 'contraseña' en lugar de 'password'
    public function getAuthPassword()
    {
        return $this->contraseña;
    }
    
    // Relación: Un usuario pertenece a un empleado
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'empleado_id');
    }
}
