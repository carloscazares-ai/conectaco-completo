import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { guardarSesion, rutaInicio } from '../lib/sesion.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Manda el correo y la contrasena al backend; si son correctos, guarda la sesion
  async function entrar(correo, contrasena) {
    setError('');
    try {
      const sesion = await api.post('/auth/login', { email: correo, password: contrasena });
      guardarSesion(sesion);
      navigate(rutaInicio(sesion));
    } catch (e) {
      setError(e.message);
    }
  }

  function enviar(evento) {
    evento.preventDefault();
    entrar(email, password);
  }

  return (
    <div className="publica">
      <header className="publica-barra">
        <Link to="/"><Logo /></Link>
      </header>
      <div className="centrado">
        <form className="tarjeta caja-auth form" onSubmit={enviar}>
          <Link to="/" className="texto-suave"><ArrowLeft size={18} /> Volver</Link>
          <div>
            <h1>Iniciar sesión</h1>
            <p className="texto-suave">Qué gusto verte de nuevo.</p>
          </div>

          {error !== '' && <div className="error-form">{error}</div>}

          <label className="campo">
            <span>Correo electrónico</span>
            <div className="input-icono">
              <Mail size={18} />
              <input className="input" type="email" required value={email}
                     onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
            </div>
          </label>
          <label className="campo">
            <span>Contraseña</span>
            <div className="input-icono">
              <Lock size={18} />
              <input className="input" type="password" required value={password}
                     onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" />
            </div>
          </label>

          <button className="btn btn-primario btn-bloque">Iniciar sesión</button>

          <div>
            <span className="texto-tenue">Probar con una cuenta de ejemplo (contraseña demo1234):</span>
            <div className="demo">
              <button type="button" className="btn btn-suave btn-chico"
                      onClick={() => entrar('turista@conectaco.mx', 'demo1234')}>Turista demo</button>
              <button type="button" className="btn btn-suave btn-chico"
                      onClick={() => entrar('cafenin@conectaco.mx', 'demo1234')}>Negocio demo</button>
            </div>
          </div>

          <p className="texto-suave" style={{ textAlign: 'center' }}>
            ¿No tienes cuenta? <Link to="/tipo-de-cuenta" className="xp">Crea una</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
