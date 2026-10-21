import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home, Compass, ClipboardCheck, Cat, Images, User, Store, ClipboardList, Tag, BarChart3, LogOut,
} from 'lucide-react';
import { useSesion } from '../lib/sesion.jsx';

const MENU_TURISTA = [
  { a: '/turista', texto: 'Inicio', icono: Home, exacto: true },
  { a: '/turista/explorar', texto: 'Explorar', icono: Compass },
  { a: '/turista/actividades', texto: 'Actividades', icono: ClipboardCheck },
  { a: '/turista/mascota', texto: 'Mascota', icono: Cat },
  { a: '/turista/recuerdos', texto: 'Recuerdos', icono: Images },
  { a: '/turista/perfil', texto: 'Perfil', icono: User },
];

const MENU_NEGOCIO = [
  { a: '/negocio', texto: 'Inicio', icono: Home, exacto: true },
  { a: '/negocio/establecimiento', texto: 'Mi establecimiento', icono: Store },
  { a: '/negocio/actividades', texto: 'Actividades', icono: ClipboardList },
  { a: '/negocio/promociones', texto: 'Promociones', icono: Tag },
  { a: '/negocio/estadisticas', texto: 'Estadísticas', icono: BarChart3 },
  { a: '/negocio/perfil', texto: 'Perfil', icono: User },
];

export function Logo() {
  return <div className="logo">conec<span>Taco</span></div>;
}

export function Iniciales({ nombre, grande }) {
  const iniciales = (nombre ?? '?').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  return <div className={`avatar ${grande ? 'avatar-grande' : ''}`} aria-hidden="true">{iniciales}</div>;
}

// Menú lateral (la barra de abajo del celular, adaptada a computadora) + la página actual
export default function Layout({ tipo }) {
  const { sesion, cerrar } = useSesion();
  const navigate = useNavigate();
  const menu = tipo === 'Negocio' ? MENU_NEGOCIO : MENU_TURISTA;

  const salir = () => {
    cerrar();
    navigate('/');
  };

  return (
    <div className="app">
      <nav className="menu" aria-label="Menú principal">
        <Logo />
        <div className="menu-tipo">{tipo === 'Negocio' ? 'Negocio' : 'Turista'}</div>
        {menu.map(({ a, texto, icono: Icono, exacto }) => (
          <NavLink key={a} to={a} end={exacto}>
            <Icono size={20} /> {texto}
          </NavLink>
        ))}
        <div className="menu-pie">
          <div className="usuario-mini">
            <Iniciales nombre={sesion?.nombre} />
            <div>
              <strong>{sesion?.nombre}</strong>
              <small>{sesion?.email}</small>
            </div>
          </div>
          <button className="btn btn-suave btn-bloque" onClick={salir}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="contenido">
        <Outlet />
      </main>
    </div>
  );
}
