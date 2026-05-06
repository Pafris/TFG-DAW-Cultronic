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
     * Crear un nuevo anuncio (solo admin - middleware en rutas)
     */
    public function store(\Illuminate\Http\Request $request)
    {
        // El Paso 6 será validaciones avanzadas, aquí hacemos una validación básica
        $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'fecha' => 'required|date',
            'entradasDisponibles' => 'required|boolean',
            'cantidad' => 'required_if:entradasDisponibles,true|integer|min:1',
            'precio' => 'required_if:entradasDisponibles,true|numeric|min:0'
        ]);

        // 1. Crear el Anuncio
        $anuncio = \App\Models\Anuncio::create([
            'titulo' => $request->titulo,
            'descripcion' => $request->descripcion,
            'multimedia' => $request->multimedia, // Opcional
            'fecha' => $request->fecha,
            'entradasDisponibles' => $request->entradasDisponibles,
        ]);

        // 2. Lógica de generación automática de entradas
        if ($anuncio->entradasDisponibles) {
            $entradasData = [];
            $now = now();
            
            for ($i = 0; $i < $request->cantidad; $i++) {
                $entradasData[] = [
                    'precio' => $request->precio,
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
