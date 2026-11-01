import { useEffect, useState } from 'react';
import { Apple, Gamepad2, Pencil, Lock } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import Aviso from '../../components/Aviso.jsx';
import Michi, { IconoRecompensa } from '../../components/Michi.jsx';
import Modal from '../../components/Modal.jsx';

export default function Mascota() {
  const sesion = obtenerSesion();
  const base = '/turistas/' + sesion.idTurista;

  const [mascota, setMascota] = useState(null);
  const [recompensas, setRecompensas] = useState([]);
  const [aviso, setAviso] = useState('');
  const [renombrando, setRenombrando] = useState(false);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setMascota(await api.get(base + '/mascota'));
      setRecompensas(await api.get(base + '/recompensas'));
    } catch (e) {
      setAviso(e.message);
    }
  }

  // accion: 'alimentar' o 'jugar'
  async function cuidar(accion) {
    try {
      setMascota(await api.post(base + '/mascota/' + accion));
      setAviso('+10 XP para tu mascota');
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function canjear(recompensa) {
    try {
      await api.post(base + '/recompensas/' + recompensa.idRecompensa + '/canjear');
      setAviso('¡Canjeaste ' + recompensa.nombre + '!');
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  // idRecompensa = 0 significa quitarle el accesorio
  async function ponerAccesorio(idRecompensa) {
    try {
      await api.put(base + '/mascota', { idRecompensaEquipada: idRecompensa });
      cargar();
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function guardarNombre(evento) {
    evento.preventDefault();
    try {
      setMascota(await api.put(base + '/mascota', { nombre }));
      setRenombrando(false);
    } catch (e) {
      setAviso(e.message);
    }
  }

  function abrirRenombrar() {
    setNombre(mascota.nombre);
    setRenombrando(true);
  }

  if (mascota === null) return <p className="cargando">Cargando…</p>;

  const avance = (mascota.xpEnNivel / mascota.xpPorNivel) * 100;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Mi mascota</h1>
          <p>Gana XP con actividades para que tu mascota suba de nivel y desbloquee accesorios.</p>
        </div>
      </div>

      <div className="dos-columnas" style={{ gridTemplateColumns: '420px 1fr' }}>
        <div className="tarjeta mascota-panel">
          <Michi accesorio={mascota.accesorio} className="mascota-svg" />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ fontSize: 26 }}>{mascota.nombre}</h2>
            <button className="btn btn-icono" onClick={abrirRenombrar}><Pencil size={15} /></button>
          </div>

          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>Nivel {mascota.nivel}</strong>
              <span className="texto-tenue">{mascota.xpEnNivel} / {mascota.xpPorNivel} XP</span>
            </div>
            <div className="barra"><div style={{ width: avance + '%' }} /></div>
          </div>

          <div className="mascota-acciones" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <button className="accion-mascota" onClick={() => cuidar('alimentar')}><Apple /> Alimentar</button>
            <button className="accion-mascota" onClick={() => cuidar('jugar')}><Gamepad2 /> Jugar</button>
          </div>

          {mascota.accesorio && <span className="texto-suave">Lleva puesto: <strong>{mascota.accesorio}</strong></span>}
        </div>

        <section className="form">
          <h2>Recompensas</h2>
          <div className="recompensas">
            {recompensas.map((recompensa) => (
              <div key={recompensa.idRecompensa} className={recompensa.desbloqueada ? 'tarjeta recompensa' : 'tarjeta recompensa bloqueada'}>
                <div className="recompensa-icono"><IconoRecompensa nombre={recompensa.nombre} /></div>
                <strong>{recompensa.nombre}</strong>
                <span className="texto-tenue">{recompensa.descripcion}</span>
                <span className="xp">{recompensa.requisitoXp} XP</span>

                {!recompensa.desbloqueada && (
                  <span className="etiqueta etiqueta-gris"><Lock size={12} /> Bloqueada</span>
                )}
                {recompensa.desbloqueada && !recompensa.canjeada && (
                  <button className="btn btn-primario btn-chico btn-bloque" onClick={() => canjear(recompensa)}>Canjear</button>
                )}
                {recompensa.canjeada && !recompensa.equipada && (
                  <button className="btn btn-secundario btn-chico btn-bloque" onClick={() => ponerAccesorio(recompensa.idRecompensa)}>Ponérselo</button>
                )}
                {recompensa.equipada && (
                  <button className="btn btn-suave btn-chico btn-bloque" onClick={() => ponerAccesorio(0)}>Quitárselo</button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      {renombrando && (
        <Modal titulo="Nombre de tu mascota" onCerrar={() => setRenombrando(false)}>
          <form className="form" onSubmit={guardarNombre}>
            <input className="input" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <button className="btn btn-primario">Guardar</button>
          </form>
        </Modal>
      )}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
