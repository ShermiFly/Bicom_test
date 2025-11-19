<?php

namespace App\Repositories\Eloquent;
use App\Repositories\Interfaces\VendedorRepositoryInterface;
use App\Models\Vendedor;

class VendedorRepository implements VendedorRepositoryInterface 
{
    
    public function getAllVendedores($search = null) 
    {
        $query = Vendedor::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('descripcion', 'like', "%{$search}%")
                  ->orWhere('usuario', 'like', "%{$search}%")
                  ->orWhere('sucursal', 'like', "%{$search}%");
            });
        }

        // Usamos paginate(10) en lugar de all()
        return $query->orderBy('id', 'desc')->paginate(10);
    }

    public function createVendedor(array $data) 
    {
        return Vendedor::create($data);
    }

    public function updateVendedor(Vendedor $vendedor, array $data) 
    {
        return $vendedor->update($data);
    }

    public function deleteVendedor(Vendedor $vendedor) 
    {
        return $vendedor->delete();
    }
}