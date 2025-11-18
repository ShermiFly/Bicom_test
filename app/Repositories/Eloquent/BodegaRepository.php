<?php

namespace App\Repositories\Eloquent;

use App\Models\Bodega;
use Illuminate\Database\Eloquent\Collection;
use App\Repositories\Interfaces\BodegaRepositoryInterface;

class BodegaRepository implements BodegaRepositoryInterface
{
    /**
     * @var Bodega
     */
    protected Bodega $model;

    /**
     * Constructor del repositorio. Inyecta el modelo Bodega.
     *
     * @param Bodega $model
     */
    public function __construct(Bodega $model)
    {
        $this->model = $model;
    }

    /**
     * @inheritDoc
     */
    public function getAll(): Collection
    {
        // Se puede añadir lógica de ordenamiento o paginación aquí si es necesario
        return $this->model->all();
    }

    /**
     * @inheritDoc
     */
    public function findById(int $id): ?Bodega
    {
        return $this->model->find($id);
    }

    /**
     * @inheritDoc
     */
    public function create(array $data): Bodega
    {
        // El método create() utiliza la propiedad $fillable definida en el modelo
        return $this->model->create($data);
    }

    /**
     * @inheritDoc
     */
    public function update(int $id, array $data): ?Bodega
    {
        $bodega = $this->findById($id);

        if ($bodega) {
            // El método fill() y save() respeta la propiedad $fillable
            $bodega->fill($data)->save();
            return $bodega;
        }

        return null;
    }

    /**
     * @inheritDoc
     */
    public function delete(int $id): bool
    {
        $bodega = $this->findById($id);

        if ($bodega) {
            return $bodega->delete();
        }

        return false;
    }
}