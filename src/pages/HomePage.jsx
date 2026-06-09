import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalEvento from '../components/ModalEvento';
import ModalPublicar from '../components/ModalPublicar';
import { 
  fetchAnuncios, 
  fetchMe, 
  logout, 
  fetchAdminAnuncios, 
  fetchMisEntradas,
  actualizarSaldo 
} from '../api';
import './HomePage.css';

// Componente para tarjetas de eventos
function TarjetaEvento({ evento, onClick }) {
  const sinEntradas = !evento.entradasDisponibles;

  // Comprobar si el evento ya ha pasado
  const eventoFinalizado = evento.fecha
    ? new Date(evento.fecha) < new Date(new Date().toDateString())
    : false;

  // Formatear fecha
  const fechaFormateada = evento.fecha
    ? new Date(evento.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Próximamente';

  return (
    <div className="tarjeta-premium" onClick={onClick}>
      <div className="tarjeta-media-container">
        {evento.imagen ? (
          <img src={evento.imagen} alt={evento.titulo} className="tarjeta-img-premium" />
        ) : (
          <div className="tarjeta-placeholder-gradient">
            <span>🎨 Cultronic Event</span>
          </div>
        )}
        <div className="tarjeta-badge-date">{fechaFormateada}</div>
        {evento.precio !== undefined && (
          <div className="tarjeta-badge-price">
            {evento.precio > 0 ? `${parseFloat(evento.precio).toFixed(2)}€` : 'Gratis'}
          </div>
        )}
      </div>
      <div className="tarjeta-info">
        <h3 className="tarjeta-titulo-premium">{evento.titulo}</h3>
        <p className="tarjeta-desc-premium">
          {evento.descripcion.length > 80 
            ? `${evento.descripcion.substring(0, 80)}...` 
            : evento.descripcion}
        </p>
        <div className="tarjeta-footer">
          {eventoFinalizado ? (
            <span className="badge-finalizado">⏰ Evento Finalizado</span>
          ) : sinEntradas ? (
            <span className="badge-libre">🎟️ Entrada Libre</span>
          ) : (
            <span className="badge-disponible">🎫 Entradas Disponibles</span>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para tarjetas de tickets comprados
function TarjetaTicket({ ticket, onClick }) {
  const fechaFormateada = ticket.anuncio?.fecha
    ? new Date(ticket.anuncio.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Próximamente';

  return (
    <div className="tarjeta-entrada" onClick={onClick}>
      <div className="entrada-info">
        <h3 className="entrada-titulo">{ticket.anuncio?.titulo || 'Evento sin título'}</h3>
        <div className="entrada-meta">
          <span>📅 {fechaFormateada}</span>
          <span>💶 {parseFloat(ticket.precio).toFixed(2)}€</span>
          <span className="entrada-id">#{ticket.id}</span>
        </div>
      </div>
      <span className="entrada-badge">Entrada</span>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cargandoUser, setCargandoUser] = useState(true);
  
  // Estados de listas
  const [eventos, setEventos] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [error, setError] = useState('');
  
  // Navegación de pestañas: 'explorar' | 'entradas' | 'admin-creaciones'
  const [pestanaActiva, setPestanaActiva] = useState('explorar');
  
  // Modales
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarPublicar, setMostrarPublicar] = useState(false);
  const [mostrarBilletera, setMostrarBilletera] = useState(false);
  
  // Form Billetera
  const [operacionBilletera, setOperacionBilletera] = useState('agregar'); // 'agregar' | 'quitar'
  const [montoBilletera, setMontoBilletera] = useState('');
  const [errorBilletera, setErrorBilletera] = useState('');
  const [exitoBilletera, setExitoBilletera] = useState('');
  const [actualizandoSaldoState, setActualizandoSaldoState] = useState(false);

  // Cargar usuario e info inicial
  // fetchMe devuelve el user si hay sesión, o null si no la hay (nunca lanza error)
  const cargarUsuario = async () => {
    try {
      const userData = await fetchMe();
      setUser(userData && userData.id ? userData : null);
    } catch {
      setUser(null);
    } finally {
      setCargandoUser(false);
    }
  };

  const cargarAnunciosPublicos = async () => {
    setCargandoDatos(true);
    setError('');
    try {
      const data = await fetchAnuncios();
      const items = data.map((anuncio) => ({
        id: anuncio.id,
        titulo: anuncio.titulo,
        descripcion: anuncio.descripcion || 'Sin descripción',
        fecha: anuncio.fecha,
        entradasDisponibles: anuncio.entradasDisponibles,
        precio: anuncio.entradas?.[0]?.precio ?? (anuncio.precio !== undefined ? anuncio.precio : 0),
        imagen: anuncio.multimedia || null
      }));
      setEventos(items);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los anuncios.');
    } finally {
      setCargandoDatos(false);
    }
  };

  const cargarAnunciosAdmin = async () => {
    setCargandoDatos(true);
    setError('');
    try {
      const data = await fetchAdminAnuncios();
      setEventos(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus anuncios de administrador.');
    } finally {
      setCargandoDatos(false);
    }
  };

  const cargarTicketsUsuario = async () => {
    setCargandoDatos(true);
    setError('');
    try {
      const data = await fetchMisEntradas();
      setTickets(data);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar tus entradas.');
    } finally {
      setCargandoDatos(false);
    }
  };

  // Efecto inicial para usuario y anuncios
  useEffect(() => {
    cargarUsuario();
    cargarAnunciosPublicos();
  }, []);

  // Efecto cuando cambia la pestaña activa
  useEffect(() => {
    if (pestanaActiva === 'explorar') {
      cargarAnunciosPublicos();
    } else if (pestanaActiva === 'admin-creaciones') {
      cargarAnunciosAdmin();
    } else if (pestanaActiva === 'entradas') {
      cargarTicketsUsuario();
    }
  }, [pestanaActiva]);

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Error al cerrar sesión', err);
    } finally {
      setUser(null);
      setPestanaActiva('explorar');
      cargarAnunciosPublicos();
    }
  };

  // Manejar actualización de billetera
  const handleActualizarBilletera = async (e) => {
    e.preventDefault();
    setErrorBilletera('');
    setExitoBilletera('');

    const montoVal = parseFloat(montoBilletera);
    if (isNaN(montoVal) || montoVal <= 0) {
      setErrorBilletera('Introduce un monto válido mayor que 0.');
      return;
    }

    setActualizandoSaldoState(true);
    try {
      const res = await actualizarSaldo(operacionBilletera, montoVal);
      setExitoBilletera(res.message || 'Saldo actualizado con éxito.');
      setMontoBilletera('');
      // Recargar datos de usuario para actualizar saldo en cabecera
      await cargarUsuario();
    } catch (err) {
      setErrorBilletera(err.message || 'Error al actualizar el saldo.');
    } finally {
      setActualizandoSaldoState(false);
    }
  };

  // Callback cuando se compra una entrada desde el modal
  const handleCompraExitosa = async () => {
    setEventoSeleccionado(null);
    await cargarUsuario(); // Recargar billetera
    if (pestanaActiva === 'explorar') {
      await cargarAnunciosPublicos(); // Recargar inventarios de entradas
    }
  };

  // Callback cuando se publica un anuncio
  const handlePublicacionExitosa = async () => {
    setMostrarPublicar(false);
    if (pestanaActiva === 'explorar') {
      await cargarAnunciosPublicos();
    } else if (pestanaActiva === 'admin-creaciones') {
      await cargarAnunciosAdmin();
    }
  };

  const esAdmin = user && user.role === 'ADMIN';
  const esUsuarioNormal = user && user.role === 'USUARIO';

  return (
    <div className="home-dashboard">
      {/* NAVBAR */}
      <nav className="navbar-premium">
        <div className="navbar-left">
          <span className="navbar-brand">Cultronic</span>
          <div className="navbar-links">
            <button 
              className={`nav-tab-btn ${pestanaActiva === 'explorar' ? 'active' : ''}`}
              onClick={() => setPestanaActiva('explorar')}
            >
              Explorar Eventos
            </button>
            {esUsuarioNormal && (
              <button 
                className={`nav-tab-btn ${pestanaActiva === 'entradas' ? 'active' : ''}`}
                onClick={() => setPestanaActiva('entradas')}
              >
                Mis Entradas
              </button>
            )}
            {esAdmin && (
              <>
                <button 
                  className="nav-tab-btn"
                  onClick={() => setMostrarPublicar(true)}
                >
                  Crear Evento
                </button>
                <button 
                  className={`nav-tab-btn ${pestanaActiva === 'admin-creaciones' ? 'active' : ''}`}
                  onClick={() => setPestanaActiva('admin-creaciones')}
                >
                  Mis Eventos
                </button>
              </>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {cargandoUser ? (
            <span className="navbar-loading">Verificando...</span>
          ) : user ? (
            <div className="user-profile-widget">
              {esUsuarioNormal && (
                <div className="wallet-widget" onClick={() => setMostrarBilletera(true)} title="Gestionar billetera">
                  <span className="wallet-icon">💳</span>
                  <span className="wallet-balance">{parseFloat(user.dinero).toFixed(2)}€</span>
                  <button className="btn-wallet-add">+</button>
                </div>
              )}
              
              <div className="user-details-card">
                <span className="user-name">👤 {user.name}</span>
                <span className={`user-role-badge ${esAdmin ? 'role-admin' : 'role-user'}`}>
                  {esAdmin ? 'ADMIN' : 'USUARIO'}
                </span>
              </div>

              <button className="btn-logout" onClick={handleLogout} title="Cerrar sesión">
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <button className="btn-nav-outline" onClick={() => navigate('/login')}>
                Iniciar Sesión
              </button>
              <button className="btn-nav-primary" onClick={() => navigate('/registro')}>
                Crear Cuenta
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* HEADER BANNER */}
      {(pestanaActiva !== 'explorar' || esAdmin) && (
        <header className="dashboard-banner">
          <div className="banner-content">
            <h1>
              {pestanaActiva === 'entradas' && "Tus Entradas Adquiridas"}
              {pestanaActiva === 'admin-creaciones' && "Panel de Control de Eventos"}
            </h1>
            <p>
              {pestanaActiva === 'entradas' && "Aquí tienes el listado de tus pases oficiales de acceso. Haz clic sobre cualquiera para ver los detalles de entrada."}
              {pestanaActiva === 'admin-creaciones' && "Gestiona las publicaciones, monitorea las estadísticas de tickets vendidos y crea nuevos eventos."}
            </p>
          </div>
          {esAdmin && (
            <button className="btn-publish-banner" onClick={() => setMostrarPublicar(true)}>
              + Crear Nuevo Anuncio
            </button>
          )}
        </header>
      )}

      {/* MAIN CONTAINER */}
      <main className="dashboard-main-content">
        
        {/* PESTAÑA EXPLORAR EVENTOS */}
        {pestanaActiva === 'explorar' && (
          <section className="grid-section">
            <h2 className="section-title">Anuncios de Eventos</h2>
            {cargandoDatos ? (
              <div className="loader-inner-container">
                <div className="loader-small"></div>
                <p>Cargando eventos en tiempo real...</p>
              </div>
            ) : error ? (
              <div className="error-card">
                <p>{error}</p>
                <button onClick={cargarAnunciosPublicos} className="btn-retry">Reintentar</button>
              </div>
            ) : eventos.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">🎟️</div>
                <h3>No hay eventos creados</h3>
                <p>La cartelera está vacía en este momento. Las publicaciones se irán creando desde cero.</p>
                {esAdmin && (
                  <button className="btn-primary-small" onClick={() => setMostrarPublicar(true)}>
                    Crear Primer Anuncio
                  </button>
                )}
              </div>
            ) : (
              <div className="grid-premium-layout">
                {eventos.map((evento) => (
                  <TarjetaEvento
                    key={evento.id}
                    evento={evento}
                    onClick={() => setEventoSeleccionado({ ...evento, esEntrada: false })}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* PESTAÑA MIS ENTRADAS COMPRADAS */}
        {pestanaActiva === 'entradas' && esUsuarioNormal && (
          <section className="grid-section">
            <h2 className="section-title">Mis Tickets</h2>
            {cargandoDatos ? (
              <div className="loader-inner-container">
                <div className="loader-small"></div>
                <p>Buscando tus pases oficiales...</p>
              </div>
            ) : error ? (
              <div className="error-card">
                <p>{error}</p>
                <button onClick={cargarTicketsUsuario} className="btn-retry">Reintentar</button>
              </div>
            ) : tickets.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">🎟️</div>
                <h3>No tienes ninguna entrada</h3>
                <p>Aún no has adquirido tickets para ningún evento. ¡Explora la cartelera y compra tu primer ticket!</p>
                <button className="btn-primary-small" onClick={() => setPestanaActiva('explorar')}>
                  Explorar Cartelera
                </button>
              </div>
            ) : (
              <div className="grid-tickets-layout">
                {tickets.map((ticket) => (
                  <TarjetaTicket
                    key={ticket.id}
                    ticket={ticket}
                    onClick={() => setEventoSeleccionado({
                      id: ticket.anuncio?.id || 0,
                      titulo: ticket.anuncio?.titulo || 'Evento',
                      descripcion: ticket.anuncio?.descripcion || '',
                      fecha: ticket.anuncio?.fecha || '',
                      precio: ticket.precio,
                      multimedia: ticket.anuncio?.multimedia || null,
                      ticketId: ticket.id,
                      esEntrada: true // Activa modo ticket
                    })}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* PESTAÑA MIS CREACIONES (ADMIN) */}
        {pestanaActiva === 'admin-creaciones' && esAdmin && (
          <section className="admin-section">
            <h2 className="section-title">Administración y Estadísticas de Ventas</h2>
            {cargandoDatos ? (
              <div className="loader-inner-container">
                <div className="loader-small"></div>
                <p>Cargando estadísticas de tus anuncios...</p>
              </div>
            ) : error ? (
              <div className="error-card">
                <p>{error}</p>
                <button onClick={cargarAnunciosAdmin} className="btn-retry">Reintentar</button>
              </div>
            ) : eventos.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">📊</div>
                <h3>No tienes anuncios publicados</h3>
                <p>No has creado ningún anuncio con esta cuenta de organizador todavía.</p>
                <button className="btn-primary-small" onClick={() => setMostrarPublicar(true)}>
                  Crear Anuncio
                </button>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-stats-table">
                  <thead>
                    <tr>
                      <th>Título del Evento</th>
                      <th>Fecha</th>
                      <th>Estado de Venta</th>
                      <th style={{ textAlign: 'center' }}>Ventas Realizadas</th>
                      <th style={{ textAlign: 'center' }}>Ingresos Estimados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map((anuncio) => {
                      const totales = anuncio.entradas_totales ?? 0;
                      const vendidas = anuncio.entradas_vendidas ?? 0;
                      // El precio de la entrada se asume el que tienen las entradas
                      // Para calcular ingresos, sumamos el precio de las entradas vendidas.
                      // Como la API nos da conteo, podemos estimar el ingreso si conocemos el precio.
                      // O podemos ver que la API tiene "misAnunciosAdmin" que no incluye precio directo pero en el backend se puede calcular
                      // Vamos a estimar ingresos si nos devolviera precio, o simplemente mostramos tickets vendidos.
                      const porcentajeVenta = totales > 0 ? Math.round((vendidas / totales) * 100) : 0;
                      const precioEntrada = anuncio.entradas?.[0]?.precio ?? 0;
                      const ingresos = vendidas * precioEntrada;

                      return (
                        <tr key={anuncio.id}>
                          <td className="table-event-title">{anuncio.titulo}</td>
                          <td>{anuncio.fecha ? new Date(anuncio.fecha).toLocaleDateString('es-ES') : '-'}</td>
                          <td>
                            {anuncio.entradasDisponibles ? (
                              <span className="badge-table-disponible">Con Entradas</span>
                            ) : (
                              <span className="badge-table-no-entradas">Informativo</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="sales-progress-wrapper">
                              <span className="sales-numbers">{vendidas} / {totales} ({porcentajeVenta}%)</span>
                              {totales > 0 && (
                                <div className="progress-bar-bg">
                                  <div className="progress-bar-fill" style={{ width: `${porcentajeVenta}%` }}></div>
                                </div>
                              )}
                            </div>
                          </td>
                          <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#10b981' }}>
                            {totales > 0 ? `${ingresos.toFixed(2)}€` : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* MODAL EVENTO / TICKET DETALLE */}
      {eventoSeleccionado && (
        <ModalEvento
          evento={eventoSeleccionado}
          usuario={user}
          onCerrar={() => setEventoSeleccionado(null)}
          onCompraExitosa={handleCompraExitosa}
        />
      )}

      {/* MODAL PUBLICAR (ADMIN) */}
      {mostrarPublicar && (
        <ModalPublicar 
          onCerrar={() => setMostrarPublicar(false)} 
          onPublicacionExitosa={handlePublicacionExitosa}
        />
      )}

      {/* MODAL BILLETERA (USUARIO) */}
      {mostrarBilletera && esUsuarioNormal && (
        <div className="modal-fondo" onClick={(e) => e.target === e.currentTarget && setMostrarBilletera(false)}>
          <div className="wallet-modal-content">
            <button className="wallet-modal-close" onClick={() => setMostrarBilletera(false)}>✕</button>
            <h2 className="wallet-modal-title">Mi Billetera</h2>
            <p className="wallet-modal-subtitle">Añade o retira fondos para comprar tus entradas.</p>

            <div className="current-balance-display">
              <span className="balance-label">Saldo Disponible</span>
              <span className="balance-amount">{parseFloat(user.dinero).toFixed(2)}€</span>
            </div>

            {errorBilletera && <div className="error-alert">⚠️ {errorBilletera}</div>}
            {exitoBilletera && <div className="success-alert">✅ {exitoBilletera}</div>}

            <form onSubmit={handleActualizarBilletera} className="wallet-form">
              <div className="wallet-op-selector">
                <button
                  type="button"
                  className={`op-btn ${operacionBilletera === 'agregar' ? 'active' : ''}`}
                  onClick={() => {
                    setOperacionBilletera('agregar');
                    setErrorBilletera('');
                    setExitoBilletera('');
                  }}
                >
                  📥 Recargar Saldo
                </button>
                <button
                  type="button"
                  className={`op-btn ${operacionBilletera === 'quitar' ? 'active' : ''}`}
                  onClick={() => {
                    setOperacionBilletera('quitar');
                    setErrorBilletera('');
                    setExitoBilletera('');
                  }}
                >
                  📤 Retirar Fondos
                </button>
              </div>

              <div className="wallet-input-group">
                <label>Cantidad en Euros (€)</label>
                <div className="monto-input-wrapper">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={montoBilletera}
                    onChange={(e) => setMontoBilletera(e.target.value)}
                    required
                  />
                  <span className="currency-symbol">€</span>
                </div>
              </div>

              <button type="submit" className="btn-wallet-submit" disabled={actualizandoSaldoState}>
                {actualizandoSaldoState ? 'Procesando...' : 'Confirmar Transacción'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
