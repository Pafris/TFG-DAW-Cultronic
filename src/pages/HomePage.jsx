import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ModalEvento from '../components/ModalEvento';
import ModalPublicar from '../components/ModalPublicar';
import { fetchAnuncios } from '../api';
import './HomePage.css';

const eventosEjemplo = [
  { id: 1, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/1/400/250' },
  { id: 2, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/2/400/250' },
  { id: 3, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/3/400/250' },
  { id: 4, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/4/400/250' },
  { id: 5, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/5/400/250' },
  { id: 6, titulo: 'Tarde de juegos de mesa', descripcion: 'Descripción breve del post...', likes: 24, comentarios: 8, imagen: 'https://picsum.photos/seed/6/400/250' },
  { id: 7, titulo: 'Concierto en la plaza', descripcion: 'Descripción breve del post...', likes: 31, comentarios: 12, imagen: 'https://picsum.photos/seed/7/400/250' },
  { id: 8, titulo: 'Exposición de arte urbano', descripcion: 'Descripción breve del post...', likes: 18, comentarios: 5, imagen: 'https://picsum.photos/seed/8/400/250' },
  { id: 9, titulo: 'Mercado artesanal', descripcion: 'Descripción breve del post...', likes: 42, comentarios: 20, imagen: 'https://picsum.photos/seed/9/400/250' },
];

function TarjetaEvento({ evento, onClick }) {
  const [likes, setLikes] = useState(() => {
    const guardado = localStorage.getItem(`likes_${evento.id}`);
    return guardado ? parseInt(guardado) : evento.likes;
  });

  const [likeDado, setLikeDado] = useState(() => {
    return localStorage.getItem(`liked_${evento.id}`) === 'true';
  });

  const handleLike = (e) => {
    e.stopPropagation();
    const nuevoLike = !likeDado;
    const nuevosLikes = nuevoLike ? likes + 1 : likes - 1;
    setLikeDado(nuevoLike);
    setLikes(nuevosLikes);
    localStorage.setItem(`liked_${evento.id}`, nuevoLike);
    localStorage.setItem(`likes_${evento.id}`, nuevosLikes);
  };

  return (
    <div className="tarjeta" onClick={onClick}>
      <img src={evento.imagen} alt={evento.titulo} className="tarjeta-img" />
      <div className="tarjeta-body">
        <h3 className="tarjeta-titulo">{evento.titulo}</h3>
        <p className="tarjeta-desc">{evento.descripcion}</p>
        <div className="tarjeta-stats">
          <span className={`stat-like ${likeDado ? 'liked' : ''}`} onClick={handleLike}>
            ❤️ {likes}
          </span>
          <span>💬 {evento.comentarios}</span>
          <span>🔗</span>
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [mostrarPublicar, setMostrarPublicar] = useState(false);
  const [eventos, setEventos] = useState(eventosEjemplo);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarAnuncios = async () => {
      try {
        const data = await fetchAnuncios();
        if (!activo) return;

        const items = data.map((anuncio) => ({
          id: anuncio.id,
          titulo: anuncio.titulo,
          descripcion: anuncio.descripcion || 'Descripción breve del anuncio...',
          likes: anuncio.likes ?? 0,
          comentarios: anuncio.entradasDisponibles ?? 0,
          imagen: anuncio.multimedia || `https://picsum.photos/seed/${anuncio.id}/400/250`,
        }));

        setEventos(items.length ? items : eventosEjemplo);
      } catch (err) {
        setError(err.message || 'No se pudieron cargar los anuncios.');
      } finally {
        setCargando(false);
      }
    };

    cargarAnuncios();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <div className="home-bg">
      <nav className="navbar">
        <span className="navbar-logo">Nomadic</span>
        <div className="navbar-botones">
          <button className="btn-publicar" onClick={() => setMostrarPublicar(true)}>+ Publicar</button>
          <button className="btn-outline" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="btn-outline" onClick={() => navigate('/registro')}>Crear Cuenta</button>
        </div>
      </nav>

      <main className="grid-eventos">
        {cargando ? (
          <p>Cargando anuncios...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : (
          eventos.map((evento) => (
            <TarjetaEvento
              key={evento.id}
              evento={evento}
              onClick={() => setEventoSeleccionado(evento)}
            />
          ))
        )}
      </main>

      {eventoSeleccionado && (
        <ModalEvento
          evento={eventoSeleccionado}
          onCerrar={() => setEventoSeleccionado(null)}
        />
      )}

      {mostrarPublicar && (
        <ModalPublicar onCerrar={() => setMostrarPublicar(false)} />
      )}
    </div>
  );
}

export default HomePage;
