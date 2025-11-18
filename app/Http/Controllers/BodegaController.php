<?php

namespace App\Http\Controllers;

use App\Models\Bodega;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Repositories\Interfaces\BodegaRepositoryInterface; // Importamos la interfaz correcta

class BodegaController extends Controller
{
    // Almacenará la implementación del repositorio de Bodega (EloquentBodegaRepository).
    protected BodegaRepositoryInterface $bodegaRepository;

    /**
     * Inyecta la Interfaz en el constructor.
     *
     * @param BodegaRepositoryInterface $bodegaRepository
     */
    public function __construct(BodegaRepositoryInterface $bodegaRepository)
    {
        $this->bodegaRepository = $bodegaRepository;
    }


    /**
     * Muestra una lista de todas las bodegas.
     */
    public function index(Request $request)
    {
        // En este ejemplo, el repositorio solo tiene getAll(). Si necesitas búsqueda/paginación,
        // deberías modificar el método getAll() en BodegaRepositoryInterface y su implementación.
        // Aquí pasamos el request, aunque no se usa directamente en la llamada al repositorio,
        // es útil para mantener el estado de los filtros en Inertia.
        $search = $request->input('search');

        // Nota: Se usará getAll() ya que es el único método disponible en la interfaz actual.
        // Si se necesita búsqueda, el repositorio debería implementarla.
        $bodegas = $this->bodegaRepository->getAll();

        return Inertia::render('bodegas', [ // <-- Nombre del componente correcto
            'bodegas' => $this->bodegaRepository->getAll(),
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Muestra el formulario para crear una nueva bodega.
     */
    public function create()
    {
        return Inertia::render('Bodegas/Crear');
    }

    /**
     * Almacena una nueva bodega en la base de datos.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            // 'unique:bodegas,codigo' asegura que el código sea único en la tabla bodegas.
            'codigo' => ['required', 'string', 'max:20', 'unique:bodegas,codigo'],
            'descripcion' => ['required', 'string', 'max:150'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'bodega_ecommerce' => ['nullable', 'boolean'],
        ]);

        // La inyección de dependencia garantiza que se usa el método create del repositorio.
        $this->bodegaRepository->create($data);

        return redirect()->route('bodegas.index')
                         ->with('message', 'Bodega creada exitosamente.');
    }

    /**
     * Muestra una bodega específica.
     * Usa Route Model Binding, Laravel busca automáticamente la bodega por ID.
     */
    public function show(Bodega $bodega)
    {
        return Inertia::render('Bodegas/Show', [
            'bodega' => $bodega,
        ]);
    }

    /**
     * Muestra el formulario para editar una bodega.
     * Usa Route Model Binding.
     */
    public function edit(Bodega $bodega)
    {
        return Inertia::render('Bodegas/Editar', [
            'bodega' => $bodega,
        ]);
    }

    /**
     * Actualiza una bodega específica.
     * Usa Route Model Binding.
     */
    public function update(Request $request, Bodega $bodega)
    {
        $data = $request->validate([
            // Rule::unique ignora el ID de la bodega actual para permitir mantener el mismo código
            'codigo' => ['required', 'string', 'max:20', Rule::unique('bodegas', 'codigo')->ignore($bodega->id)],
            'descripcion' => ['required', 'string', 'max:150'],
            'direccion' => ['nullable', 'string', 'max:255'],
            'bodega_ecommerce' => ['nullable', 'boolean'],
        ]);

        // Llama al método update del repositorio
        $this->bodegaRepository->update($bodega->id, $data);

        return redirect()->route('bodegas.index')
                         ->with('message', 'Bodega actualizada exitosamente.');
    }

    /**
     * Elimina una bodega específica.
     * Usa Route Model Binding.
     */
    public function destroy(Bodega $bodega)
    {
        // Llama al método delete del repositorio
        $this->bodegaRepository->delete($bodega->id);

        return redirect()->route('bodegas.index')
                         ->with('message', 'Bodega eliminada exitosamente.');
    }
}