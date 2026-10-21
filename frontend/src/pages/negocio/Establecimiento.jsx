import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { Estado, Imagen } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Mapa, { CENTRO_CDMX } from '../../components/Mapa.jsx';

const VACIO = {
  nombre: '', idCategoria: '', direccion: '', descripcion: '', horario: '', costo: '',
  imagenUrl: '', latitud: CENTRO_CDMX[0], longitud: CENTRO_CDMX[1],
};

export default function Establecimiento() {
  const { sesion } = useSesion();
  const avisar = useToast();
  const lugar = useApi(() => api.get(`/negocios/${sesion.idNegocio}/lugar`), []);
  const categorias = useApi(() => api.get('/categorias'), []);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (lugar.cargando || lugar.error) return;
    const l = lugar.datos;
    setForm(l ? {
      nombre: l.nombre, idCategoria: String(l.idCategoria), direccion: l.direccion, descripcion: l.descripcion,
      horario: l.horario, costo: l.costo, imagenUrl: l.imagenUrl ?? '', latitud: l.latitud, longitud: l.longitud,
    } : { ...VACIO, nombre: sesion.nombre });
  }, [lugar.datos, lugar.cargando, lugar.error, sesion.nombre]);

  if (!form) return <Estado cargando={lugar.cargando} error={lugar.error} onReintentar={lugar.recargar} />;
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const guardado = await api.put(`/negocios/${sesion.idNegocio}/lugar`, {
        ...form,
        idCategoria: Number(form.idCategoria),
        latitud: Number(form.latitud),
        longitud: Number(form.longitud),
        imagenUrl: form.imagenUrl || null,
      });
      lugar.setDatos(guardado);
      avisar(lugar.datos ? 'Cambios guardados' : '¡Tu establecimiento ya aparece en el mapa!');
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

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
          {error && <div className="error-form">{error}</div>}
          <Imagen src={form.imagenUrl} alt="Foto del establecimiento" style={{ height: 220 }} />
          <label className="campo">
            <span>URL de la foto</span>
            <input className="input" type="url" value={form.imagenUrl} onChange={cambiar('imagenUrl')} placeholder="https://…" />
          </label>
          <div className="form-fila">
            <label className="campo">
              <span>Nombre</span>
              <input className="input" required maxLength={100} value={form.nombre} onChange={cambiar('nombre')} />
            </label>
            <label className="campo">
              <span>Categoría</span>
              <select className="select" required value={form.idCategoria} onChange={cambiar('idCategoria')}>
                <option value="" disabled>Elige una categoría</option>
                {(categorias.datos ?? []).map((c) => <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>)}
              </select>
            </label>
          </div>
          <label className="campo">
            <span>Dirección</span>
            <input className="input" required maxLength={150} value={form.direccion} onChange={cambiar('direccion')} placeholder="Calle 123, Colonia, CDMX" />
          </label>
          <label className="campo">
            <span>Descripción</span>
            <textarea className="textarea" maxLength={500} value={form.descripcion} onChange={cambiar('descripcion')}
                      placeholder="Cuéntales a los turistas qué hace especial a tu lugar" />
          </label>
          <div className="form-fila">
            <label className="campo">
              <span>Horario</span>
              <input className="input" maxLength={100} value={form.horario} onChange={cambiar('horario')} placeholder="Lun a Dom 9:00 - 20:00" />
            </label>
            <label className="campo">
              <span>Costo</span>
              <input className="input" maxLength={45} value={form.costo} onChange={cambiar('costo')} placeholder="$$ o $150" />
            </label>
          </div>
          <button className="btn btn-primario" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>

        <aside className="tarjeta tarjeta-pad" style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'sticky', top: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800 }}><MapPin size={18} style={{ verticalAlign: -3 }} /> Ubicación en el mapa</h2>
          <p className="texto-suave">Haz clic en el mapa para mover el pin a donde está tu negocio.</p>
          <Mapa
            lugares={[{ idLugar: 0, nombre: form.nombre, latitud: Number(form.latitud), longitud: Number(form.longitud) }]}
            seleccionado={0}
            centro={[Number(form.latitud), Number(form.longitud)]}
            zoom={14}
            alto={340}
            onClicMapa={(p) => setForm({ ...form, latitud: Number(p.lat.toFixed(6)), longitud: Number(p.lng.toFixed(6)) })}
          />
          <div className="form-fila">
            <label className="campo">
              <span>Latitud</span>
              <input className="input" type="number" step="any" value={form.latitud} onChange={cambiar('latitud')} />
            </label>
            <label className="campo">
              <span>Longitud</span>
              <input className="input" type="number" step="any" value={form.longitud} onChange={cambiar('longitud')} />
            </label>
          </div>
        </aside>
      </form>
    </div>
  );
}
