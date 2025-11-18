<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\ProductoRepositoryInterface;
use App\Models\Producto; 

class ProductoRepository implements ProductoRepositoryInterface 
{
    public function getAllProductos($search = null, $status = null) 
    {
        // CORRECCIÓN 2: Usar la clase correcta (Producto, no productos)
        $query = Producto::query();

        // 1. Lógica del Buscador (ID o Código o Descripción)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('descripcion', 'like', "%{$search}%")
                ->orWhere('codigo', 'like', "%{$search}%");
            });
        }

        // 2. Lógica del Filtro de Estado (Activo/Inactivo)
        if ($status !== null && $status !== '') {
            $query->where('activo', $status);
        }
        
        // CLONAMOS la query para contar el total sin afectar la paginación
        $count = $query->clone()->count();

        // Devolvemos un arreglo con el paginador (cursor) y el total
        return [
            'paginator' => $query->orderBy('id', 'desc')->cursorPaginate(15),
            'total' => $count
        ];
    }

    public function createProducto(array $data) 
    {
        // CORRECCIÓN 3: Mayúscula en la clase
        return Producto::create($data);
    }

    // CORRECCIÓN 4: Type hint correcto (Producto $producto)
    public function updateProducto(Producto $producto, array $data) 
    {
        return $producto->update($data);
    }

    // CORRECCIÓN 5: Type hint correcto (Producto $producto)
    public function deleteProducto(Producto $producto) 
    {
        return $producto->delete();
    }
}