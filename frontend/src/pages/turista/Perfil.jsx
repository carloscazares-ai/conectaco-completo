import { useNavigate } from 'react-router-dom';
import { LogOut, Bookmark } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { numero } from '../../lib/formato.js';
import { Estado, LugarCard, Vacio } from '../../components/Piezas.jsx';
import { Iniciales } from '../../components/Layout.jsx';

export default function Perfil() {
  const { sesion, cerrar } = useSesion();
  const navigate = useNavigate();
  const resumen = useApi(() => api.get(`/turistas/${sesion.idTurista}/dashboard`), []);
  const favoritos = useApi(() => api.get(`/turistas/${sesion.idTurista}/favoritos`), []);

  return (
    <div className="pagina">
      <div className="encabezado"><h1>Mi perfil</h1></div>

      <div className="tarjeta tarjeta-pad" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <Iniciales nombre={sesion.nombre} grande />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{sesion.nombre}</h2>
          <p className="texto-suave">{sesion.email} · Turista</p>
          {resumen.datos && (
            <p style={{ marginTop: 8 }}>
              <strong>Nivel {resumen.datos.nivel}</strong> · {numero(resumen.datos.xp)} XP · {resumen.datos.lugaresVisitados} lugares visitados
            </p>
          )}
        </div>
        <button className="btn btn-peligro" onClick={() => { cerrar(); navigate('/'); }}><LogOut size={18} /> Cerrar sesión</button>
      </div>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="seccion-titulo"><h2>Lugares guardados</h2></div>
        {!favoritos.datos && <Estado cargando={favoritos.cargando} error={favoritos.error} />}
        {favoritos.datos?.length === 0 && (
          <div className="tarjeta"><Vacio icono={Bookmark} titulo="No has guardado lugares">Usa el botón “Guardar” en el detalle de un lugar.</Vacio></div>
        )}
        <div className="grid-lugares">
          {favoritos.datos?.map((lugar) => <LugarCard key={lugar.idLugar} lugar={lugar} />)}
        </div>
      </section>
    </div>
  );
}
