import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Images, Search, Tag, Trophy } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { fecha, numero } from '../../lib/formato.js';
import { LugarCard, Stat } from '../../components/Piezas.jsx';
import Michi from '../../components/Michi.jsx';

export default function Dashboard() {
  const sesion = obtenerSesion();
  const navigate = useNavigate();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // useEffect con [] se ejecuta una vez, al abrir la pagina
  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setDatos(await api.get('/turistas/' + sesion.idTurista + '/dashboard'));
    } catch (e) {
      setError(e.message);
    }
  }

  function buscar(evento) {
    evento.preventDefault();
    navigate('/turista/explorar?q=' + busqueda);
  }

  if (error !== '') return <p className="error-form">{error}</p>;
  if (datos === null) return <p className="cargando">Cargando…</p>;

  const mascota = datos.mascota;
  const avanceMascota = (mascota.xpEnNivel / mascota.xpPorNivel) * 100;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Hola, {datos.nombre.split(' ')[0]} 👋</h1>
          <p>¿Qué vas a descubrir hoy en la Ciudad de México?</p>
        </div>
        <form className="input-icono" style={{ width: 420 }} onSubmit={buscar}>
          <Search size={18} />
          <input className="input" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                 placeholder="Buscar lugares, actividades…" />
        </form>
      </div>

      <div className="grid-stats">
        <Stat icono={Star} valor={numero(datos.xp)} etiqueta={'XP · Nivel ' + datos.nivel} />
        <Stat icono={MapPin} valor={datos.lugaresVisitados} etiqueta="Lugares visitados" />
        <Stat icono={Images} valor={datos.recuerdos} etiqueta="Recuerdos" />
        <Stat icono={Trophy} valor={datos.recompensas} etiqueta="Recompensas" />
      </div>

      <div className="dos-columnas">
        <section className="form">
          <div className="seccion-titulo">
            <h2>Recomendado para ti</h2>
            <Link to="/turista/explorar">Ver todos</Link>
          </div>
          <div className="grid-lugares">
            {datos.recomendados.map((lugar) => (
              <LugarCard key={lugar.idLugar} lugar={lugar} />
            ))}
          </div>
        </section>

        <aside className="form">
          <Link to="/turista/mascota" className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Michi accesorio={mascota.accesorio} className="mini-michi" />
            <div style={{ flex: 1 }}>
              <span className="texto-tenue">Tu mascota</span>
              <h3>{mascota.nombre}</h3>
              <p className="texto-suave">Nivel {mascota.nivel}</p>
              <div className="barra"><div style={{ width: avanceMascota + '%' }} /></div>
              <span className="texto-tenue">{mascota.xpEnNivel} / {mascota.xpPorNivel} XP</span>
            </div>
          </Link>

          <div className="tarjeta">
            <div className="tarjeta-pad"><h2>Promociones</h2></div>
            <div className="lista">
              {datos.promociones.map((promocion) => (
                <Link key={promocion.idPromocion} to={'/turista/lugares/' + promocion.idLugar} className="fila">
                  <div className="fila-icono"><Tag size={20} /></div>
                  <div className="fila-texto">
                    <strong>{promocion.titulo}</strong>
                    <span className="texto-tenue">{promocion.negocio} · hasta {fecha(promocion.fechaFin)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
