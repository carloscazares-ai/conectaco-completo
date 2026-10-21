import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { Estado, IconoMision, TIPOS_MISION, Vacio } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Modal from '../../components/Modal.jsx';

const NUEVA = { nombre: '', descripcion: '', tipo: 'FOTO', puntosXp: 100, activa: true };

export default function Actividades() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const base = `/negocios/${sesion.idNegocio}/misiones`;
  const misiones = useApi(() => api.get(base), []);
  const lugar = useApi(() => api.get(`/negocios/${sesion.idNegocio}/lugar`), []);
  const [vista, setVista] = useState('activas');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(null);

  const lista = (misiones.datos ?? []).filter((m) => (vista === 'activas' ? m.activa : !m.activa));

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    const cuerpo = { ...editando, puntosXp: Number(editando.puntosXp) };
    try {
      if (editando.idMision) {
        await api.put(`${base}/${editando.idMision}`, cuerpo);
        avisar('Actividad actualizada');
      } else {
        await api.post(base, cuerpo);
        avisar(cuerpo.activa ? 'Actividad publicada' : 'Guardada en borradores');
      }
      setEditando(null);
      misiones.recargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const alternar = async (m) => {
    try {
      await api.put(`${base}/${m.idMision}`, { ...m, activa: !m.activa });
      avisar(m.activa ? 'Movida a borradores' : 'Actividad publicada');
      misiones.recargar();
    } catch (err) {
      avisar(err.message, 'error');
    }
  };

  const borrar = async (m) => {
    if (!window.confirm(`¿Borrar la actividad "${m.nombre}"?`)) return;
    try {
      await api.del(`${base}/${m.idMision}`);
      avisar('Actividad borrada');
      misiones.recargar();
    } catch (err) {
      avisar(err.message, 'error');
    }
  };

  const sinLugar = !lugar.cargando && !lugar.datos;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Actividades</h1>
          <p>Crea retos para los turistas. Al completarlos ganan XP y conocen tu negocio.</p>
        </div>
        <button className="btn btn-primario" disabled={sinLugar} onClick={() => { setError(null); setEditando(NUEVA); }}>
          <Plus size={18} /> Nueva actividad
        </button>
      </div>

      {sinLugar && (
        <div className="error-form" style={{ background: 'var(--terracota-claro)', color: 'var(--terracota-oscuro)' }}>
          Primero registra tu establecimiento en <Link to="/negocio/establecimiento" style={{ textDecoration: 'underline' }}>Mi establecimiento</Link> para crear actividades.
        </div>
      )}

      <div className="tabs">
        <button className={`tab ${vista === 'activas' ? 'activo' : ''}`} onClick={() => setVista('activas')}>Activas</button>
        <button className={`tab ${vista === 'borradores' ? 'activo' : ''}`} onClick={() => setVista('borradores')}>Borradores</button>
      </div>

      <div className="tarjeta lista">
        {!misiones.datos && <Estado cargando={misiones.cargando} error={misiones.error} onReintentar={misiones.recargar} />}
        {misiones.datos && lista.length === 0 && (
          <Vacio icono={ClipboardList} titulo={vista === 'activas' ? 'No tienes actividades publicadas' : 'No tienes borradores'} />
        )}
        {lista.map((m) => (
          <div key={m.idMision} className="fila">
            <IconoMision tipo={m.tipo} />
            <div className="fila-texto">
              <strong>{m.nombre}</strong>
              <span className="texto-tenue">{m.descripcion}</span>
            </div>
            <span className="xp">+{m.puntosXp} XP</span>
            <div className="fila-acciones">
              <button className="btn btn-suave btn-chico" onClick={() => alternar(m)}>{m.activa ? 'Pausar' : 'Publicar'}</button>
              <button className="btn btn-icono" aria-label="Editar" onClick={() => { setError(null); setEditando(m); }}><Pencil size={16} /></button>
              <button className="btn btn-icono" aria-label="Borrar" onClick={() => borrar(m)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editando && (
        <Modal titulo={editando.idMision ? 'Editar actividad' : 'Nueva actividad'} onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error && <div className="error-form">{error}</div>}
            <label className="campo">
              <span>Nombre</span>
              <input className="input" required maxLength={100} value={editando.nombre}
                     onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} placeholder="Toma una foto en nuestro local" />
            </label>
            <label className="campo">
              <span>Descripción</span>
              <textarea className="textarea" maxLength={255} value={editando.descripcion}
                        onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </label>
            <div className="form-fila">
              <label className="campo">
                <span>Tipo</span>
                <select className="select" value={editando.tipo} onChange={(e) => setEditando({ ...editando, tipo: e.target.value })}>
                  {TIPOS_MISION.map((t) => <option key={t.valor} value={t.valor}>{t.nombre}</option>)}
                </select>
              </label>
              <label className="campo">
                <span>Puntos XP</span>
                <input className="input" type="number" min={10} max={1000} step={10} required value={editando.puntosXp}
                       onChange={(e) => setEditando({ ...editando, puntosXp: e.target.value })} />
              </label>
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 600 }}>
              <input type="checkbox" checked={editando.activa} onChange={(e) => setEditando({ ...editando, activa: e.target.checked })} />
              Publicar ahora (si no, se guarda como borrador)
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-suave" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn btn-primario">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
