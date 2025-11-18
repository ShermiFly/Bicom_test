<?php

namespace App\Repositories\Interfaces;

use App\Models\Bodega;
use Illuminate\Database\Eloquent\Collection;

/**
 * Define el contrato de los métodos para interactuar con el recurso Bodega (Warehouse).
 * Esto desacopla la lógica de negocio del ORM (Eloquent).
 */
interface BodegaRepositoryInterface
{
    /**
     * Obtiene todas las bodegas.
     *
     * @return Collection<int, Bodega>
     */
    public function getAll(): Collection;

    /**
     * Encuentra una bodega por su ID.
     *
     * @param int $id
     * @return Bodega|null
     */
    public function findById(int $id): ?Bodega;

    /**
     * Crea una nueva bodega.
     *
     * @param array<string, mixed> $data
     * @return Bodega
     */
    public function create(array $data): Bodega;

    /**
     * Actualiza una bodega existente.
     *
     * @param int $id
     * @param array<string, mixed> $data
     * @return Bodega|null
     */
    public function update(int $id, array $data): ?Bodega;

    /**
     * Elimina una bodega por su ID.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;
}