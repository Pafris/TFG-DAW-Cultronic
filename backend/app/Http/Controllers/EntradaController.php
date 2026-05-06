<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EntradaController extends Controller
{
    /**
     * Lógica para comprar una entrada
     */
    public function comprar(\Illuminate\Http\Request $request, $anuncio_id)
    {
        $user = $request->user();
        
        $anuncio = \App\Models\Anuncio::findOrFail($anuncio_id);

        if (!$anuncio->entradasDisponibles) {
            return response()->json(['error' => 'Este anuncio no tiene entradas a la venta.'], 400);
        }

        try {
            // Usamos una transacción para evitar condiciones de carrera (dos personas comprando a la vez)
            $entradaComprada = \Illuminate\Support\Facades\DB::transaction(function () use ($user, $anuncio_id) {
                
                // 1. Buscamos una entrada que no tenga dueño. lockForUpdate bloquea la fila hasta terminar.
                $entrada = \App\Models\Entrada::where('anuncio_id', $anuncio_id)
                            ->whereNull('user_id')
                            ->lockForUpdate()
                            ->first();

                if (!$entrada) {
                    throw new \Exception('No quedan entradas disponibles (Sold out).', 404);
                }

                // 2. Verificamos que el usuario tenga saldo suficiente
                if ($user->dinero < $entrada->precio) {
                    throw new \Exception('Saldo insuficiente para comprar esta entrada.', 400);
                }

                // 3. Efectuamos la compra
                $user->dinero -= $entrada->precio;
                $user->save();

                $entrada->user_id = $user->id;
                $entrada->save();

                return $entrada;
            });

            return response()->json([
                'message' => 'Entrada comprada con éxito.',
                'entrada' => $entradaComprada
            ]);

        } catch (\Exception $e) {
            $code = $e->getCode() >= 400 && $e->getCode() <= 500 ? $e->getCode() : 500;
            return response()->json(['error' => $e->getMessage()], $code);
        }
    }

    /**
     * Ver todas las entradas del usuario logueado
     */
    public function misEntradas(\Illuminate\Http\Request $request)
    {
        // Traemos las entradas y también cargamos la relación 'anuncio' para ver de qué evento es
        $entradas = $request->user()->entradas()->with('anuncio')->get();
        return response()->json($entradas);
    }

    /**
     * Ver el detalle de una entrada específica del usuario
     */
    public function detalleEntrada(\Illuminate\Http\Request $request, $id)
    {
        // Se busca entre LAS ENTRADAS DEL USUARIO, asegurando que no pueda ver las de otro
        $entrada = $request->user()->entradas()->with('anuncio')->findOrFail($id);
        return response()->json($entrada);
    }
}
