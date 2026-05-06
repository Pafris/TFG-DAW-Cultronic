<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
})->middleware('auth');

Route::get('/panel-admin', function () {
    return view('panel-admin');
})->middleware('role:admin');


Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

// ==========================================
// RUTAS DEL SISTEMA DE ANUNCIOS Y ENTRADAS
// ==========================================

use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\EntradaController;

// 1. Rutas Públicas (Invitados y Registrados)
Route::get('/anuncios', [AnuncioController::class, 'index']);
Route::get('/anuncios/{id}', [AnuncioController::class, 'show']);

// 2. Rutas Protegidas (Solo Usuarios Registrados)
Route::middleware('auth')->group(function () {
    // Comprar entrada para un anuncio
    Route::post('/anuncios/{id}/comprar', [EntradaController::class, 'comprar']);
    
    // Gestión de entradas del usuario
    Route::get('/mis-entradas', [EntradaController::class, 'misEntradas']);
    Route::get('/mis-entradas/{id}', [EntradaController::class, 'detalleEntrada']);
});

// 3. Rutas de Administrador
// Protegidas por auth y por el middleware 'admin' que creamos en el paso 4
Route::middleware(['auth', 'admin'])->group(function () {
    Route::post('/anuncios', [AnuncioController::class, 'store']);
});
