<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $codigo
 * @property string $descripcion
 * @property string|null $direccion
 * @property bool $bodega_ecommerce
 */
class Bodega extends Model
{
    /**
     * Indica que la tabla no contiene las columnas created_at y updated_at.
     *
     * @var bool
     */
    public $timestamps = false;

    protected $table = 'bodegas';
    /**
     * Los atributos que son asignables masivamente (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'codigo',
        'descripcion',
        'direccion',
        'bodega_ecommerce',
    ];

    /**
     * Los atributos que deben ser casteados a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'bodega_ecommerce' => 'boolean',
    ];
}