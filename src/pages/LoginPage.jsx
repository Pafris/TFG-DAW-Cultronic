import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('Por favor completa email y contraseña.');
      return;
    }

    try {
      await login({ email, password });
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className="page-bg">
      <div className="card">
        <h1 className="titulo">Bienvenido 👋</h1>

        {error && <p className="error-msg">{error}</p>}

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-entrar" onClick={handleLogin}>
          Entrar
        </button>

        <p className="registro-link">
          ¿No tienes cuenta?{' '}
          <span className="link-text" onClick={() => navigate('/registro')}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
