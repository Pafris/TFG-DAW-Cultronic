import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import './LoginPage.css';

function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
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

    try {
      await register({
        name: nombre,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    }
  };

  return (
    <div className="page-bg">
      <div className="card">
        <h1 className="titulo">Crear cuenta 🎉</h1>

        {error && <p className="error-msg">{error}</p>}

        <input
          className="input"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
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
        <input
          className="input"
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button className="btn-entrar" onClick={handleRegister}>
          Crear cuenta
        </button>

        <p className="registro-link">
          ¿Ya tienes cuenta?{' '}
          <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
