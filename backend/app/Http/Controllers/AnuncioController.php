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
}
