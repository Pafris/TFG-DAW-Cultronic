<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Anuncio extends Model
{
    protected $fillable = [
        'titulo',
        'descripcion',
        'multimedia',
        'fecha',
        'entradasDisponibles',
        'user_id'
    ];

    protected $casts = [
        'fecha' => 'date',
        'entradasDisponibles' => 'boolean',
    ];

    /**
     * Un anuncio pertenece a un administrador
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Un anuncio tiene muchas entradas
     */
    public function entradas()
    {
        return $this->hasMany(Entrada::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
}
