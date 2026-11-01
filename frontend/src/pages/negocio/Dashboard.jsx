import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, ClipboardList, Users, Store } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { numero, zonaDe } from '../../lib/formato.js';
import { Estrellas, Imagen, Stat } from '../../components/Piezas.jsx';
import Grafica from '../../components/Grafica.jsx';

export default function Dashboard() {
  const sesion = obtenerSesion();
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setDatos(await api.get('/negocios/' + sesion.idNegocio + '/dashboard'));
    } catch (e) {
      setError(e.message);
    }
  }

  if (error !== '') return <p className="error-form">{error}</p>;
  if (datos === null) return <p className="cargando">Cargando…</p>;

  const lugar = datos.lugar;

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Hola, {datos.nombre} 👋</h1>
          <p>Así va tu negocio en conecTaco.</p>
        </div>
      </div>

      {lugar !== null ? (
        <Link to="/negocio/establecimiento" className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <Imagen src={lugar.imagenUrl} alt={lugar.nombre} style={{ width: 120, height: 90 }} />
          <div>
            <h2>{lugar.nombre}</h2>
            <p className="texto-suave">{lugar.categoria} · {zonaDe(lugar.direccion)}</p>
            <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
          </div>
        </Link>
      ) : (
        <div className="tarjeta tarjeta-pad" style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div className="stat-icono"><Store /></div>
          <div style={{ flex: 1 }}>
            <h2>Registra tu establecimiento</h2>
            <p className="texto-suave">Agrega tu dirección para aparecer en el mapa de los turistas.</p>
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
        <div className="seccion-titulo">
          <h2>Resumen (últimos 30 días)</h2>
          <Link to="/negocio/estadisticas">Ver estadísticas</Link>
        </div>
        <Grafica datos={datos.visitasUltimos30Dias} alto={240} />
      </div>
    </div>
  );
}
