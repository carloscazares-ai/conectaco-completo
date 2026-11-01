import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { IconoMision, Vacio } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import Modal from '../../components/Modal.jsx';

const ACTIVIDAD_NUEVA = { nombre: '', descripcion: '', tipo: 'FOTO', puntosXp: 100, activa: true };

export default function Actividades() {
  const sesion = obtenerSesion();
  const base = '/negocios/' + sesion.idNegocio + '/misiones';

  const [misiones, setMisiones] = useState([]);
  const [vista, setVista] = useState('activas');
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  // editando = null: la ventana esta cerrada. Si tiene una actividad, se esta editando esa.
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setMisiones(await api.get(base));
    } catch (e) {
      setAviso(e.message);
    }
  }

  // Si ya tiene id se actualiza (PUT); si no, se crea (POST)
  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    try {
      if (editando.idMision) {
        await api.put(base + '/' + editando.idMision, editando);
      } else {
        await api.post(base, editando);
      }
      setEditando(null);
      setAviso('Actividad guardada');
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function pausarOPublicar(mision) {
    try {
      await api.put(base + '/' + mision.idMision, { ...mision, activa: !mision.activa });
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function borrar(mision) {
    if (!window.confirm('¿Borrar la actividad "' + mision.nombre + '"?')) {
      return;
    }
    try {
      await api.del(base + '/' + mision.idMision);
      setAviso('Actividad borrada');
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  function cambiar(campo, valor) {
    setEditando({ ...editando, [campo]: valor });
  }

  // Solo se muestran las de la pestana elegida
  const lista = misiones.filter((mision) => {
    if (vista === 'activas') {
      return mision.activa;
    }
    return !mision.activa;
  });

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Actividades</h1>
          <p>Crea retos para los turistas. Al completarlos ganan XP y conocen tu negocio.</p>
        </div>
        <button className="btn btn-primario" onClick={() => setEditando(ACTIVIDAD_NUEVA)}><Plus size={18} /> Nueva actividad</button>
      </div>

      <div className="tabs">
        <button className={vista === 'activas' ? 'tab activo' : 'tab'} onClick={() => setVista('activas')}>Activas</button>
        <button className={vista === 'borradores' ? 'tab activo' : 'tab'} onClick={() => setVista('borradores')}>Borradores</button>
      </div>

      <div className="tarjeta lista">
        {lista.length === 0 && <Vacio titulo="No hay actividades aquí" />}

        {lista.map((mision) => (
          <div key={mision.idMision} className="fila">
            <IconoMision tipo={mision.tipo} />
            <div className="fila-texto">
              <strong>{mision.nombre}</strong>
              <span className="texto-tenue">{mision.descripcion}</span>
            </div>
            <span className="xp">+{mision.puntosXp} XP</span>
            <div className="fila-acciones">
              <button className="btn btn-suave btn-chico" onClick={() => pausarOPublicar(mision)}>{mision.activa ? 'Pausar' : 'Publicar'}</button>
              <button className="btn btn-icono" onClick={() => setEditando(mision)}><Pencil size={16} /></button>
              <button className="btn btn-icono" onClick={() => borrar(mision)}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {editando !== null && (
        <Modal titulo="Actividad" onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error !== '' && <div className="error-form">{error}</div>}

            <label className="campo">
              <span>Nombre</span>
              <input className="input" required value={editando.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </label>
            <label className="campo">
              <span>Descripción</span>
              <textarea className="textarea" value={editando.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
            </label>
            <div className="form-fila">
              <label className="campo">
                <span>Tipo</span>
                <select className="select" value={editando.tipo} onChange={(e) => cambiar('tipo', e.target.value)}>
                  <option value="FOTO">Tomar una foto</option>
                  <option value="QUIZ">Responder un quiz</option>
                  <option value="VISITA">Visitar / consumir</option>
                  <option value="COMPARTIR">Compartir experiencia</option>
                  <option value="OTRA">Otra</option>
                </select>
              </label>
              <label className="campo">
                <span>Puntos XP</span>
                <input className="input" type="number" required value={editando.puntosXp} onChange={(e) => cambiar('puntosXp', Number(e.target.value))} />
              </label>
            </div>
            <label>
              <input type="checkbox" checked={editando.activa} onChange={(e) => cambiar('activa', e.target.checked)} />{' '}
              Publicar ahora (si no, se guarda como borrador)
            </label>
            <button className="btn btn-primario">Guardar</button>
          </form>
        </Modal>
      )}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
