import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // ← nuevo

  const handleLogin = () => {
 
    navigate('/home');
  };  return (
    <div className="page-bg">
      <div className="card">
        <h1 className="titulo">Bienvenido 👋</h1>

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
          ¿No tienes cuenta? <a href="#">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
