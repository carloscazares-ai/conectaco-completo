import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Music } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { fecha } from '../../lib/formato.js';
import { Imagen, Vacio } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import NuevoRecuerdo from './NuevoRecuerdo.jsx';

export default function Recuerdos() {
  const sesion = obtenerSesion();
  const base = '/turistas/' + sesion.idTurista + '/recuerdos';

  const [recuerdos, setRecuerdos] = useState([]);
  const [creando, setCreando] = useState(false);
  const [aviso, setAviso] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setRecuerdos(await api.get(base));
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function borrar(recuerdo) {
    if (!window.confirm('¿Borrar el recuerdo "' + recuerdo.titulo + '"?')) {
      return;
    }
    try {
      await api.del(base + '/' + recuerdo.idRecuerdo);
      setAviso('Recuerdo borrado');
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  function alGuardar() {
    setCreando(false);
    setAviso('Recuerdo guardado');
    cargar();
  }

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Mis recuerdos</h1>
          <p>Los momentos que guardaste en tus visitas por la ciudad.</p>
        </div>
        <button className="btn btn-primario" onClick={() => setCreando(true)}><Plus size={18} /> Nuevo recuerdo</button>
      </div>

      {recuerdos.length === 0 && <div className="tarjeta"><Vacio titulo="Aún no tienes recuerdos" /></div>}

      <div className="grid-recuerdos">
        {recuerdos.map((recuerdo) => (
          <article key={recuerdo.idRecuerdo} className="tarjeta recuerdo">
            <Imagen src={recuerdo.imagenUrl} alt={recuerdo.titulo} />
            <div className="tarjeta-pad form" style={{ gap: 6 }}>
              <h3>{recuerdo.titulo}</h3>
              <Link to={'/turista/lugares/' + recuerdo.idLugar} className="xp">{recuerdo.lugar}</Link>
              <span className="texto-tenue">{fecha(recuerdo.fecha)} · {recuerdo.calificacion} estrellas</span>
              <p className="texto-suave">{recuerdo.resena}</p>
              {recuerdo.cancionUrl && (
                <a href={recuerdo.cancionUrl} target="_blank" className="xp"><Music size={15} /> Escuchar la canción</a>
              )}
              <button className="btn btn-peligro btn-chico" onClick={() => borrar(recuerdo)}><Trash2 size={15} /> Borrar</button>
            </div>
          </article>
        ))}
      </div>

      {creando && <NuevoRecuerdo onCerrar={() => setCreando(false)} onGuardado={alGuardar} />}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
