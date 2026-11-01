import { useEffect, useState } from 'react';
import { Eye, CheckCircle2, Users } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { numero } from '../../lib/formato.js';
import { Stat } from '../../components/Piezas.jsx';
import Grafica from '../../components/Grafica.jsx';

export default function Estadisticas() {
  const sesion = obtenerSesion();
  const [dias, setDias] = useState(30);
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  // Se vuelve a cargar cada vez que cambia el periodo
  useEffect(() => {
    cargar();
  }, [dias]);

  async function cargar() {
    try {
      setDatos(await api.get('/negocios/' + sesion.idNegocio + '/estadisticas?dias=' + dias));
    } catch (e) {
      setError(e.message);
    }
  }

  if (error !== '') return <p className="error-form">{error}</p>;
  if (datos === null) return <p className="cargando">Cargando…</p>;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Estadísticas</h1>
          <p>Cómo interactúan los turistas con tu negocio. El porcentaje compara con el periodo anterior.</p>
        </div>
        <select className="select" style={{ width: 220 }} value={dias} onChange={(e) => setDias(Number(e.target.value))}>
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>

      <div className="grid-stats">
        <Stat icono={Eye} valor={numero(datos.visitas)} etiqueta="Visitas al perfil" cambio={datos.cambioVisitas} />
        <Stat icono={CheckCircle2} valor={datos.actividadesCompletadas} etiqueta="Actividades completadas" cambio={datos.cambioActividades} />
        <Stat icono={Users} valor={datos.nuevosSeguidores} etiqueta="Nuevos seguidores" cambio={datos.cambioSeguidores} />
      </div>

      <div className="tarjeta tarjeta-pad">
        <h2>Visitas al perfil</h2>
        <Grafica datos={datos.serieVisitas} alto={280} />
      </div>
    </div>
  );
}
