<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VendedorController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\BodegaController;

Route::resource('vendedores', VendedorController::class);
Route::resource('productos', ProductoController::class);
Route::resource('bodegas', BodegaController::class);
