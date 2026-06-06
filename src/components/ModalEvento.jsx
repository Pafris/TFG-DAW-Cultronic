import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAnuncioDetalle, comprarEntrada } from '../api';
import './ModalEvento.css';

function ModalEvento({ evento, usuario, onCerrar, onCompraExitosa }) {
  const navigate = useNavigate();
  const [detalles, setDetalles] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [comprando, setComprando] = useState(false);
  const [cantidadCompra, setCantidadCompra] = useState(1);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  // Cargar detalles completos del anuncio en tiempo real si no es una entrada ya comprada
  useEffect(() => {
    if (!evento.esEntrada) {
      setCargando(true);
      fetchAnuncioDetalle(evento.id)
        .then((data) => {
          setDetalles(data);
        })
        .catch((err) => {
          setError(err.message || 'Error al cargar los detalles del evento.');
        })
        .finally(() => {
          setCargando(false);
        });
    } else {
      // Si ya es una entrada comprada, los detalles vienen por prop
      setDetalles(evento);
    }
  }, [evento]);

  const handleComprar = async () => {
    setError('');
    setExito('');
    setComprando(true);

    try {
      const response = await comprarEntrada(evento.id, cantidadCompra);
      setExito(response.message || '¡Entrada comprada correctamente!');
      
      // Esperar 1.5s antes de cerrar y notificar para que el usuario lea el éxito
      setTimeout(() => {
        if (onCompraExitosa) onCompraExitosa();
      }, 1500);
    } catch (err) {
      setError(err.message || 'No se pudo completar la compra.');
    } finally {
      setComprando(false);
    }
  };

  const handleFondo = (e) => {
    if (e.target === e.currentTarget) onCerrar();
  };

  const isGuest = !usuario;
  const isUser = usuario && usuario.role === 'usuario';
  const isAdmin = usuario && usuario.role === 'admin';

  // Comprobar si el evento ya ha pasado
  const eventoFinalizado = detalles?.fecha
    ? new Date(detalles.fecha) < new Date(new Date().toDateString())
    : false;

  // Formatear fechas
  const formatFecha = (f) => {
    if (!f) return 'Próximamente';
    return new Date(f).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="modal-fondo" onClick={handleFondo}>
      <div className={`modal-contenedor-premium ${evento.esEntrada ? 'modo-ticket-layout' : ''}`}>
        
        <button className="modal-cerrar-premium" onClick={onCerrar}>✕</button>

        {cargando ? (
          <div className="modal-loader-container">
            <div className="loader-small"></div>
            <p>Obteniendo información oficial...</p>
          </div>
        ) : error && !detalles ? (
          <div className="modal-error-container">
            <h3>⚠️ Error</h3>
            <p>{error}</p>
            <button onClick={onCerrar} className="btn-primary-small">Cerrar</button>
          </div>
        ) : detalles ? (
          <>
            {/* VISTA 1: DETALLE DE TICKET COMPRADO (esEntrada === true) */}
            {evento.esEntrada ? (
              <div className="ticket-receipt-card">
                <div className="receipt-header">
                  <span className="receipt-brand">Cultronic</span>
                  <span className="receipt-status-pill">✓ COMPRADO</span>
                </div>
                
                <div className="receipt-body">
                  <div className="receipt-event-info">
                    <span className="receipt-label">EVENTO</span>
                    <h2 className="receipt-event-title">{detalles.titulo}</h2>
                    
                    <div className="receipt-grid">
                      <div>
                        <span className="receipt-label">FECHA</span>
                        <span className="receipt-value">{formatFecha(detalles.fecha)}</span>
                      </div>
                      <div>
                        <span className="receipt-label">PRECIO</span>
                        <span className="receipt-value">{parseFloat(detalles.precio).toFixed(2)}€</span>
                      </div>
                      <div>
                        <span className="receipt-label">TICKET ID</span>
                        <span className="receipt-value">#00{detalles.ticketId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* VISTA 2: DETALLE DE ANUNCIO PÚBLICO (esEntrada === false) */
              <div className="event-detail-layout">
                {/* Cabecera / Imagen */}
                <div className="event-detail-header">
                  {detalles.multimedia ? (
                    <img src={detalles.multimedia} alt={detalles.titulo} className="event-detail-img" />
                  ) : (
                    <div className="event-detail-placeholder-gradient">
                      <span>🎨 Cultronic Event Experience</span>
                    </div>
                  )}
                  <div className="event-detail-price-badge">
                    {detalles.precio > 0 ? `${parseFloat(detalles.precio).toFixed(2)}€` : 'Gratuito'}
                  </div>
                </div>

                {/* Contenido / Información */}
                <div className="event-detail-body">
                  <span className="event-detail-date-label">📅 {formatFecha(detalles.fecha)}</span>
                  <h2 className="event-detail-title">{detalles.titulo}</h2>
                  
                  <div className="event-detail-meta-row">
                    {detalles.entradasDisponibles ? (
                      <span className="meta-badge-available">
                        🎫 {detalles.entradas_disponibles} de {detalles.entradas_totales} entradas libres
                      </span>
                    ) : (
                      <span className="meta-badge-info">
                        ℹ️ Evento Informativo (Sin venta)
                      </span>
                    )}
                  </div>

                  <div className="event-detail-description">
                    <h3>Acerca de este evento</h3>
                    <p>{detalles.descripcion}</p>
                  </div>

                  {/* Feedback compra */}
                  {error && <div className="error-alert">⚠️ {error}</div>}
                  {exito && <div className="success-alert">✅ {exito}</div>}

                  {/* Acciones del pie */}
                  <div className="event-detail-actions">
                    {isGuest && (
                      <div className="action-warning-banner">
                        <span>💡</span>
                        <p>
                          Debes <strong className="link-inline" onClick={() => navigate('/login')}>iniciar sesión</strong> para poder reservar o comprar entradas.
                        </p>
                      </div>
                    )}

                    {isAdmin && (
                      <div className="action-admin-banner">
                        <span>🛡️</span>
                        <p>Estás visualizando este anuncio en Modo Organizador (Administrador).</p>
                      </div>
                    )}

                    {eventoFinalizado && (
                      <div className="action-warning-banner red-banner">
                        <span>⏰</span>
                        <p><strong>Evento finalizado.</strong> La fecha de este evento ya ha pasado y no es posible adquirir entradas.</p>
                      </div>
                    )}

                    {isUser && detalles.entradasDisponibles && !eventoFinalizado && (
                      <>
                        {detalles.entradas_disponibles > 0 ? (
                          <div className="purchase-action-row" style={{ flexDirection: 'column', gap: '1rem', alignItems: 'stretch' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                              <div className="purchase-user-info">
                                <span>Tu Saldo: <strong>{parseFloat(usuario.dinero).toFixed(2)}€</strong></span>
                                {usuario.dinero < detalles.precio * cantidadCompra && (
                                  <span className="saldo-insuficiente-txt">Saldo insuficiente.</span>
                                )}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <label htmlFor="qty-select" style={{ fontSize: '0.85rem', color: '#aab8cc' }}>Cantidad:</label>
                                <select 
                                  id="qty-select"
                                  value={cantidadCompra} 
                                  onChange={(e) => setCantidadCompra(parseInt(e.target.value))}
                                  disabled={comprando}
                                  style={{
                                    backgroundColor: '#1e2f47',
                                    border: '1px solid #2a3f5f',
                                    color: 'white',
                                    borderRadius: '5px',
                                    padding: '0.25rem 0.5rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {[...Array(Math.min(5, detalles.entradas_disponibles || 0))].map((_, i) => (
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <button
                              onClick={handleComprar}
                              className="btn-buy-ticket-modal"
                              disabled={comprando || usuario.dinero < detalles.precio * cantidadCompra}
                              style={{ width: '100%' }}
                            >
                              {comprando ? 'Procesando Compra...' : `Comprar ${cantidadCompra} ${cantidadCompra === 1 ? 'Entrada' : 'Entradas'} por ${(detalles.precio * cantidadCompra).toFixed(2)}€`}
                            </button>
                          </div>
                        ) : (
                          <div className="action-warning-banner red-banner">
                            <span>🚫</span>
                            <p><strong>Entradas agotadas.</strong> No quedan pases disponibles para este evento (Sold out).</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

export default ModalEvento;
