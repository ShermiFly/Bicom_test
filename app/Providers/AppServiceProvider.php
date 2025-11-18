<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\VendedorRepositoryInterface;
use App\Repositories\Eloquent\VendedorRepository;
use App\Repositories\Interfaces\ProductoRepositoryInterface;
use App\Repositories\Eloquent\ProductoRepository;
use App\Repositories\Interfaces\BodegaRepositoryInterface;
use App\Repositories\Eloquent\BodegaRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            VendedorRepositoryInterface::class, 
            VendedorRepository::class
        );
        $this->app->bind(
            ProductoRepositoryInterface::class, 
            ProductoRepository::class
        );
        $this->app->bind(
            BodegaRepositoryInterface::class,
            BodegaRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
