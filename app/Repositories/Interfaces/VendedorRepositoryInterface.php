<?php

namespace App\Repositories\Interfaces;

use App\Models\Vendedor;

interface VendedorRepositoryInterface 
{
    public function getAllVendedores($search = null);
    public function createVendedor(array $data);
    public function updateVendedor(Vendedor $vendedor, array $data);
    public function deleteVendedor(Vendedor $vendedor);
    
}