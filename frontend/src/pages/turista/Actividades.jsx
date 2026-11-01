import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { IconoMision, Vacio } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';

export default function Actividades() {
  const sesion = obtenerSesion();
  const [misiones, setMisiones] = useState([]);
  const [filtro, setFiltro] = useState('disponibles');
  const [aviso, setAviso] = useState('');

  // Se vuelve a cargar cada vez que cambia el filtro
  useEffect(() => {
    cargar();
  }, [filtro]);

  async function cargar() {
    try {
      setMisiones(await api.get('/turistas/' + sesion.idTurista + '/misiones?filtro=' + filtro));
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function completar(idMision) {
    try {
      const resultado = await api.post('/turistas/' + sesion.idTurista + '/misiones/' + idMision + '/completar');
      if (resultado.subioNivel) {
        setAviso('¡+' + resultado.xpGanada + ' XP! Subiste al nivel ' + resultado.nivel + ' 🎉');
      } else {
        setAviso('¡+' + resultado.xpGanada + ' XP! Llevas ' + resultado.xpTotal + ' XP');
      }
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Actividades</h1>
          <p>Completa actividades en los lugares de la ciudad y gana experiencia.</p>
        </div>
        <div className="tabs">
          <button className={filtro === 'todas' ? 'tab activo' : 'tab'} onClick={() => setFiltro('todas')}>Todas</button>
          <button className={filtro === 'disponibles' ? 'tab activo' : 'tab'} onClick={() => setFiltro('disponibles')}>Disponibles</button>
          <button className={filtro === 'completadas' ? 'tab activo' : 'tab'} onClick={() => setFiltro('completadas')}>Completadas</button>
        </div>
      </div>

      <div className="tarjeta lista">
        {misiones.length === 0 && <Vacio titulo="No hay actividades aquí" />}

        {misiones.map((mision) => (
          <div key={mision.idMision} className="fila">
            <IconoMision tipo={mision.tipo} />
            <div className="fila-texto">
              <strong>{mision.nombre}</strong>
              <span className="texto-tenue">
                <Link to={'/turista/lugares/' + mision.idLugar} className="xp">{mision.lugar}</Link> · {mision.descripcion}
              </span>
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

      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
