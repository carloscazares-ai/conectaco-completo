import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ClipboardCheck } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { Estado, IconoMision, Vacio } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';

const FILTROS = [['todas', 'Todas'], ['disponibles', 'Disponibles'], ['completadas', 'Completadas']];

export default function Actividades() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const [filtro, setFiltro] = useState('disponibles');
  const misiones = useApi(() => api.get(`/turistas/${sesion.idTurista}/misiones?filtro=${filtro}`), [filtro]);

  const completar = async (mision) => {
    try {
      const r = await api.post(`/turistas/${sesion.idTurista}/misiones/${mision.idMision}/completar`);
      avisar(r.subioNivel ? `¡+${r.xpGanada} XP! Subiste al nivel ${r.nivel} 🎉` : `¡+${r.xpGanada} XP! Llevas ${r.xpTotal} XP`);
      misiones.recargar();
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Actividades</h1>
          <p>Completa actividades en los lugares de la ciudad y gana experiencia.</p>
        </div>
        <div className="tabs">
          {FILTROS.map(([id, texto]) => (
            <button key={id} className={`tab ${filtro === id ? 'activo' : ''}`} onClick={() => setFiltro(id)}>{texto}</button>
          ))}
        </div>
      </div>

      <div className="tarjeta lista">
        {!misiones.datos && <Estado cargando={misiones.cargando} error={misiones.error} onReintentar={misiones.recargar} />}
        {misiones.datos?.length === 0 && (
          <Vacio icono={ClipboardCheck} titulo={filtro === 'completadas' ? 'Aún no completas actividades' : '¡Completaste todo!'}>
            {filtro === 'completadas' ? 'Explora lugares y completa tu primera actividad.' : 'Pronto habrá nuevas actividades.'}
          </Vacio>
        )}
        {misiones.datos?.map((m) => (
          <div key={m.idMision} className="fila">
            <IconoMision tipo={m.tipo} />
            <div className="fila-texto">
              <strong>{m.nombre}</strong>
              <span className="texto-tenue">
                <Link to={`/turista/lugares/${m.idLugar}`} className="xp" style={{ fontWeight: 600 }}>{m.lugar}</Link>
                {m.descripcion ? ` · ${m.descripcion}` : ''}
              </span>
            </div>
            <span className="xp">+{m.puntosXp} XP</span>
            <div className="fila-acciones">
              {m.estado === 'COMPLETADA'
                ? <span className="etiqueta etiqueta-verde"><Check size={14} /> Completada</span>
                : <button className="btn btn-primario btn-chico" onClick={() => completar(m)}>Completar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
