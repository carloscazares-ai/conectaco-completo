import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Bookmark } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { Estado, Estrellas, Imagen, Vacio } from '../../components/Piezas.jsx';
import Mapa from '../../components/Mapa.jsx';

export default function Explorar() {
  const { sesion } = useSesion();
  const [params, setParams] = useSearchParams();
  const [texto, setTexto] = useState(params.get('q') ?? '');
  const busqueda = params.get('q') ?? '';
  const categoria = params.get('categoria') ?? '';
  const [seleccionado, setSeleccionado] = useState(null);
  const tarjetas = useRef({});

  const categorias = useApi(() => api.get('/categorias'), []);
  const lugares = useApi(() => {
    const filtros = new URLSearchParams({ idTurista: sesion.idTurista });
    if (busqueda) filtros.set('q', busqueda);
    if (categoria) filtros.set('categoria', categoria);
    return api.get(`/lugares?${filtros}`);
  }, [busqueda, categoria, sesion.idTurista]);

  // Espera medio segundo después de escribir para buscar
  useEffect(() => {
    const t = setTimeout(() => {
      if (texto !== busqueda) {
        const nuevos = new URLSearchParams(params);
        if (texto) nuevos.set('q', texto); else nuevos.delete('q');
        setParams(nuevos, { replace: true });
      }
    }, 400);
    return () => clearTimeout(t);
  }, [texto, busqueda, params, setParams]);

  const elegirCategoria = (id) => {
    const nuevos = new URLSearchParams(params);
    if (id) nuevos.set('categoria', id); else nuevos.delete('categoria');
    setParams(nuevos, { replace: true });
  };

  const elegirLugar = (id) => {
    setSeleccionado(id);
    tarjetas.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="pagina" style={{ maxWidth: 1400 }}>
      <div className="encabezado">
        <div>
          <h1>Explorar</h1>
          <p>Encuentra lugares en el mapa y filtra por lo que te gusta.</p>
        </div>
        <div className="input-icono" style={{ width: 'min(420px, 100%)' }}>
          <Search size={18} />
          <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)}
                 placeholder="Buscar en esta zona…" aria-label="Buscar lugares" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className={`chip ${!categoria ? 'activo' : ''}`} onClick={() => elegirCategoria('')}>Todos</button>
        {(categorias.datos ?? []).map((c) => (
          <button key={c.idCategoria} className={`chip ${categoria === String(c.idCategoria) ? 'activo' : ''}`}
                  onClick={() => elegirCategoria(String(c.idCategoria))}>{c.nombre}</button>
        ))}
      </div>

      <div className="explorar">
        <div className="explorar-lista">
          {!lugares.datos && <Estado cargando={lugares.cargando} error={lugares.error} onReintentar={lugares.recargar} />}
          {lugares.datos?.length === 0 && <Vacio icono={MapPin} titulo="No encontramos lugares">Prueba con otra búsqueda o categoría.</Vacio>}
          {lugares.datos?.map((lugar) => (
            <div key={lugar.idLugar} ref={(el) => { tarjetas.current[lugar.idLugar] = el; }}
                 className={`tarjeta lugar-mini ${seleccionado === lugar.idLugar ? 'seleccionado' : ''}`}
                 onClick={() => setSeleccionado(lugar.idLugar)}>
              <Imagen src={lugar.imagenUrl} alt={lugar.nombre} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <h3>{lugar.nombre}</h3>
                  {lugar.favorito && <Bookmark size={16} color="var(--terracota)" fill="var(--terracota)" />}
                </div>
                <span className="texto-tenue">{lugar.categoria} · {lugar.direccion}</span>
                <div className="lugar-card-meta">
                  <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
                  <Link to={`/turista/lugares/${lugar.idLugar}`} className="xp" onClick={(e) => e.stopPropagation()}>Ver detalle</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Mapa
          lugares={lugares.datos ?? []}
          seleccionado={seleccionado}
          onSeleccionar={elegirLugar}
          popup={(lugar) => (
            <div>
              <strong>{lugar.nombre}</strong><br />
              <span>{lugar.categoria}</span><br />
              <Link to={`/turista/lugares/${lugar.idLugar}`}>Ver detalle →</Link>
            </div>
          )}
        />
      </div>
    </div>
  );
}
