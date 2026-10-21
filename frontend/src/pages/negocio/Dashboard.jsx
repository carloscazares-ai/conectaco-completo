import { Link } from 'react-router-dom';
import { Eye, ClipboardList, Users, Store, ChevronRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { numero, zonaDe } from '../../lib/formato.js';
import { Estado, Estrellas, Imagen, Stat } from '../../components/Piezas.jsx';
import Grafica from '../../components/Grafica.jsx';

export default function Dashboard() {
  const { sesion } = useSesion();
  const { datos, error, cargando, recargar } = useApi(() => api.get(`/negocios/${sesion.idNegocio}/dashboard`), []);

  if (!datos) return <Estado cargando={cargando} error={error} onReintentar={recargar} />;
  const { lugar } = datos;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Hola, {datos.nombre} 👋</h1>
          <p>Así va tu negocio en conecTaco.</p>
        </div>
      </div>

      {lugar ? (
        <Link to="/negocio/establecimiento" className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Imagen src={lugar.imagenUrl} alt={lugar.nombre} style={{ width: 120, height: 90, flex: 'none' }} />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>{lugar.nombre}</h2>
            <p className="texto-suave">{lugar.categoria} · {zonaDe(lugar.direccion)}</p>
            <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
          </div>
          <ChevronRight color="var(--tinta-tenue)" />
        </Link>
      ) : (
        <div className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="stat-icono"><Store /></div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Registra tu establecimiento</h2>
            <p className="texto-suave">Agrega la dirección y los datos de tu negocio para aparecer en el mapa de los turistas.</p>
          </div>
          <Link to="/negocio/establecimiento" className="btn btn-primario">Registrar ahora</Link>
        </div>
      )}

      <div className="grid-stats">
        <Stat icono={Eye} valor={numero(datos.visitas)} etiqueta="Visitas al perfil" />
        <Stat icono={ClipboardList} valor={datos.actividades} etiqueta="Actividades" />
        <Stat icono={Users} valor={datos.seguidores} etiqueta="Seguidores" />
      </div>

      <div className="tarjeta tarjeta-pad">
        <div className="seccion-titulo" style={{ marginBottom: 12 }}>
          <h2>Resumen <span className="texto-tenue" style={{ fontWeight: 600 }}>(últimos 30 días)</span></h2>
          <Link to="/negocio/estadisticas">Ver estadísticas</Link>
        </div>
        <Grafica datos={datos.visitasUltimos30Dias} />
      </div>
    </div>
  );
}
