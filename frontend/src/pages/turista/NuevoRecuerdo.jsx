import { useState } from 'react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { hoyISO } from '../../lib/formato.js';
import { SelectorEstrellas } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Modal from '../../components/Modal.jsx';

// Formulario para guardar un recuerdo (su reseña aparece como opinión del lugar)
export default function NuevoRecuerdo({ idLugarInicial, onCerrar, onGuardado }) {
  const { sesion } = useSesion();
  const avisar = useToast();
  const lugares = useApi(() => api.get('/lugares'), []);
  const [form, setForm] = useState({
    idLugar: idLugarInicial ?? '', titulo: '', resena: '', calificacion: 5, fecha: hoyISO(), imagenUrl: '', cancionUrl: '',
  });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const recuerdo = await api.post(`/turistas/${sesion.idTurista}/recuerdos`, {
        ...form,
        idLugar: Number(form.idLugar),
        imagenUrl: form.imagenUrl || null,
        cancionUrl: form.cancionUrl || null,
      });
      avisar('Recuerdo guardado');
      onGuardado(recuerdo);
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  };

  return (
    <Modal titulo="Nuevo recuerdo" onCerrar={onCerrar}>
      <form className="form" onSubmit={guardar}>
        {error && <div className="error-form">{error}</div>}
        <label className="campo">
          <span>Lugar</span>
          <select className="select" required value={form.idLugar} onChange={cambiar('idLugar')}>
            <option value="" disabled>Elige un lugar</option>
            {(lugares.datos ?? []).map((l) => <option key={l.idLugar} value={l.idLugar}>{l.nombre}</option>)}
          </select>
        </label>
        <label className="campo">
          <span>Título</span>
          <input className="input" required maxLength={100} value={form.titulo} onChange={cambiar('titulo')} placeholder="Una tarde increíble" />
        </label>
        <label className="campo">
          <span>Reseña</span>
          <textarea className="textarea" maxLength={500} value={form.resena} onChange={cambiar('resena')} placeholder="¿Qué te gustó de este lugar?" />
        </label>
        <div className="form-fila">
          <div className="campo">
            <span>Calificación</span>
            <SelectorEstrellas valor={form.calificacion} onCambiar={(n) => setForm({ ...form, calificacion: n })} />
          </div>
          <label className="campo">
            <span>Fecha</span>
            <input className="input" type="date" max={hoyISO()} value={form.fecha} onChange={cambiar('fecha')} />
          </label>
        </div>
        <label className="campo">
          <span>URL de una foto (opcional)</span>
          <input className="input" type="url" value={form.imagenUrl} onChange={cambiar('imagenUrl')} placeholder="https://…" />
        </label>
        <label className="campo">
          <span>Canción del recuerdo (opcional)</span>
          <input className="input" type="url" value={form.cancionUrl} onChange={cambiar('cancionUrl')} placeholder="https://open.spotify.com/…" />
        </label>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-suave" onClick={onCerrar}>Cancelar</button>
          <button className="btn btn-primario" disabled={enviando}>{enviando ? 'Guardando…' : 'Guardar recuerdo'}</button>
        </div>
      </form>
    </Modal>
  );
}
