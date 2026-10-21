import { useState } from 'react';
import { Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { fecha, hoyISO } from '../../lib/formato.js';
import { Estado, Imagen, Vacio } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Modal from '../../components/Modal.jsx';

function enUnMes() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function EtiquetaEstado({ p }) {
  if (p.vigente) return <span className="etiqueta etiqueta-verde">Activa</span>;
  if (!p.activa) return <span className="etiqueta etiqueta-gris">Pausada</span>;
  return <span className="etiqueta etiqueta-roja">Vencida</span>;
}

export default function Promociones() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const base = `/negocios/${sesion.idNegocio}/promociones`;
  const promociones = useApi(() => api.get(base), []);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(null);

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    const cuerpo = { ...editando, imagenUrl: editando.imagenUrl || null };
    try {
      if (editando.idPromocion) await api.put(`${base}/${editando.idPromocion}`, cuerpo);
      else await api.post(base, cuerpo);
      avisar(editando.idPromocion ? 'Promoción actualizada' : 'Promoción creada');
      setEditando(null);
      promociones.recargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const alternar = async (p) => {
    try {
      await api.put(`${base}/${p.idPromocion}`, { ...p, activa: !p.activa });
      promociones.recargar();
    } catch (err) {
      avisar(err.message, 'error');
    }
  };

  const borrar = async (p) => {
    if (!window.confirm(`¿Borrar la promoción "${p.titulo}"?`)) return;
    try {
      await api.del(`${base}/${p.idPromocion}`);
      avisar('Promoción borrada');
      promociones.recargar();
    } catch (err) {
      avisar(err.message, 'error');
    }
  };

  const nueva = () => {
    setError(null);
    setEditando({ titulo: '', descripcion: '', fechaFin: enUnMes(), activa: true, imagenUrl: '' });
  };

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Promociones</h1>
          <p>Las promociones activas aparecen en el inicio de los turistas.</p>
        </div>
        <button className="btn btn-primario" onClick={nueva}><Plus size={18} /> Crear promoción</button>
      </div>

      {!promociones.datos && <Estado cargando={promociones.cargando} error={promociones.error} onReintentar={promociones.recargar} />}
      {promociones.datos?.length === 0 && (
        <div className="tarjeta"><Vacio icono={Tag} titulo="Aún no tienes promociones">
          <button className="btn btn-primario btn-chico" onClick={nueva}>Crear la primera</button>
        </Vacio></div>
      )}
      <div className="grid-recuerdos">
        {promociones.datos?.map((p) => (
          <article key={p.idPromocion} className="tarjeta recuerdo" style={{ overflow: 'hidden' }}>
            <Imagen src={p.imagenUrl} alt={p.titulo} />
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800 }}>{p.titulo}</h3>
                <EtiquetaEstado p={p} />
              </div>
              {p.descripcion && <p className="texto-suave">{p.descripcion}</p>}
              <span className="texto-tenue">Válido hasta {fecha(p.fechaFin)}</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-suave btn-chico" style={{ flex: 1 }} onClick={() => alternar(p)}>{p.activa ? 'Pausar' : 'Activar'}</button>
                <button className="btn btn-icono" aria-label="Editar" onClick={() => { setError(null); setEditando({ ...p, imagenUrl: p.imagenUrl ?? '' }); }}><Pencil size={16} /></button>
                <button className="btn btn-icono" aria-label="Borrar" onClick={() => borrar(p)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editando && (
        <Modal titulo={editando.idPromocion ? 'Editar promoción' : 'Crear promoción'} onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error && <div className="error-form">{error}</div>}
            <label className="campo">
              <span>Título</span>
              <input className="input" required maxLength={100} value={editando.titulo} placeholder="2x1 en café"
                     onChange={(e) => setEditando({ ...editando, titulo: e.target.value })} />
            </label>
            <label className="campo">
              <span>Descripción</span>
              <textarea className="textarea" maxLength={255} value={editando.descripcion ?? ''}
                        onChange={(e) => setEditando({ ...editando, descripcion: e.target.value })} />
            </label>
            <div className="form-fila">
              <label className="campo">
                <span>Válida hasta</span>
                <input className="input" type="date" required min={hoyISO()} value={editando.fechaFin}
                       onChange={(e) => setEditando({ ...editando, fechaFin: e.target.value })} />
              </label>
              <label className="campo">
                <span>URL de imagen (opcional)</span>
                <input className="input" type="url" value={editando.imagenUrl} placeholder="https://…"
                       onChange={(e) => setEditando({ ...editando, imagenUrl: e.target.value })} />
              </label>
            </div>
            <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 600 }}>
              <input type="checkbox" checked={editando.activa} onChange={(e) => setEditando({ ...editando, activa: e.target.checked })} />
              Activa
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
