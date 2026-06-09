import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, fetchMe } from '../api';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [iniciandoSesion, setIniciandoSesion] = useState(false);
  const navigate = useNavigate();

  // Comprobar si ya está logueado al cargar la página
  useEffect(() => {
    fetchMe()
      .then((user) => {
        if (user && user.id) {
          navigate('/home');
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setIniciandoSesion(true);
    try {
      await login({ email, password });
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setIniciandoSesion(false);
    }
  };

  if (loading) {
    return (
      <div className="page-bg">
        <div className="loader-container">
          <div className="loader"></div>
          <p className="loader-text">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-bg">
      <div className="glass-card">
        <div className="logo-section">
          <span className="glow-logo">Cultronic</span>
          <p className="subtitle">Explora. Conecta. Vive.</p>
        </div>
        
        <h2 className="card-titulo">Iniciar Sesión</h2>

        {error && (
          <div className="error-alert animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="form-container">
          <div className="input-group">
            <label className="input-label">Correo Electrónico</label>
            <input
              className="premium-input"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              className="premium-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={iniciandoSesion}
          >
            {iniciandoSesion ? 'Conectando...' : 'Entrar'}
          </button>
        </form>

        <div className="divider">
          <span>O</span>
        </div>

        <p className="registro-link">
          ¿No tienes una cuenta?{' '}
          <span className="link-text" onClick={() => navigate('/registro')}>
            Regístrate aquí
          </span>
        </p>
        
        <div className="guest-action">
          <span className="link-text-secondary" onClick={() => navigate('/home')}>
            Continuar como Invitado ➔
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
