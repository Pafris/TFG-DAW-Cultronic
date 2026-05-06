<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    protected $fillable = [
        'texto',
        'fecha',
        'user_id',
        'anuncio_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function anuncio()
    {
        return $this->belongsTo(Anuncio::class);
    }
}
