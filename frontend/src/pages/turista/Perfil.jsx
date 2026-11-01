import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { numero } from '../../lib/formato.js';
import { LugarCard, Vacio } from '../../components/Piezas.jsx';
import { Iniciales } from '../../components/Layout.jsx';

export default function Perfil() {
  const sesion = obtenerSesion();
  const [resumen, setResumen] = useState(null);
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    setResumen(await api.get('/turistas/' + sesion.idTurista + '/dashboard'));
    setFavoritos(await api.get('/turistas/' + sesion.idTurista + '/favoritos'));
  }

  return (
    <div className="pagina">
      <div className="encabezado"><h1>Mi perfil</h1></div>

      <div className="tarjeta tarjeta-pad" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Iniciales nombre={sesion.nombre} grande />
        <div>
          <h2>{sesion.nombre}</h2>
          <p className="texto-suave">{sesion.email} · Turista</p>
          {resumen !== null && (
            <p>
              <strong>Nivel {resumen.nivel}</strong> · {numero(resumen.xp)} XP · {resumen.lugaresVisitados} lugares visitados
            </p>
          )}
        </div>
      </div>

      <h2>Lugares guardados</h2>
      {favoritos.length === 0 && <div className="tarjeta"><Vacio titulo="No has guardado lugares" /></div>}
      <div className="grid-lugares">
        {favoritos.map((lugar) => (
          <LugarCard key={lugar.idLugar} lugar={lugar} />
        ))}
      </div>
    </div>
  );
}
