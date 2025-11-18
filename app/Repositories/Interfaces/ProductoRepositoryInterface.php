<?php

namespace App\Repositories\Interfaces;

use App\Models\Producto; // 

interface ProductoRepositoryInterface 
{
    /**
     * Obtiene todos los productos (registros de la tabla productos).
     */
    public function getAllProductos();

    /**
     * Crea un nuevo producto.
     * @param array $data Los datos validados del producto.
     */
    public function createProducto(array $data);

    /**
     * Actualiza un producto existente.
     * @param producto $producto La instancia del modelo producto a actualizar.
     * @param array $data Los nuevos datos validados.
     */
    public function updateProducto(producto $producto, array $data);

    /**
     * Elimina un producto.
     * @param producto $producto, instancia del modelo "producto" a eliminar.
     */
    public function deleteProducto(producto $producto);
}