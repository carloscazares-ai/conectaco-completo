import { useState } from 'react';
import { Apple, Gamepad2, Shirt, Pencil, Lock, Check } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { Estado } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Michi, { IconoRecompensa } from '../../components/Michi.jsx';
import Modal from '../../components/Modal.jsx';

export default function Mascota() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const base = `/turistas/${sesion.idTurista}`;
  const mascota = useApi(() => api.get(`${base}/mascota`), []);
  const recompensas = useApi(() => api.get(`${base}/recompensas`), []);
  const [renombrando, setRenombrando] = useState(false);
  const [nombre, setNombre] = useState('');

  if (!mascota.datos) return <Estado cargando={mascota.cargando} error={mascota.error} onReintentar={mascota.recargar} />;
  const m = mascota.datos;

  const accion = async (cual, mensaje) => {
    try {
      const nueva = await api.post(`${base}/mascota/${cual}`);
      mascota.setDatos(nueva);
      avisar(nueva.nivel > m.nivel ? `¡${nueva.nombre} subió al nivel ${nueva.nivel}! 🎉` : mensaje);
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  const actualizar = async (cambios, mensaje) => {
    try {
      mascota.setDatos(await api.put(`${base}/mascota`, cambios));
      recompensas.recargar();
      avisar(mensaje);
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  const canjear = async (r) => {
    try {
      await api.post(`${base}/recompensas/${r.idRecompensa}/canjear`);
      avisar(`¡Canjeaste ${r.nombre}!`);
      recompensas.recargar();
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Mi mascota</h1>
          <p>Gana XP con actividades para que tu mascota suba de nivel y desbloquee accesorios.</p>
        </div>
      </div>

      <div className="dos-columnas" style={{ gridTemplateColumns: 'minmax(300px, 420px) 1fr' }}>
        <div className="tarjeta mascota-panel">
          <Michi accesorio={m.accesorio} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800 }}>{m.nombre}</h2>
            <button className="btn btn-icono" style={{ width: 34, minHeight: 34 }} aria-label="Cambiar nombre"
                    onClick={() => { setNombre(m.nombre); setRenombrando(true); }}><Pencil size={15} /></button>
          </div>
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <strong>Nivel {m.nivel}</strong>
              <span className="texto-tenue">{m.xpEnNivel} / {m.xpPorNivel} XP</span>
            </div>
            <div className="barra"><div style={{ width: `${(m.xpEnNivel / m.xpPorNivel) * 100}%` }} /></div>
          </div>
          <div className="mascota-acciones">
            <button className="accion-mascota" onClick={() => accion('alimentar', `${m.nombre} comió muy rico (+10 XP)`)}><Apple /> Alimentar</button>
            <button className="accion-mascota" onClick={() => accion('jugar', `${m.nombre} se divirtió (+10 XP)`)}><Gamepad2 /> Jugar</button>
            <a className="accion-mascota" href="#recompensas"><Shirt /> Personalizar</a>
          </div>
          {m.accesorio && <span className="texto-suave">Lleva puesto: <strong>{m.accesorio}</strong></span>}
        </div>

        <section id="recompensas" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="seccion-titulo"><h2>Recompensas</h2></div>
          {!recompensas.datos && <Estado cargando={recompensas.cargando} error={recompensas.error} />}
          <div className="recompensas">
            {recompensas.datos?.map((r) => (
              <div key={r.idRecompensa} className={`tarjeta recompensa ${!r.desbloqueada ? 'bloqueada' : ''}`}>
                <div className="recompensa-icono"><IconoRecompensa nombre={r.nombre} /></div>
                <strong>{r.nombre}</strong>
                <span className="texto-tenue">{r.descripcion}</span>
                <span className="xp">{r.requisitoXp} XP</span>
                {!r.desbloqueada && <span className="etiqueta etiqueta-gris"><Lock size={12} /> Bloqueada</span>}
                {r.desbloqueada && !r.canjeada && (
                  <button className="btn btn-primario btn-chico btn-bloque" onClick={() => canjear(r)}>Canjear</button>
                )}
                {r.canjeada && (r.equipada
                  ? <button className="btn btn-suave btn-chico btn-bloque" onClick={() => actualizar({ idRecompensaEquipada: 0 }, 'Accesorio quitado')}><Check size={14} /> Puesto · Quitar</button>
                  : <button className="btn btn-secundario btn-chico btn-bloque" onClick={() => actualizar({ idRecompensaEquipada: r.idRecompensa }, `${m.nombre} ahora lleva ${r.nombre}`)}>Ponérselo</button>)}
              </div>
            ))}
          </div>
        </section>
      </div>

      {renombrando && (
        <Modal titulo="Nombre de tu mascota" onCerrar={() => setRenombrando(false)}>
          <form className="form" onSubmit={(e) => { e.preventDefault(); setRenombrando(false); actualizar({ nombre }, 'Nombre actualizado'); }}>
            <input className="input" required maxLength={45} value={nombre} onChange={(e) => setNombre(e.target.value)} autoFocus />
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-suave" onClick={() => setRenombrando(false)}>Cancelar</button>
              <button className="btn btn-primario">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
