import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { hoyISO } from '../../lib/formato.js';
import Modal from '../../components/Modal.jsx';

// Ventana para crear un recuerdo. La usan Recuerdos y LugarDetalle.
export default function NuevoRecuerdo({ idLugarInicial, onCerrar, onGuardado }) {
  const sesion = obtenerSesion();
  const [lugares, setLugares] = useState([]);
  const [error, setError] = useState('');

  const [idLugar, setIdLugar] = useState(idLugarInicial || '');
  const [titulo, setTitulo] = useState('');
  const [resena, setResena] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [dia, setDia] = useState(hoyISO());
  const [imagenUrl, setImagenUrl] = useState('');
  const [cancionUrl, setCancionUrl] = useState('');

  useEffect(() => {
    cargarLugares();
  }, []);

  async function cargarLugares() {
    setLugares(await api.get('/lugares'));
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    try {
      await api.post('/turistas/' + sesion.idTurista + '/recuerdos', {
        idLugar: Number(idLugar),
        titulo,
        resena,
        calificacion: Number(calificacion),
        fecha: dia,
        imagenUrl,
        cancionUrl,
      });
      onGuardado();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Modal titulo="Nuevo recuerdo" onCerrar={onCerrar}>
      <form className="form" onSubmit={guardar}>
        {error !== '' && <div className="error-form">{error}</div>}

        <label className="campo">
          <span>Lugar</span>
          <select className="select" required value={idLugar} onChange={(e) => setIdLugar(e.target.value)}>
            <option value="">Elige un lugar</option>
            {lugares.map((lugar) => (
              <option key={lugar.idLugar} value={lugar.idLugar}>{lugar.nombre}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Título</span>
          <input className="input" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        </label>
        <label className="campo">
          <span>Reseña</span>
          <textarea className="textarea" value={resena} onChange={(e) => setResena(e.target.value)} />
        </label>
        <div className="form-fila">
          <label className="campo">
            <span>Calificación</span>
            <select className="select" value={calificacion} onChange={(e) => setCalificacion(e.target.value)}>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </label>
          <label className="campo">
            <span>Fecha</span>
            <input className="input" type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
          </label>
        </div>
        <label className="campo">
          <span>URL de una foto (opcional)</span>
          <input className="input" type="url" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} />
        </label>
        <label className="campo">
          <span>Canción del recuerdo (opcional)</span>
          <input className="input" type="url" value={cancionUrl} onChange={(e) => setCancionUrl(e.target.value)} />
        </label>

        <button className="btn btn-primario">Guardar recuerdo</button>
      </form>
    </Modal>
  );
}
