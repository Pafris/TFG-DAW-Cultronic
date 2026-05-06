import { useState } from 'react';
import './ModalEvento.css';

// Datos de ejemplo del modal (luego vendrán de la API)
const mediaEjemplo = [
  { id: 1, tipo: 'video', src: null },
  { id: 2, tipo: 'imagen', src: 'https://picsum.photos/seed/10/600/400' },
  { id: 3, tipo: 'imagen', src: 'https://picsum.photos/seed/11/600/400' },
];

const comentariosEjemplo = [
  { id: 1, usuario: 'Usuario1', texto: '¡Qué pasada!' },
  { id: 2, usuario: 'Usuario2', texto: 'Me encanta 🔥' },
];

function ModalEvento({ evento, onCerrar }) {
  const [mediaActiva, setMediaActiva] = useState(mediaEjemplo[0]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [comentarios, setComentarios] = useState(comentariosEjemplo);
  const [expandido, setExpandido] = useState(false);

  const descripcion = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut facilisis ipsum elit, id tempus quam semper non. Nullam sagittis, risus ac congue facilisis, est justo venenatis arcu, vehicula varius leo justo eu felis. Mauris bibendum ante eu pellentesque pellentesque.';

  const handleEnviarComentario = () => {
    if (!nuevoComentario.trim()) return;
    setComentarios([...comentarios, { id: Date.now(), usuario: 'Tú', texto: nuevoComentario }]);
    setNuevoComentario('');
  };

  // Cierra el modal si se hace click en el fondo oscuro
  const handleFondo = (e) => {
    if (e.target === e.currentTarget) onCerrar();
  };

  return (
    <div className="modal-fondo" onClick={handleFondo}>
      <div className="modal-contenedor">

        {/* BOTÓN CERRAR */}
        <button className="modal-cerrar" onClick={onCerrar}>✕</button>

        {/* COLUMNA IZQUIERDA */}
        <div className="modal-izquierda">

          {/* REPRODUCTOR PRINCIPAL */}
          <div className="media-principal">
            {mediaActiva.tipo === 'video' ? (
              <div className="video-placeholder">
                <span className="play-btn">▶</span>
              </div>
            ) : (
              <img src={mediaActiva.src} alt="media" className="imagen-principal" />
            )}
          </div>

          {/* MINIATURAS */}
          <div className="miniaturas">
            {mediaEjemplo.map((item) => (
              <div
                key={item.id}
                className={`miniatura ${mediaActiva.id === item.id ? 'activa' : ''}`}
                onClick={() => setMediaActiva(item)}
              >
                {item.tipo === 'video' ? (
                  <div className="miniatura-video">▶</div>
                ) : (
                  <img src={item.src} alt="miniatura" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="modal-derecha">
          <h2 className="modal-titulo">{evento.titulo}</h2>
          <p className="modal-usuario">👤 <span>Usuario · hace 2 horas</span></p>

          <p className="modal-descripcion">
            {expandido ? descripcion : descripcion.slice(0, 120) + '...'}
            <button className="btn-ver-mas" onClick={() => setExpandido(!expandido)}>
              {expandido ? ' Ver menos' : ' Ver más'}
            </button>
          </p>

          {/* COMENTARIOS */}
          <div className="comentarios-seccion">
            <p className="comentarios-titulo">💬 Comentarios</p>
            <div className="comentarios-lista">
              {comentarios.map((c) => (
                <p key={c.id} className="comentario">
                  👤 <strong>{c.usuario}:</strong> {c.texto}
                </p>
              ))}
            </div>

            <div className="comentario-input-row">
              <input
                className="comentario-input"
                type="text"
                placeholder="Escribe un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnviarComentario()}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ModalEvento;
