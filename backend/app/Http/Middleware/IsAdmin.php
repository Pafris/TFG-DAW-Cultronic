<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificamos si el usuario está autenticado y si su rol es ADMIN
        // Validamos tanto 'rol' como 'role' para ser compatibles con tu base de datos
        $rol = $request->user()->rol ?? $request->user()->role;
        
        if (strtoupper($rol) !== 'ADMIN') {
            return response()->json([
                'error' => 'No autorizado. Se requieren permisos de administrador.',
                'debug_email' => $request->user() ? $request->user()->email : 'ninguno',
                'debug_role_detectado' => $rol
            ], 403);
        }

        return $next($request);
    }
}
