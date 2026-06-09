import { useState } from 'react';
import { createAnuncio } from '../api';
import './ModalPublicar.css';


function ModalPublicar({ onCerrar, onPublicacionExitosa }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  // Por defecto, fecha de hoy
  const hoyStr = new Date().toISOString().split('T')[0];
  const [fecha, setFecha] = useState(hoyStr);
  
  const [entradasDisponibles, setEntradasDisponibles] = useState(true);
  const [cantidad, setCantidad] = useState(50);
  const [precio, setPrecio] = useState(15.00);
  const [multimedia, setMultimedia] = useState('');
  
  const [publicando, setPublicando] = useState(false);
  const [error, setError] = useState('');

  const handlePublicar = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) {
      setError('El título es obligatorio.');
      return;
    }
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }
    if (!fecha) {
      setError('La fecha es obligatoria.');
      return;
    }

    const payload = {
      titulo,
      descripcion,
      fecha,
      entradasDisponibles,
      multimedia: multimedia.trim() || null
    };

    if (entradasDisponibles) {
      const cantVal = parseInt(cantidad);
      const precioVal = parseFloat(precio);

      if (isNaN(cantVal) || cantVal < 1) {
        setError('La cantidad de entradas debe ser al menos 1.');
        return;
      }
      if (isNaN(precioVal) || precioVal < 0) {
        setError('El precio no puede ser negativo.');
        return;
      }

      payload.cantidad = cantVal;
      payload.precio = precioVal;
    }

    setPublicando(true);
    try {
      await createAnuncio(payload);
      if (onPublicacionExitosa) {
        onPublicacionExitosa();
      }
    } catch (err) {
      setError(err.message || 'Error al publicar el anuncio.');
    } finally {
      setPublicando(false);
    }
  };

  const handleFondo = (e) => {
    if (e.target === e.currentTarget) onCerrar();
  };

  return (
    <div className="modal-fondo" onClick={handleFondo}>
      <div className="modal-publicar-premium">
        
        <button className="modal-cerrar-premium" onClick={onCerrar}>✕</button>
        <h2 className="publicar-titulo-premium">Crear Nuevo Anuncio</h2>
        <p className="publicar-subtitle-premium">Completa los datos para publicar un nuevo evento cultural.</p>

        {error && <div className="error-alert">⚠️ {error}</div>}

        <form onSubmit={handlePublicar} className="publicar-form">
          {/* Fila: Título */}
          <div className="input-group">
            <label className="input-label">Título del Evento</label>
            <input
              className="premium-input"
              type="text"
              placeholder="Ej. Concierto de Jazz al aire libre"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* Fila: Descripción */}
          <div className="input-group">
            <label className="input-label">Descripción</label>
            <textarea
              className="premium-input text-area-pub"
              placeholder="Describe detalladamente de qué trata el evento, cronograma, artistas, etc..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Fila: Fecha */}
          <div className="input-group">
            <label className="input-label">Fecha de Celebración</label>
            <input
              className="premium-input"
              type="date"
              min={hoyStr}
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Fila: URL Multimedia */}
          <div className="input-group">
            <label className="input-label">URL de Imagen de Portada (Opcional)</label>
            <input
              className="premium-input"
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={multimedia}
              onChange={(e) => setMultimedia(e.target.value)}
            />

            {multimedia && (
              <div className="multimedia-preview-box">
                <img src={multimedia} alt="Vista previa" onError={(e) => e.target.style.display = 'none'} />
              </div>
            )}
          </div>

          {/* Checkbox: Venta de Entradas */}
          <div className="checkbox-group-container">
            <label className="checkbox-label-wrapper">
              <input
                type="checkbox"
                checked={entradasDisponibles}
                onChange={(e) => setEntradasDisponibles(e.target.checked)}
              />
              <span className="checkbox-custom-text">Habilitar venta de entradas para este anuncio</span>
            </label>
          </div>

          {/* Campos condicionales si venta de entradas está activa */}
          {entradasDisponibles && (
            <div className="conditional-fields-row animate-fade">
              <div className="input-group flex-1">
                <label className="input-label">Cantidad a Generar</label>
                <input
                  className="premium-input"
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  required
                />
              </div>
              <div className="input-group flex-1">
                <label className="input-label">Precio por Entrada (€)</label>
                <input
                  className="premium-input"
                  type="number"
                  step="0.01"
                  min="0.00"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={publicando}
          >
            {publicando ? 'Creando Anuncio...' : 'Publicar Anuncio Oficial'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalPublicar;
