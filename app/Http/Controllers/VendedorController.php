<?php

namespace App\Http\Controllers;

use App\Models\Vendedor; 
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\Interfaces\VendedorRepositoryInterface; 

class VendedorController extends Controller
{
    //Declaramos la variable que obedecera las reglas de interface
    //almacenará la implementación del repositorio de vendedor.
    protected VendedorRepositoryInterface $vendedorRepository;

    // Inyecta la Interfaz en el constructor
    public function __construct(VendedorRepositoryInterface $vendedorRepository)
    {
        $this->vendedorRepository = $vendedorRepository;
    }


    /**
     * Muestra una lista de todos los vendedores.
     */
    public function index(Request $request) 
    {
        // 1. Capturamos el texto del buscador
        $search = $request->input('search');

        return Inertia::render('vendedores', [ 
            // 2. Enviamos los vendedores filtrados
            'vendedores' => $this->vendedorRepository->getAllVendedores($search),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo vendedor.
     */
    public function create()
    {
        return Inertia::render('Vendedores/Crear');
    }

    /**
     * Almacena un nuevo vendedor en la base de datos.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'descripcion' => 'required|string',
            'usuario' => 'required|string|max:255',
            'sucursal' => 'required|string|max:255',
        ]);

        
        $this->vendedorRepository->createVendedor($data);

        return redirect()->route('vendedores.index')
                         ->with('message', 'Vendedor creado exitosamente.');
    }

    /**
     * Muestra un vendedor específico.
     */
    public function show(Vendedor $vendedor)
    {
        
        return Inertia::render('Vendedores/Show', [
            'vendedor' => $vendedor
        ]);
    }

    /**
     * Muestra el formulario para editar un vendedor.
     */
    public function edit(Vendedor $vendedor)
    {
        
        return Inertia::render('Vendedores/Editar', [ 
            'vendedor' => $vendedor
        ]);
    }

    /**
     * Actualiza un vendedor específico.
     */
    public function update(Request $request, Vendedor $vendedor)
    {
        $data = $request->validate([
            'descripcion' => 'required|string',
            'usuario' => 'required|string|max:255',
            'sucursal' => 'required|string|max:255',
        ]);

        
        $this->vendedorRepository->updateVendedor($vendedor, $data);

        return redirect()->route('vendedores.index')
                         ->with('message', 'Vendedor actualizado exitosamente.');
    }

    /**
     * Elimina un vendedor específico.
     */
    public function destroy(Vendedor $vendedor)
    {
        
        $this->vendedorRepository->deleteVendedor($vendedor);

        return redirect()->route('vendedores.index')
                         ->with('message', 'Vendedor eliminado exitosamente.');
    }
}