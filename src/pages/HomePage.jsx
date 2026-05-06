import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalEvento from '../components/ModalEvento';
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
  return (
    <div className="tarjeta" onClick={onClick}>
      <img src={evento.imagen} alt={evento.titulo} className="tarjeta-img" />
      <div className="tarjeta-body">
        <h3 className="tarjeta-titulo">{evento.titulo}</h3>
        <p className="tarjeta-desc">{evento.descripcion}</p>
        <div className="tarjeta-stats">
          <span>❤️ {evento.likes}</span>
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

  return (
    <div className="home-bg">

      {/* NAVBAR */}
      <nav className="navbar">
        <span className="navbar-logo">Nomadic</span>
        <div className="navbar-botones">
          <button className="btn-publicar">+ Publicar</button>
          <button className="btn-outline" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="btn-outline" onClick={() => navigate('/registro')}>Crear Cuenta</button>
        </div>
      </nav>

      {/* GRID DE EVENTOS */}
      <main className="grid-eventos">
        {eventosEjemplo.map((evento) => (
          <TarjetaEvento 
            key={evento.id} 
            evento={evento}
            onClick={() => setEventoSeleccionado(evento)}
          />
        ))}
      </main>
      {/* MODAL — solo se renderiza si hay un evento seleccionado */}
      {eventoSeleccionado && (
        <ModalEvento
          evento={eventoSeleccionado}
          onCerrar={() => setEventoSeleccionado(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
