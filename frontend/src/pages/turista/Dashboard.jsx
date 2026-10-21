import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Images, Search, Tag, Trophy } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { fecha, numero } from '../../lib/formato.js';
import { Estado, LugarCard, Stat } from '../../components/Piezas.jsx';
import Michi from '../../components/Michi.jsx';

export default function Dashboard() {
  const { sesion } = useSesion();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const { datos, error, cargando, recargar } = useApi(() => api.get(`/turistas/${sesion.idTurista}/dashboard`), [sesion.idTurista]);

  if (!datos) return <Estado cargando={cargando} error={error} onReintentar={recargar} />;
  const { mascota } = datos;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Hola, {datos.nombre.split(' ')[0]} 👋</h1>
          <p>¿Qué vas a descubrir hoy en la Ciudad de México?</p>
        </div>
        <form className="input-icono" style={{ width: 'min(420px, 100%)' }}
              onSubmit={(e) => { e.preventDefault(); navigate(`/turista/explorar?q=${encodeURIComponent(busqueda)}`); }}>
          <Search size={18} />
          <input className="input" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                 placeholder="Buscar lugares, actividades…" aria-label="Buscar lugares" />
        </form>
      </div>

      <div className="grid-stats">
        <Stat icono={Star} valor={numero(datos.xp)} etiqueta={`XP · Nivel ${datos.nivel}`} />
        <Stat icono={MapPin} valor={datos.lugaresVisitados} etiqueta="Lugares visitados" />
        <Stat icono={Images} valor={datos.recuerdos} etiqueta="Recuerdos" />
        <Stat icono={Trophy} valor={datos.recompensas} etiqueta="Recompensas" />
      </div>

      <div className="dos-columnas">
        <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="seccion-titulo">
            <h2>Recomendado para ti</h2>
            <Link to="/turista/explorar">Ver todos</Link>
          </div>
          <div className="grid-lugares">
            {datos.recomendados.map((lugar) => <LugarCard key={lugar.idLugar} lugar={lugar} />)}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/turista/mascota" className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Michi accesorio={mascota.accesorio} className="mini-michi" />
            <div style={{ flex: 1, minWidth: 140 }}>
              <span className="texto-tenue">Tu mascota</span>
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>{mascota.nombre}</h3>
              <p className="texto-suave" style={{ margin: '4px 0 10px' }}>Nivel {mascota.nivel}</p>
              <div className="barra"><div style={{ width: `${(mascota.xpEnNivel / mascota.xpPorNivel) * 100}%` }} /></div>
              <span className="texto-tenue">{mascota.xpEnNivel} / {mascota.xpPorNivel} XP</span>
            </div>
          </Link>

          <div className="tarjeta">
            <div className="tarjeta-pad seccion-titulo" style={{ paddingBottom: 8 }}>
              <h2>Promociones</h2>
            </div>
            <div className="lista">
              {datos.promociones.length === 0 && <p className="texto-suave tarjeta-pad">No hay promociones por ahora.</p>}
              {datos.promociones.map((p) => (
                <Link key={p.idPromocion} to={p.idLugar ? `/turista/lugares/${p.idLugar}` : '/turista/explorar'} className="fila">
                  <div className="fila-icono"><Tag size={20} /></div>
                  <div className="fila-texto">
                    <strong>{p.titulo}</strong>
                    <span className="texto-tenue">{p.negocio} · hasta {fecha(p.fechaFin)}</span>
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
