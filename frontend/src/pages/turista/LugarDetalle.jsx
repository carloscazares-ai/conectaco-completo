import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Navigation, Bookmark, Share2, MapPin, Clock, Wallet, PenLine, MessageCircle, Check } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { fecha } from '../../lib/formato.js';
import { Estado, Estrellas, IconoMision, Imagen, Vacio } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Mapa from '../../components/Mapa.jsx';
import NuevoRecuerdo from './NuevoRecuerdo.jsx';

export default function LugarDetalle() {
  const { idLugar } = useParams();
  const { sesion } = useSesion();
  const avisar = useToast();
  const [pestana, setPestana] = useState('info');
  const [escribiendo, setEscribiendo] = useState(false);

  const lugar = useApi(() => api.get(`/lugares/${idLugar}?idTurista=${sesion.idTurista}`), [idLugar]);
  const misiones = useApi(() => api.get(`/lugares/${idLugar}/misiones?idTurista=${sesion.idTurista}`), [idLugar]);
  const opiniones = useApi(() => api.get(`/lugares/${idLugar}/opiniones`), [idLugar]);

  if (!lugar.datos) return <Estado cargando={lugar.cargando} error={lugar.error} onReintentar={lugar.recargar} />;
  const l = lugar.datos;

  const guardar = async () => {
    try {
      const actualizado = await api.post(`/turistas/${sesion.idTurista}/favoritos/${l.idLugar}`);
      lugar.setDatos(actualizado);
      avisar(actualizado.favorito ? 'Guardado en tus favoritos' : 'Quitado de favoritos');
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  const compartir = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      avisar('Enlace copiado');
    } catch {
      avisar('No se pudo copiar el enlace', 'error');
    }
  };

  const completar = async (mision) => {
    try {
      const r = await api.post(`/turistas/${sesion.idTurista}/misiones/${mision.idMision}/completar`);
      avisar(r.subioNivel ? `¡+${r.xpGanada} XP! Subiste al nivel ${r.nivel} 🎉` : `¡+${r.xpGanada} XP!`);
      misiones.recargar();
    } catch (e) {
      avisar(e.message, 'error');
    }
  };

  const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${l.latitud},${l.longitud}`;

  return (
    <div className="pagina">
      <Link to="/turista/explorar" className="texto-suave" style={{ display: 'flex', gap: 6, width: 'fit-content' }}>
        <ArrowLeft size={18} /> Volver a explorar
      </Link>

      <div className="dos-columnas">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Imagen src={l.imagenUrl} alt={l.nombre} className="detalle-portada" />
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>{l.nombre}</h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
              <Estrellas valor={l.calificacionPromedio} opiniones={l.opiniones} />
              <span className="etiqueta etiqueta-terracota">{l.categoria}</span>
              <span className="texto-tenue"><MapPin size={14} style={{ verticalAlign: -2 }} /> {l.direccion}</span>
            </div>
          </div>

          <div className="detalle-acciones">
            <a className="btn btn-suave" href={comoLlegar} target="_blank" rel="noreferrer"><Navigation size={18} /> Cómo llegar</a>
            <button className="btn btn-suave" onClick={guardar}>
              <Bookmark size={18} fill={l.favorito ? 'currentColor' : 'none'} /> {l.favorito ? 'Guardado' : 'Guardar'}
            </button>
            <button className="btn btn-suave" onClick={compartir}><Share2 size={18} /> Compartir</button>
            <button className="btn btn-primario" onClick={() => setEscribiendo(true)}><PenLine size={18} /> Crear recuerdo</button>
          </div>

          <div className="subtabs">
            {[['info', 'Información'], ['actividades', `Actividades (${misiones.datos?.length ?? 0})`], ['opiniones', `Opiniones (${opiniones.datos?.length ?? 0})`]].map(([id, texto]) => (
              <button key={id} className={`subtab ${pestana === id ? 'activo' : ''}`} onClick={() => setPestana(id)}>{texto}</button>
            ))}
          </div>

          {pestana === 'info' && (
            <div className="tarjeta tarjeta-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ lineHeight: 1.6 }}>{l.descripcion || 'Este lugar aún no tiene descripción.'}</p>
              <div className="form-fila">
                <span className="texto-suave"><Clock size={16} style={{ verticalAlign: -3 }} /> {l.horario}</span>
                <span className="texto-suave"><Wallet size={16} style={{ verticalAlign: -3 }} /> {l.costo}</span>
              </div>
            </div>
          )}

          {pestana === 'actividades' && (
            <div className="tarjeta lista">
              {misiones.datos?.length === 0 && <Vacio titulo="Sin actividades">Este lugar aún no tiene actividades.</Vacio>}
              {misiones.datos?.map((m) => (
                <div key={m.idMision} className="fila">
                  <IconoMision tipo={m.tipo} />
                  <div className="fila-texto">
                    <strong>{m.nombre}</strong>
                    <span className="texto-tenue">{m.descripcion}</span>
                  </div>
                  <span className="xp">+{m.puntosXp} XP</span>
                  {m.estado === 'COMPLETADA'
                    ? <span className="etiqueta etiqueta-verde"><Check size={14} /> Completada</span>
                    : <button className="btn btn-primario btn-chico" onClick={() => completar(m)}>Completar</button>}
                </div>
              ))}
            </div>
          )}

          {pestana === 'opiniones' && (
            <div className="tarjeta lista">
              {opiniones.datos?.length === 0 && (
                <Vacio icono={MessageCircle} titulo="Aún no hay opiniones">Crea un recuerdo de este lugar para dejar la primera.</Vacio>
              )}
              {opiniones.datos?.map((o) => (
                <div key={o.idRecuerdo} className="fila" style={{ alignItems: 'flex-start' }}>
                  <div className="avatar">{o.autor[0]}</div>
                  <div className="fila-texto">
                    <strong>{o.autor}</strong>
                    <span className="texto-tenue">{fecha(o.fecha)}{o.calificacion ? ` · ${'★'.repeat(o.calificacion)}` : ''}</span>
                    <p style={{ marginTop: 6 }}>{o.resena}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 32 }}>
          <Mapa lugares={[l]} seleccionado={l.idLugar} centro={[l.latitud, l.longitud]} zoom={15} alto={320} />
          <div className="tarjeta tarjeta-pad">
            <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 6 }}>Gana experiencia aquí</h2>
            <p className="texto-suave">
              Completa las actividades de {l.nombre} para sumar XP, subir de nivel y desbloquear recompensas para tu mascota.
            </p>
            <button className="btn btn-secundario btn-bloque" style={{ marginTop: 14 }} onClick={() => setPestana('actividades')}>
              Ver actividades
            </button>
          </div>
        </aside>
      </div>

      {escribiendo && (
        <NuevoRecuerdo
          idLugarInicial={l.idLugar}
          onCerrar={() => setEscribiendo(false)}
          onGuardado={() => { setEscribiendo(false); opiniones.recargar(); lugar.recargar(); }}
        />
      )}
    </div>
  );
}
