import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Clock, Phone, Mail, FileText, Store } from 'lucide-react';
import { api } from '../../lib/api.js';
import { guardarSesion, obtenerSesion } from '../../lib/sesion.js';
import { Imagen } from '../../components/Piezas.jsx';
import Aviso from '../../components/Aviso.jsx';
import Modal from '../../components/Modal.jsx';

export default function Perfil() {
  const sesion = obtenerSesion();
  const ruta = '/negocios/' + sesion.idNegocio + '/perfil';

  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(null);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  async function cargar() {
    try {
      setPerfil(await api.get(ruta));
    } catch (e) {
      setAviso(e.message);
    }
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError('');
    try {
      const nuevo = await api.put(ruta, editando);
      setPerfil(nuevo);
      guardarSesion({ ...sesion, nombre: nuevo.nombre });
      setEditando(null);
      setAviso('Perfil actualizado');
    } catch (e) {
      setError(e.message);
    }
  }

  function cambiar(campo, valor) {
    setEditando({ ...editando, [campo]: valor });
  }

  if (perfil === null) return <p className="cargando">Cargando…</p>;

  return (
    <div className="pagina" style={{ maxWidth: 820 }}>
      <div className="encabezado"><h1>Mi perfil</h1></div>

      <div className="tarjeta tarjeta-pad" style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
        <Imagen src={perfil.imagenUrl} alt={perfil.nombre} style={{ width: 104, height: 104, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <h2>{perfil.nombre}</h2>
          <p className="texto-suave">{perfil.categoria}</p>
          <span className="etiqueta etiqueta-gris">Verificación: {perfil.estadoVerificacion}</span>
        </div>
        <button className="btn btn-secundario" onClick={() => setEditando(perfil)}><Pencil size={16} /> Editar perfil</button>
      </div>

      <div className="tarjeta lista">
        <div className="fila">
          <div className="fila-icono"><Clock size={20} /></div>
          <div className="fila-texto"><strong>Horario</strong><span className="texto-tenue">{perfil.horario}</span></div>
        </div>
        <div className="fila">
          <div className="fila-icono"><Phone size={20} /></div>
          <div className="fila-texto"><strong>Teléfono</strong><span className="texto-tenue">{perfil.telefono}</span></div>
        </div>
        <div className="fila">
          <div className="fila-icono"><Mail size={20} /></div>
          <div className="fila-texto"><strong>Correo</strong><span className="texto-tenue">{perfil.email}</span></div>
        </div>
        <div className="fila">
          <div className="fila-icono"><FileText size={20} /></div>
          <div className="fila-texto"><strong>RFC</strong><span className="texto-tenue">{perfil.rfc}</span></div>
        </div>
        <Link to="/negocio/establecimiento" className="fila">
          <div className="fila-icono"><Store size={20} /></div>
          <div className="fila-texto"><strong>Mi establecimiento</strong><span className="texto-tenue">{perfil.direccion}</span></div>
        </Link>
      </div>

      {editando !== null && (
        <Modal titulo="Editar perfil" onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error !== '' && <div className="error-form">{error}</div>}

            <label className="campo">
              <span>Nombre del negocio</span>
              <input className="input" required value={editando.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />
            </label>
            <label className="campo">
              <span>Teléfono</span>
              <input className="input" value={editando.telefono || ''} onChange={(e) => cambiar('telefono', e.target.value)} />
            </label>
            <label className="campo">
              <span>RFC</span>
              <input className="input" value={editando.rfc || ''} onChange={(e) => cambiar('rfc', e.target.value)} />
            </label>
            <label className="campo">
              <span>Horario</span>
              <input className="input" value={editando.horario || ''} onChange={(e) => cambiar('horario', e.target.value)} />
            </label>
            <button className="btn btn-primario">Guardar</button>
          </form>
        </Modal>
      )}
      <Aviso texto={aviso} onCerrar={() => setAviso('')} />
    </div>
  );
}
