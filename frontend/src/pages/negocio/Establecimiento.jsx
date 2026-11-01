import { useEffect, useState } from 'react';
import { api } from '../../lib/api.js';
import { obtenerSesion } from '../../lib/sesion.js';
import { Imagen } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import Mapa, { CENTRO_CDMX } from '../../components/Mapa.jsx';

export default function Establecimiento() {
  const sesion = obtenerSesion();
  const ruta = '/negocios/' + sesion.idNegocio + '/lugar';

  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [aviso, setAviso] = useState('');

  // Un solo objeto con todos los campos del formulario
  const [form, setForm] = useState({
    nombre: sesion.nombre, idCategoria: '', direccion: '', descripcion: '', horario: '', costo: '',
    imagenUrl: '', latitud: CENTRO_CDMX[0], longitud: CENTRO_CDMX[1],
  });

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setCategorias(await api.get('/categorias'));

      // Si ya tiene establecimiento, llenamos el formulario con sus datos
      const lugar = await api.get(ruta);
      if (lugar !== null) {
        setForm({ ...lugar, imagenUrl: lugar.imagenUrl || '' });
      }
    } catch (e) {
      setError(e.message);
    }
  }

  // Copia el form y cambia solo un campo
  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  function alHacerClicEnMapa(punto) {
    setForm({ ...form, latitud: punto.lat, longitud: punto.lng });
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    try {
      await api.put(ruta, { ...form, idCategoria: Number(form.idCategoria) });
      setAviso('Cambios guardados');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="pagina">
      <div className="encabezado">
        <div>
          <h1>Mi establecimiento</h1>
          <p>Estos datos son los que ven los turistas en el mapa y en el detalle de tu lugar.</p>
        </div>
      </div>

      <form className="dos-columnas" onSubmit={guardar}>
        <div className="tarjeta tarjeta-pad form">
          {error !== '' && <div className="error-form">{error}</div>}

          <Imagen src={form.imagenUrl} alt="Foto del establecimiento" style={{ height: 220 }} />
          <label className="campo">
            <span>URL de la foto</span>
            <input className="input" type="url" value={form.imagenUrl} onChange={(e) => cambiar('imagenUrl', e.target.value)} />
          </label>
          <div className="form-fila">
            <label className="campo">
              <span>Nombre</span>
              <input className="input" required value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </label>
            <label className="campo">
              <span>Categoría</span>
              <select className="select" required value={form.idCategoria} onChange={(e) => cambiar('idCategoria', e.target.value)}>
                <option value="">Elige una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombre}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="campo">
            <span>Dirección</span>
            <input className="input" required value={form.direccion} onChange={(e) => cambiar('direccion', e.target.value)} />
          </label>
          <label className="campo">
            <span>Descripción</span>
            <textarea className="textarea" value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />
          </label>
          <div className="form-fila">
            <label className="campo">
              <span>Horario</span>
              <input className="input" value={form.horario} onChange={(e) => cambiar('horario', e.target.value)} />
            </label>
            <label className="campo">
              <span>Costo</span>
              <input className="input" value={form.costo} onChange={(e) => cambiar('costo', e.target.value)} />
            </label>
          </div>
          <button className="btn btn-primario">Guardar cambios</button>
        </div>

        <aside className="tarjeta tarjeta-pad form">
          <h2>Ubicación en el mapa</h2>
          <p className="texto-suave">Haz clic en el mapa para mover el pin a donde está tu negocio.</p>
          <Mapa
            lugares={[{ idLugar: 0, nombre: form.nombre, latitud: form.latitud, longitud: form.longitud }]}
            seleccionado={0}
            centro={[form.latitud, form.longitud]}
            zoom={14}
            alto={340}
            onClicMapa={alHacerClicEnMapa}
          />
          <span className="texto-tenue">Latitud {form.latitud} · Longitud {form.longitud}</span>
        </aside>
      </form>

      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
