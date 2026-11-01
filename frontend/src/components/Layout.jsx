// El menu lateral. <Outlet /> es el lugar donde se muestra la pagina actual.
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Compass, ClipboardCheck, Cat, Images, User, Store, ClipboardList, Tag, BarChart3, LogOut } from 'lucide-react';
import { cerrarSesion, obtenerSesion } from '../lib/sesion.js';

const MENU_TURISTA = [
  { ruta: '/turista', texto: 'Inicio', icono: Home },
  { ruta: '/turista/explorar', texto: 'Explorar', icono: Compass },
  { ruta: '/turista/actividades', texto: 'Actividades', icono: ClipboardCheck },
  { ruta: '/turista/mascota', texto: 'Mascota', icono: Cat },
  { ruta: '/turista/recuerdos', texto: 'Recuerdos', icono: Images },
  { ruta: '/turista/perfil', texto: 'Perfil', icono: User },
];

const MENU_NEGOCIO = [
  { ruta: '/negocio', texto: 'Inicio', icono: Home },
  { ruta: '/negocio/establecimiento', texto: 'Mi establecimiento', icono: Store },
  { ruta: '/negocio/actividades', texto: 'Actividades', icono: ClipboardList },
  { ruta: '/negocio/promociones', texto: 'Promociones', icono: Tag },
  { ruta: '/negocio/estadisticas', texto: 'Estadísticas', icono: BarChart3 },
  { ruta: '/negocio/perfil', texto: 'Perfil', icono: User },
];

export function Logo() {
  return <div className="logo">conec<span>Taco</span></div>;
}

// Circulo con la primera letra del nombre
export function Iniciales({ nombre, grande }) {
  return <div className={grande ? 'avatar avatar-grande' : 'avatar'}>{nombre[0].toUpperCase()}</div>;
}

export default function Layout({ tipo }) {
  const sesion = obtenerSesion();
  const navigate = useNavigate();
  const menu = tipo === 'Negocio' ? MENU_NEGOCIO : MENU_TURISTA;

  function salir() {
    cerrarSesion();
    navigate('/');
  }

  return (
    <div className="app">
      <nav className="menu">
        <Logo />
        <div className="menu-tipo">{tipo}</div>

        {menu.map((opcion) => (
          <NavLink key={opcion.ruta} to={opcion.ruta} end={opcion.texto === 'Inicio'}>
            <opcion.icono size={20} /> {opcion.texto}
          </NavLink>
        ))}

        <div className="menu-pie">
          <div className="usuario-mini">
            <Iniciales nombre={sesion.nombre} />
            <div>
              <strong>{sesion.nombre}</strong>
              <small>{sesion.email}</small>
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
