import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';
import { api } from '../lib/api.js';
import { useSesion, rutaInicio } from '../lib/sesion.jsx';

// Cuentas de ejemplo que crea el backend la primera vez que arranca
const DEMOS = [
  { texto: 'Turista demo', email: 'turista@conectaco.mx' },
  { texto: 'Negocio demo', email: 'cafenin@conectaco.mx' },
];

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const { iniciar } = useSesion();
  const navigate = useNavigate();

  const entrar = async (datos) => {
    setError(null);
    setEnviando(true);
    try {
      const sesion = await api.post('/auth/login', datos);
      iniciar(sesion);
      navigate(rutaInicio(sesion));
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
        <form className="tarjeta caja-auth form" onSubmit={(e) => { e.preventDefault(); entrar(form); }}>
          <Link to="/" className="texto-suave" style={{ display: 'flex', gap: 6 }}><ArrowLeft size={18} /> Volver</Link>
          <div>
            <h1>Iniciar sesión</h1>
            <p className="texto-suave">Qué gusto verte de nuevo.</p>
          </div>
          {error && <div className="error-form">{error}</div>}
          <label className="campo">
            <span>Correo electrónico</span>
            <div className="input-icono">
              <Mail size={18} />
              <input className="input" type="email" required value={form.email} autoComplete="email"
                     onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" />
            </div>
          </label>
          <label className="campo">
            <span>Contraseña</span>
            <div className="input-icono">
              <Lock size={18} />
              <input className="input" type="password" required value={form.password} autoComplete="current-password"
                     onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Tu contraseña" />
            </div>
          </label>
          <button className="btn btn-primario btn-bloque" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Iniciar sesión'}
          </button>
          <div>
            <span className="texto-tenue">Probar con una cuenta de ejemplo (contraseña demo1234):</span>
            <div className="demo">
              {DEMOS.map((d) => (
                <button key={d.email} type="button" className="btn btn-suave btn-chico" disabled={enviando}
                        onClick={() => entrar({ email: d.email, password: 'demo1234' })}>{d.texto}</button>
              ))}
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
