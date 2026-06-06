import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, fetchMe } from '../api';
import './LoginPage.css';

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [registrando, setRegistrando] = useState(false);
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !email || !password || !confirmPassword) {
      setError('Por favor rellena todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setRegistrando(true);
    try {
      await register({
        name: nombre,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      // Tras el registro correcto, Laravel inicia sesión de forma automática.
      // Así que podemos redirigir a /home directamente
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Revisa los datos.');
    } finally {
      setRegistrando(false);
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
          <p className="subtitle">Únete a la experiencia</p>
        </div>

        <h2 className="card-titulo">Crear Cuenta</h2>

        {error && (
          <div className="error-alert animate-shake">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="form-container">
          <div className="input-group">
            <label className="input-label">Nombre Completo</label>
            <input
              className="premium-input"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirmar Contraseña</label>
            <input
              className="premium-input"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={registrando}
          >
            {registrando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="divider">
          <span>O</span>
        </div>

        <p className="registro-link">
          ¿Ya tienes cuenta?{' '}
          <span className="link-text" onClick={() => navigate('/login')}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
