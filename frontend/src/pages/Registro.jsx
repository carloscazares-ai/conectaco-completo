import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Store, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { useSesion, rutaInicio } from '../lib/sesion.jsx';

export default function Registro() {
  const [params] = useSearchParams();
  const [tipo, setTipo] = useState(params.get('tipo') === 'Negocio' ? 'Negocio' : 'Turista');
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { iniciar } = useSesion();
  const navigate = useNavigate();

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const sesion = await api.post('/auth/registro', { ...form, tipoUsuario: tipo });
      iniciar(sesion);
      navigate(tipo === 'Negocio' ? '/negocio/establecimiento' : rutaInicio(sesion));
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <div className="publica">
      <header className="publica-barra">
        <Link to="/"><Logo /></Link>
      </header>
      <div className="centrado">
        <form className="tarjeta caja-auth form" onSubmit={enviar}>
          <Link to="/tipo-de-cuenta" className="texto-suave" style={{ display: 'flex', gap: 6 }}><ArrowLeft size={18} /> Volver</Link>
          <div>
            <h1>Crear cuenta</h1>
            <p className="texto-suave">
              {tipo === 'Negocio' ? 'Registra tu negocio y empieza a atraer visitantes.' : 'Empieza a explorar la Ciudad de México.'}
            </p>
          </div>
          <div className="tabs" style={{ width: '100%' }}>
            {['Turista', 'Negocio'].map((t) => (
              <button key={t} type="button" className={`tab ${tipo === t ? 'activo' : ''}`} style={{ flex: 1 }}
                      onClick={() => setTipo(t)}>{t}</button>
            ))}
          </div>
          {error && <div className="error-form">{error}</div>}
          <label className="campo">
            <span>{tipo === 'Negocio' ? 'Nombre del negocio' : 'Nombre'}</span>
            <div className="input-icono">
              {tipo === 'Negocio' ? <Store size={18} /> : <User size={18} />}
              <input className="input" required value={form.nombre} onChange={cambiar('nombre')}
                     placeholder={tipo === 'Negocio' ? 'Café Nin' : 'Tu nombre'} autoComplete="name" />
            </div>
          </label>
          <label className="campo">
            <span>Correo electrónico</span>
            <div className="input-icono">
              <Mail size={18} />
              <input className="input" type="email" required value={form.email} onChange={cambiar('email')}
                     placeholder="tu@correo.com" autoComplete="email" />
            </div>
          </label>
          <label className="campo">
            <span>Contraseña</span>
            <div className="input-icono">
              <Lock size={18} />
              <input className="input" type="password" required minLength={6} value={form.password}
                     onChange={cambiar('password')} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
            </div>
          </label>
          <button className="btn btn-primario btn-bloque" disabled={enviando}>
            {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
          <p className="texto-suave" style={{ textAlign: 'center' }}>
            ¿Ya tienes cuenta? <Link to="/login" className="xp">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
