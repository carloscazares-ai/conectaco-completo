import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Clock, Phone, Mail, FileText, BadgeCheck, LogOut, Store } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useApi } from '../../lib/useApi.js';
import { useSesion } from '../../lib/sesion.jsx';
import { zonaDe } from '../../lib/formato.js';
import { Estado, Imagen } from '../../components/Piezas.jsx';
import { useToast } from '../../components/Toast.jsx';
import Modal from '../../components/Modal.jsx';

const VERIFICACION = {
  APROBADO: ['etiqueta-verde', 'Verificado'],
  PENDIENTE: ['etiqueta-gris', 'Verificación pendiente'],
  RECHAZADO: ['etiqueta-roja', 'Verificación rechazada'],
};

export default function Perfil() {
  const { sesion, cerrar, actualizarNombre } = useSesion();
  const avisar = useToast();
  const navigate = useNavigate();
  const perfil = useApi(() => api.get(`/negocios/${sesion.idNegocio}/perfil`), []);
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState(null);

  if (!perfil.datos) return <Estado cargando={perfil.cargando} error={perfil.error} onReintentar={perfil.recargar} />;
  const p = perfil.datos;
  const [claseVerificacion, textoVerificacion] = VERIFICACION[p.estadoVerificacion] ?? VERIFICACION.PENDIENTE;

  const guardar = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const nuevo = await api.put(`/negocios/${sesion.idNegocio}/perfil`, editando);
      perfil.setDatos(nuevo);
      actualizarNombre(nuevo.nombre);
      setEditando(null);
      avisar('Perfil actualizado');
    } catch (err) {
      setError(err.message);
    }
  };

  const filas = [
    [Clock, 'Horario', p.horario],
    [Phone, 'Teléfono', p.telefono],
    [Mail, 'Correo', p.email],
    [FileText, 'RFC', p.rfc],
  ];

  return (
    <div className="pagina" style={{ maxWidth: 820 }}>
      <div className="encabezado"><h1>Mi perfil</h1></div>

      <div className="tarjeta tarjeta-pad" style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
        <Imagen src={p.imagenUrl} alt={p.nombre} style={{ width: 104, height: 104, borderRadius: '50%', flex: 'none' }} />
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{p.nombre}</h2>
          <p className="texto-suave">{[p.categoria, zonaDe(p.direccion)].filter(Boolean).join(' · ') || 'Sin establecimiento registrado'}</p>
          <span className={`etiqueta ${claseVerificacion}`} style={{ marginTop: 8 }}><BadgeCheck size={14} /> {textoVerificacion}</span>
        </div>
        <button className="btn btn-secundario" onClick={() => {
          setError(null);
          setEditando({ nombre: p.nombre, rfc: p.rfc ?? '', telefono: p.telefono ?? '', horario: p.horario ?? '' });
        }}>
          <Pencil size={16} /> Editar perfil
        </button>
      </div>

      <div className="tarjeta lista">
        {filas.map(([Icono, titulo, valor]) => (
          <div key={titulo} className="fila">
            <div className="fila-icono"><Icono size={20} /></div>
            <div className="fila-texto">
              <strong>{titulo}</strong>
              <span className="texto-tenue">{valor || 'Sin capturar'}</span>
            </div>
          </div>
        ))}
        <Link to="/negocio/establecimiento" className="fila">
          <div className="fila-icono"><Store size={20} /></div>
          <div className="fila-texto">
            <strong>Mi establecimiento</strong>
            <span className="texto-tenue">{p.direccion || 'Registra la dirección de tu negocio'}</span>
          </div>
        </Link>
      </div>

      <button className="btn btn-peligro" style={{ width: 'fit-content' }} onClick={() => { cerrar(); navigate('/'); }}>
        <LogOut size={18} /> Cerrar sesión
      </button>

      {editando && (
        <Modal titulo="Editar perfil" onCerrar={() => setEditando(null)}>
          <form className="form" onSubmit={guardar}>
            {error && <div className="error-form">{error}</div>}
            <label className="campo">
              <span>Nombre del negocio</span>
              <input className="input" required maxLength={100} value={editando.nombre}
                     onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
            </label>
            <div className="form-fila">
              <label className="campo">
                <span>Teléfono</span>
                <input className="input" maxLength={45} value={editando.telefono}
                       onChange={(e) => setEditando({ ...editando, telefono: e.target.value })} />
              </label>
              <label className="campo">
                <span>RFC</span>
                <input className="input" maxLength={45} value={editando.rfc}
                       onChange={(e) => setEditando({ ...editando, rfc: e.target.value.toUpperCase() })} />
              </label>
            </div>
            <label className="campo">
              <span>Horario</span>
              <input className="input" maxLength={100} value={editando.horario} placeholder="Lun a Dom 9:00 - 20:00"
                     onChange={(e) => setEditando({ ...editando, horario: e.target.value })} />
            </label>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-suave" onClick={() => setEditando(null)}>Cancelar</button>
              <button className="btn btn-primario">Guardar</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
