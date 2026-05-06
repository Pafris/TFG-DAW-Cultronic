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
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
            'entradasDisponibles' => 'boolean',
        ];
    }

    public function entradas()
    {
        return $this->hasMany(Entrada::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
}
