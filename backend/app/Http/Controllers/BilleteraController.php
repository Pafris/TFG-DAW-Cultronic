<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BilleteraController extends Controller
{
    /**
     * Permite a un usuario agregar o quitar dinero (ficticio) de su cuenta
     */
    public function actualizarSaldo(Request $request)
    {
        $request->validate([
            'operacion' => 'required|in:agregar,quitar',
            'monto' => 'required|numeric|min:0.01'
        ]);

        $user = auth()->user();

        // Usamos una transacción para garantizar la seguridad
        DB::beginTransaction();
        try {
            // Bloqueamos el registro del usuario para evitar problemas de concurrencia
            $lockedUser = \App\Models\User::where('id', $user->id)->lockForUpdate()->first();

            if ($request->operacion === 'quitar') {
                if ($lockedUser->dinero < $request->monto) {
                    DB::rollBack();
                    return response()->json(['error' => 'Saldo insuficiente para retirar.'], 400);
                }
                $lockedUser->dinero -= $request->monto;
            } else {
                $lockedUser->dinero += $request->monto;
            }

            $lockedUser->save();
            DB::commit();

            return response()->json([
                'message' => 'Saldo actualizado correctamente.',
                'nuevo_saldo' => $lockedUser->dinero
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar el saldo.'], 500);
        }
    }
}
