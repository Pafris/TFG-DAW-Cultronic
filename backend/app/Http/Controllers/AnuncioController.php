<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AnuncioController extends Controller
{
    /**
     * Listar todos los anuncios públicos
     */
    public function index()
    {
        // Obtener todos los anuncios ordenados por fecha
        $anuncios = \App\Models\Anuncio::orderBy('created_at', 'desc')->get();
        return response()->json($anuncios);
    }

    /**
     * Ver el detalle de un anuncio
     */
    public function show($id)
    {
        $anuncio = \App\Models\Anuncio::findOrFail($id);
        return response()->json($anuncio);
    }

    /**
     * Listar los anuncios creados por el admin autenticado (con estadísticas)
     */
    public function misAnunciosAdmin()
    {
        $anuncios = \App\Models\Anuncio::where('user_id', auth()->id())
            ->withCount(['entradas as entradas_totales'])
            ->withCount(['entradas as entradas_vendidas' => function ($query) {
                $query->whereNotNull('user_id');
            }])
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($anuncios);
    }

    /**
     * Crear un nuevo anuncio (solo admin - middleware en rutas)
     */
    public function store(\App\Http\Requests\StoreAnuncioRequest $request)
    {
        // Aquí ya llega validado por el FormRequest
        $validatedData = $request->validated();

        // 1. Crear el Anuncio
        $anuncio = \App\Models\Anuncio::create([
            'titulo' => $validatedData['titulo'],
            'descripcion' => $validatedData['descripcion'],
            'multimedia' => $validatedData['multimedia'] ?? null,
            'fecha' => $validatedData['fecha'],
            'entradasDisponibles' => $validatedData['entradasDisponibles'],
            'user_id' => auth()->id(), // Asociar al admin que lo crea
        ]);

        // 2. Lógica de generación automática de entradas
        if ($anuncio->entradasDisponibles) {
            $entradasData = [];
            $now = now();
            
            for ($i = 0; $i < $validatedData['cantidad']; $i++) {
                $entradasData[] = [
                    'precio' => $validatedData['precio'],
                    'user_id' => null, // Nadie la ha comprado aún
                    'anuncio_id' => $anuncio->id,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
            
            // Inserción masiva para mejor rendimiento
            \App\Models\Entrada::insert($entradasData);
        }

        return response()->json([
            'message' => 'Anuncio creado correctamente.',
            'anuncio' => $anuncio->load('entradas') // Devolvemos el anuncio con sus entradas generadas
        ], 201);
    }
}
