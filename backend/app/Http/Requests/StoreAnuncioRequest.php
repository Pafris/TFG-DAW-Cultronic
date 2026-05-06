<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnuncioRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // La ruta ya usa el middleware 'admin', así que aquí devolvemos true
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'titulo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'multimedia' => 'nullable|string',
            'fecha' => 'required|date|after_or_equal:today',
            'entradasDisponibles' => 'required|boolean',
            'cantidad' => 'required_if:entradasDisponibles,true|integer|min:1',
            'precio' => 'required_if:entradasDisponibles,true|numeric|min:0'
        ];
    }

    public function messages(): array
    {
        return [
            'cantidad.required_if' => 'Debe especificar la cantidad de entradas que desea generar.',
            'precio.required_if' => 'Debe especificar el precio de la entrada.',
            'fecha.after_or_equal' => 'La fecha del anuncio no puede ser en el pasado.'
        ];
    }
}
