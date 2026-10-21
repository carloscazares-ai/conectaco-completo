import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Music, Images } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { fecha } from '../../lib/formato.js';
import { Estado, Imagen, Vacio } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import NuevoRecuerdo from './NuevoRecuerdo.jsx';

export default function Recuerdos() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const [creando, setCreando] = useState(false);
  const recuerdos = useApi(() => api.get(`/turistas/${sesion.idTurista}/recuerdos`), []);

  const borrar = async (r) => {
    if (!window.confirm(`¿Borrar el recuerdo "${r.titulo}"?`)) return;
    try {
      await api.del(`/turistas/${sesion.idTurista}/recuerdos/${r.idRecuerdo}`);
      avisar('Recuerdo borrado');
      recuerdos.recargar();
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Mis recuerdos</h1>
          <p>Los momentos que guardaste en tus visitas por la ciudad.</p>
        </div>
        <button className="btn btn-primario" onClick={() => setCreando(true)}><Plus size={18} /> Nuevo recuerdo</button>
      </div>

      {!recuerdos.datos && <Estado cargando={recuerdos.cargando} error={recuerdos.error} onReintentar={recuerdos.recargar} />}
      {recuerdos.datos?.length === 0 && (
        <div className="tarjeta">
          <Vacio icono={Images} titulo="Aún no tienes recuerdos">
            <button className="btn btn-primario btn-chico" onClick={() => setCreando(true)}>Crear mi primer recuerdo</button>
          </Vacio>
        </div>
      )}
      <div className="grid-recuerdos">
        {recuerdos.datos?.map((r) => (
          <article key={r.idRecuerdo} className="tarjeta recuerdo" style={{ overflow: 'hidden' }}>
            <Imagen src={r.imagenUrl} alt={r.titulo} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800 }}>{r.titulo}</h3>
                <button className="btn btn-icono" style={{ width: 32, minHeight: 32 }} onClick={() => borrar(r)} aria-label="Borrar recuerdo">
                  <Trash2 size={15} />
                </button>
              </div>
              <Link to={`/turista/lugares/${r.idLugar}`} className="xp">{r.lugar}</Link>
              <span className="texto-tenue">{fecha(r.fecha)}{r.calificacion ? ` · ${'★'.repeat(r.calificacion)}` : ''}</span>
              {r.resena && <p className="texto-suave" style={{ lineHeight: 1.5 }}>{r.resena}</p>}
              {r.cancionUrl && (
                <a href={r.cancionUrl} target="_blank" rel="noreferrer" className="xp" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Music size={15} /> Escuchar la canción
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {creando && (
        <NuevoRecuerdo onCerrar={() => setCreando(false)} onGuardado={() => { setCreando(false); recuerdos.recargar(); }} />
      )}
    </div>
  );
}
