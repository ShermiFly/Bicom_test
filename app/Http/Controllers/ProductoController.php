<?php

namespace App\Http\Controllers;

use App\Models\Producto; 
use App\Repositories\Interfaces\ProductoRepositoryInterface; 
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
    //Declaramos la variable que obedecera las reglas de interface
    //almacenará la implementación del repositorio de productos.
    protected ProductoRepositoryInterface $productoRepository;

    
    public function __construct(ProductoRepositoryInterface $productoRepository)
    {
        $this->productoRepository = $productoRepository;
    }

    /**
     * Muestra la lista de productos.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        return Inertia::render('productos', [
            'productos' => $this->productoRepository->getAllProductos($search, $status),
            // Devolvemos los filtros actuales para pintar los inputs en el frontend
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Muestra el formulario para crear un producto.
     */
    public function create()
    {
        return Inertia::render('Productos/Crear'); 
    }

    /**
     * Almacena un nuevo producto.
     */
    public function store(Request $request)
    {
        // Validamos usando los campos de tu modelo
        $data = $request->validate([
            'codigo' => 'required|string|max:255|unique:productos',
            'descripcion' => 'required|string|max:255',
            'precio_neto' => 'required|numeric|min:0',
            'precio_bruto' => 'required|numeric|min:0',
            'activo' => 'required|boolean', 
        ]);

        $this->productoRepository->createProducto($data);

        return redirect()->route('productos.index')
                         ->with('message', 'Producto creado exitosamente.');
    }

    /**
     * Muestra el formulario para editar un producto.
     * para que sea coherente con el resto del código.
     */
    public function edit(producto $producto)
    {
        return Inertia::render('Productos/Editar', [ 
            'producto' => $producto
        ]);
    }

    /**
     * Actualiza un producto específico.
     */
    public function update(Request $request, producto $producto)
    {
        $data = $request->validate([
            // Aseguramos que 'codigo' sea único, ignorando el registro actual
            'codigo' => 'required|string|max:255|unique:productos,codigo,' . $producto->id,
            'descripcion' => 'required|string|max:255',
            'precio_neto' => 'required|numeric|min:0',
            'precio_bruto' => 'required|numeric|min:0',
            'activo' => 'required|boolean',
        ]);

        $this->productoRepository->updateProducto($producto, $data);

        return redirect()->route('productos.index')
                         ->with('message', 'Producto actualizado exitosamente.');
    }

    /**
     * Elimina un producto específico.
     */
    public function destroy(producto $producto)
    {
        $this->productoRepository->deleteProducto($producto);

        return redirect()->route('productos.index')
                         ->with('message', 'Producto eliminado exitosamente.');
    }
}