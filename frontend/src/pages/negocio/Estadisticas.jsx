import { useState } from 'react';
import { Eye, CheckCircle2, Users } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { numero } from '../../lib/formato.js';
import { Estado, Stat } from '../../components/Piezas.jsx';
import Grafica from '../../components/Grafica.jsx';

const PERIODOS = [[7, 'Últimos 7 días'], [30, 'Últimos 30 días'], [90, 'Últimos 90 días']];

export default function Estadisticas() {
  const { sesion } = useSesion();
  const [dias, setDias] = useState(30);
  const { datos, error, cargando, recargar } = useApi(
    () => api.get(`/negocios/${sesion.idNegocio}/estadisticas?dias=${dias}`), [dias]);

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Estadísticas</h1>
          <p>Cómo interactúan los turistas con tu negocio. El porcentaje compara con el periodo anterior.</p>
        </div>
        <select className="select" style={{ width: 220 }} value={dias} onChange={(e) => setDias(Number(e.target.value))}
                aria-label="Periodo">
          {PERIODOS.map(([d, texto]) => <option key={d} value={d}>{texto}</option>)}
        </select>
      </div>

      {!datos && <Estado cargando={cargando} error={error} onReintentar={recargar} />}
      {datos && (
        <>
          <div className="grid-stats">
            <Stat icono={Eye} valor={numero(datos.visitas)} etiqueta="Visitas al perfil" cambio={datos.cambioVisitas} />
            <Stat icono={CheckCircle2} valor={datos.actividadesCompletadas} etiqueta="Actividades completadas" cambio={datos.cambioActividades} />
            <Stat icono={Users} valor={datos.nuevosSeguidores} etiqueta="Nuevos seguidores" cambio={datos.cambioSeguidores} />
          </div>
          <div className="tarjeta tarjeta-pad">
            <div className="seccion-titulo" style={{ marginBottom: 12 }}><h2>Visitas al perfil</h2></div>
            <Grafica datos={datos.serieVisitas} alto={260} />
          </div>
        </>
      )}
    </div>
  );
}
