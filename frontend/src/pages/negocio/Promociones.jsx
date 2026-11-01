import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { fecha, hoyISO } from '../../lib/formato.js';
import { Imagen, Vacio } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import Modal from '../../components/Modal.jsx';

const PROMOCION_NUEVA = { titulo: '', descripcion: '', fechaFin: hoyISO(), activa: true, imagenUrl: '' };

// Etiqueta de color segun el estado de la promocion
function Estado({ promocion }) {
  if (promocion.vigente) {
    return <span className="etiqueta etiqueta-verde">Activa</span>;
  }
  if (!promocion.activa) {
    return <span className="etiqueta etiqueta-gris">Pausada</span>;
  }
  return <span className="etiqueta etiqueta-roja">Vencida</span>;
}

export default function Promociones() {
  const sesion = obtenerSesion();
  const base = '/negocios/' + sesion.idNegocio + '/promociones';

  const [promociones, setPromociones] = useState([]);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setPromociones(await api.get(base));
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    try {
      if (editando.idPromocion) {
        await api.put(base + '/' + editando.idPromocion, editando);
      } else {
        await api.post(base, editando);
      }
      setEditando(null);
      setAviso('Promoción guardada');
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function pausarOActivar(promocion) {
    try {
      await api.put(base + '/' + promocion.idPromocion, { ...promocion, activa: !promocion.activa });
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function borrar(promocion) {
    if (!window.confirm('¿Borrar la promoción "' + promocion.titulo + '"?')) {
      return;
    }
    try {
      await api.del(base + '/' + promocion.idPromocion);
      setAviso('Promoción borrada');
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  function cambiar(campo, valor) {
    setEditando({ ...editando, [campo]: valor });
  }

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Promociones</h1>
          <p>Las promociones activas aparecen en el inicio de los turistas.</p>
        </div>
        <button className="btn btn-primario" onClick={() => setEditando(PROMOCION_NUEVA)}><Plus size={18} /> Crear promoción</button>
      </div>

      {promociones.length === 0 && <div className="tarjeta"><Vacio titulo="Aún no tienes promociones" /></div>}

      <div className="grid-recuerdos">
        {promociones.map((promocion) => (
          <article key={promocion.idPromocion} className="tarjeta recuerdo">
            <Imagen src={promocion.imagenUrl} alt={promocion.titulo} />
            <div className="tarjeta-pad form" style={{ gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <h3>{promocion.titulo}</h3>
                <Estado promocion={promocion} />
              </div>
              <p className="texto-suave">{promocion.descripcion}</p>
              <span className="texto-tenue">Válido hasta {fecha(promocion.fechaFin)}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-suave btn-chico" style={{ flex: 1 }} onClick={() => pausarOActivar(promocion)}>
                  {promocion.activa ? 'Pausar' : 'Activar'}
                </button>
                <button className="btn btn-icono" onClick={() => setEditando(promocion)}><Pencil size={16} /></button>
                <button className="btn btn-icono" onClick={() => borrar(promocion)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {editando !== null && (
        <Modal titulo="Promoción" onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error !== '' && <div className="error-form">{error}</div>}

            <label className="campo">
              <span>Título</span>
              <input className="input" required value={editando.titulo} onChange={(e) => cambiar('titulo', e.target.value)} />
            </label>
            <label className="campo">
              <span>Descripción</span>
              <textarea className="textarea" value={editando.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
            </label>
            <label className="campo">
              <span>Válida hasta</span>
              <input className="input" type="date" required value={editando.fechaFin} onChange={(e) => cambiar('fechaFin', e.target.value)} />
            </label>
            <label>
              <input type="checkbox" checked={editando.activa} onChange={(e) => cambiar('activa', e.target.checked)} /> Activa
            </label>
            <button className="btn btn-primario">Guardar</button>
          </form>
        </Modal>
      )}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
