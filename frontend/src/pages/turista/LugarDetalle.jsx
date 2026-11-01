import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Navigation, Bookmark, Share2, MapPin, Clock, Wallet, PenLine, Check } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { fecha } from '../../lib/formato.js';
import { Estrellas, IconoMision, Imagen, Vacio } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import Mapa from '../../components/Mapa.jsx';
import NuevoRecuerdo from './NuevoRecuerdo.jsx';

export default function LugarDetalle() {
  // :idLugar de la URL, por ejemplo /turista/lugares/1
  const { idLugar } = useParams();
  const sesion = obtenerSesion();

  const [lugar, setLugar] = useState(null);
  const [misiones, setMisiones] = useState([]);
  const [opiniones, setOpiniones] = useState([]);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');
  const [pestana, setPestana] = useState('info');
  const [escribiendo, setEscribiendo] = useState(false);

  useEffect(() => {
    cargar();
  }, [idLugar]);

  async function cargar() {
    try {
      setLugar(await api.get('/lugares/' + idLugar + '?idTurista=' + sesion.idTurista));
      setMisiones(await api.get('/lugares/' + idLugar + '/misiones?idTurista=' + sesion.idTurista));
      setOpiniones(await api.get('/lugares/' + idLugar + '/opiniones'));
    } catch (e) {
      setError(e.message);
    }
  }

  async function guardarFavorito() {
    try {
      const actualizado = await api.post('/turistas/' + sesion.idTurista + '/favoritos/' + idLugar);
      setLugar(actualizado);
      setAviso(actualizado.favorito ? 'Guardado en tus favoritos' : 'Quitado de favoritos');
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function compartir() {
    await navigator.clipboard.writeText(window.location.href);
    setAviso('Enlace copiado');
  }

  async function completar(idMision) {
    try {
      const resultado = await api.post('/turistas/' + sesion.idTurista + '/misiones/' + idMision + '/completar');
      if (resultado.subioNivel) {
        setAviso('¡+' + resultado.xpGanada + ' XP! Subiste al nivel ' + resultado.nivel + ' 🎉');
      } else {
        setAviso('¡+' + resultado.xpGanada + ' XP!');
      }
      setMisiones(await api.get('/lugares/' + idLugar + '/misiones?idTurista=' + sesion.idTurista));
    } catch (e) {
      setAviso(e.message);
    }
  }

  function alGuardarRecuerdo() {
    setEscribiendo(false);
    cargar();
  }

  if (error !== '') return <p className="error-form">{error}</p>;
  if (lugar === null) return <p className="cargando">Cargando…</p>;

  const comoLlegar = 'https://www.google.com/maps/dir/?api=1&destination=' + lugar.latitud + ',' + lugar.longitud;

  return (
    <div className="pagina">
      <Link to="/turista/explorar" className="texto-suave"><ArrowLeft size={18} /> Volver a explorar</Link>

      <div className="dos-columnas">
        <div className="form">
          <Imagen src={lugar.imagenUrl} alt={lugar.nombre} className="detalle-portada" />

          <div>
            <h1 style={{ fontSize: 32 }}>{lugar.nombre}</h1>
            <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />{' '}
            <span className="etiqueta etiqueta-terracota">{lugar.categoria}</span>{' '}
            <span className="texto-tenue"><MapPin size={14} /> {lugar.direccion}</span>
          </div>

          <div className="detalle-acciones">
            <a className="btn btn-suave" href={comoLlegar} target="_blank"><Navigation size={18} /> Cómo llegar</a>
            <button className="btn btn-suave" onClick={guardarFavorito}>
              <Bookmark size={18} /> {lugar.favorito ? 'Guardado' : 'Guardar'}
            </button>
            <button className="btn btn-suave" onClick={compartir}><Share2 size={18} /> Compartir</button>
            <button className="btn btn-primario" onClick={() => setEscribiendo(true)}><PenLine size={18} /> Crear recuerdo</button>
          </div>

          <div className="subtabs">
            <button className={pestana === 'info' ? 'subtab activo' : 'subtab'} onClick={() => setPestana('info')}>Información</button>
            <button className={pestana === 'actividades' ? 'subtab activo' : 'subtab'} onClick={() => setPestana('actividades')}>Actividades ({misiones.length})</button>
            <button className={pestana === 'opiniones' ? 'subtab activo' : 'subtab'} onClick={() => setPestana('opiniones')}>Opiniones ({opiniones.length})</button>
          </div>

          {pestana === 'info' && (
            <div className="tarjeta tarjeta-pad form">
              <p>{lugar.descripcion}</p>
              <div className="form-fila">
                <span className="texto-suave"><Clock size={16} /> {lugar.horario}</span>
                <span className="texto-suave"><Wallet size={16} /> {lugar.costo}</span>
              </div>
            </div>
          )}

          {pestana === 'actividades' && (
            <div className="tarjeta lista">
              {misiones.length === 0 && <Vacio titulo="Sin actividades" />}
              {misiones.map((mision) => (
                <div key={mision.idMision} className="fila">
                  <IconoMision tipo={mision.tipo} />
                  <div className="fila-texto">
                    <strong>{mision.nombre}</strong>
                    <span className="texto-tenue">{mision.descripcion}</span>
                  </div>
                  <span className="xp">+{mision.puntosXp} XP</span>
                  {mision.estado === 'COMPLETADA' ? (
                    <span className="etiqueta etiqueta-verde"><Check size={14} /> Completada</span>
                  ) : (
                    <button className="btn btn-primario btn-chico" onClick={() => completar(mision.idMision)}>Completar</button>
                  )}
                </div>
              ))}
            </div>
          )}

          {pestana === 'opiniones' && (
            <div className="tarjeta lista">
              {opiniones.length === 0 && <Vacio titulo="Aún no hay opiniones">Crea un recuerdo para dejar la primera.</Vacio>}
              {opiniones.map((opinion) => (
                <div key={opinion.idRecuerdo} className="fila">
                  <div className="avatar">{opinion.autor[0]}</div>
                  <div className="fila-texto">
                    <strong>{opinion.autor}</strong>
                    <span className="texto-tenue">{fecha(opinion.fecha)} · {opinion.calificacion} estrellas</span>
                    <p>{opinion.resena}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="form">
          <Mapa lugares={[lugar]} seleccionado={lugar.idLugar} centro={[lugar.latitud, lugar.longitud]} zoom={15} alto={320} />
        </aside>
      </div>

      {escribiendo && (
        <NuevoRecuerdo idLugarInicial={lugar.idLugar} onCerrar={() => setEscribiendo(false)} onGuardado={alGuardarRecuerdo} />
      )}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
