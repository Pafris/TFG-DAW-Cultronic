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

        // Obtener cantidad de entradas a comprar (entre 1 y 5)
        $cantidad = (int) $request->input('cantidad', 1);
        if ($cantidad < 1 || $cantidad > 5) {
            return response()->json(['error' => 'La cantidad de entradas a comprar debe estar entre 1 y 5.'], 400);
        }

        try {
            // Usamos una transacción para evitar condiciones de carrera (dos personas comprando a la vez)
            $entradasCompradas = \Illuminate\Support\Facades\DB::transaction(function () use ($user, $anuncio_id, $cantidad) {
                
                // 1. Buscamos las entradas que no tengan dueño
                $entradas = \App\Models\Entrada::where('anuncio_id', $anuncio_id)
                            ->whereNull('user_id')
                            ->lockForUpdate()
                            ->take($cantidad)
                            ->get();

                if ($entradas->count() < $cantidad) {
                    throw new \Exception('No quedan suficientes entradas disponibles.', 400);
                }

                // Calcular el precio total
                $precioTotal = $entradas->sum('precio');

                // 2. Verificamos que el usuario tenga saldo suficiente
                if ($user->dinero < $precioTotal) {
                    throw new \Exception('Saldo insuficiente para comprar estas entradas.', 400);
                }

                // 3. Efectuamos la compra
                $user->dinero -= $precioTotal;
                $user->save();

                foreach ($entradas as $entrada) {
                    $entrada->user_id = $user->id;
                    $entrada->save();
                }

                return $entradas;
            });

            return response()->json([
                'message' => $cantidad === 1 ? 'Entrada comprada con éxito.' : "{$cantidad} entradas compradas con éxito.",
                'entradas' => $entradasCompradas
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
