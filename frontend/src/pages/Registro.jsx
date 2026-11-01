import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { guardarSesion } from '../lib/sesion.js';

export default function Registro() {
  // La URL dice el tipo de cuenta: /registro?tipo=Negocio
  const [parametros] = useSearchParams();
  const [tipo, setTipo] = useState(parametros.get('tipo') === 'Negocio' ? 'Negocio' : 'Turista');

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function enviar(evento) {
    evento.preventDefault();
    setError('');
    try {
      const sesion = await api.post('/auth/registro', { nombre, email, password, tipoUsuario: tipo });
      guardarSesion(sesion);

      // El negocio primero tiene que registrar su establecimiento
      if (tipo === 'Negocio') {
        navigate('/negocio/establecimiento');
      } else {
        navigate('/turista');
      }
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="publica">
      <header className="publica-barra">
        <Link to="/"><Logo /></Link>
      </header>
      <div className="centrado">
        <form className="tarjeta caja-auth form" onSubmit={enviar}>
          <Link to="/tipo-de-cuenta" className="texto-suave"><ArrowLeft size={18} /> Volver</Link>
          <div>
            <h1>Crear cuenta</h1>
            <p className="texto-suave">Empieza a usar conecTaco.</p>
          </div>

          <div className="tabs" style={{ width: '100%' }}>
            <button type="button" className={tipo === 'Turista' ? 'tab activo' : 'tab'} style={{ flex: 1 }}
                    onClick={() => setTipo('Turista')}>Turista</button>
            <button type="button" className={tipo === 'Negocio' ? 'tab activo' : 'tab'} style={{ flex: 1 }}
                    onClick={() => setTipo('Negocio')}>Negocio</button>
          </div>

          {error !== '' && <div className="error-form">{error}</div>}

          <label className="campo">
            <span>{tipo === 'Negocio' ? 'Nombre del negocio' : 'Nombre'}</span>
            <div className="input-icono">
              <User size={18} />
              <input className="input" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
          </label>
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
              <input className="input" type="password" required minLength={6} value={password}
                     onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
          </label>

          <button className="btn btn-primario btn-bloque">Crear cuenta</button>

          <p className="texto-suave" style={{ textAlign: 'center' }}>
            ¿Ya tienes cuenta? <Link to="/login" className="xp">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
