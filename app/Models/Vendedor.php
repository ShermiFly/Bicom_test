<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendedor extends Model
{
    use HasFactory;
    protected $table = 'vendedores';

    /**
     * Indica si el modelo debe tener timestamps (created_at y updated_at).
     * Lo ponemos en 'false' porque tu script SQL original no los incluía.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Los atributos que se pueden asignar en masa.
     * Esenciales para que create() y update() funcionen.
     *
     * @var array
     */
    protected $fillable = [
        'descripcion',
        'usuario',
        'sucursal'
    ];
}