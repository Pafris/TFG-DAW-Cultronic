<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Anuncio;
use App\Models\Comentario;

class ComentarioController extends Controller
{
    /**
     * Listar comentarios de un anuncio (público)
     */
    public function index($anuncioId)
    {
        $anuncio = Anuncio::findOrFail($anuncioId);

        $comentarios = $anuncio->comentarios()
            ->with('user:id,name')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($comentarios);
    }

    /**
     * Crear un comentario en un anuncio (solo usuarios autenticados con role=usuario)
     */
    public function store(Request $request, $anuncioId)
    {
        $request->validate([
            'texto' => 'required|string|max:1000',
        ]);

        $anuncio = Anuncio::findOrFail($anuncioId);

        // No se puede comentar si el evento ya finalizó
        if ($anuncio->fecha && $anuncio->fecha->lt(today())) {
            return response()->json([
                'message' => 'No se puede comentar en un evento que ya ha finalizado.'
            ], 403);
        }

        // Solo los usuarios con role=USUARIO pueden comentar (no admins)
        if (auth()->user()->role !== 'USUARIO') {
            return response()->json([
                'message' => 'Los administradores no pueden publicar comentarios.'
            ], 403);
        }

        $comentario = Comentario::create([
            'texto'      => $request->texto,
            'fecha'      => today(),
            'user_id'    => auth()->id(),
            'anuncio_id' => $anuncio->id,
        ]);

        // Devolver el comentario con los datos del usuario
        $comentario->load('user:id,name');

        return response()->json($comentario, 201);
    }
}
