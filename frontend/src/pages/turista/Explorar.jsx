import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Bookmark } from 'lucide-react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { Estrellas, Imagen, Vacio } from '../../components/Piezas.jsx';
import Mapa from '../../components/Mapa.jsx';

export default function Explorar() {
  const sesion = obtenerSesion();
  const [parametros] = useSearchParams();

  const [lugares, setLugares] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [texto, setTexto] = useState(parametros.get('q') || '');
  const [categoria, setCategoria] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);

  // Las categorias se cargan una vez, al abrir la pagina
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Los lugares se vuelven a pedir cada vez que cambia el texto o la categoria
  useEffect(() => {
    cargarLugares();
  }, [texto, categoria]);

  async function cargarCategorias() {
    try {
      setCategorias(await api.get('/categorias'));
    } catch (e) {
      setError(e.message);
    }
  }

  async function cargarLugares() {
    try {
      setLugares(await api.get('/lugares?idTurista=' + sesion.idTurista + '&q=' + texto + '&categoria=' + categoria));
    } catch (e) {
      setError(e.message);
    }
  }

  if (error !== '') return <p className="error-form">{error}</p>;

  return (
    <div className="pagina" style={{ maxWidth: 1400 }}>
      <div className="encabezado">
        <div>
          <h1>Explorar</h1>
          <p>Encuentra lugares en el mapa y filtra por lo que te gusta.</p>
        </div>
        <div className="input-icono" style={{ width: 420 }}>
          <Search size={18} />
          <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar en esta zona…" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className={categoria === '' ? 'chip activo' : 'chip'} onClick={() => setCategoria('')}>Todos</button>
        {categorias.map((c) => (
          <button key={c.idCategoria} className={categoria === c.idCategoria ? 'chip activo' : 'chip'}
                  onClick={() => setCategoria(c.idCategoria)}>{c.nombre}</button>
        ))}
      </div>

      <div className="explorar">
        <div className="explorar-lista">
          {lugares.length === 0 && <Vacio titulo="No encontramos lugares">Prueba con otra búsqueda o categoría.</Vacio>}

          {lugares.map((lugar) => (
            <div key={lugar.idLugar} onClick={() => setSeleccionado(lugar.idLugar)}
                 className={seleccionado === lugar.idLugar ? 'tarjeta lugar-mini seleccionado' : 'tarjeta lugar-mini'}>
              <Imagen src={lugar.imagenUrl} alt={lugar.nombre} />
              <div style={{ flex: 1 }}>
                <h3>
                  {lugar.nombre} {lugar.favorito && <Bookmark size={15} color="#b4532a" fill="#b4532a" />}
                </h3>
                <span className="texto-tenue">{lugar.categoria} · {lugar.direccion}</span>
                <div className="lugar-card-meta">
                  <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
                  <Link to={'/turista/lugares/' + lugar.idLugar} className="xp">Ver detalle</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Mapa lugares={lugares} seleccionado={seleccionado} onSeleccionar={setSeleccionado} conEnlace />
      </div>
    </div>
  );
}
