// Aqui se define que pagina se muestra en cada URL
import { Navigate, Route, Routes } from 'react-router-dom';
import { obtenerSesion, rutaInicio } from './lib/sesion.js';
import Layout from './components/Layout.jsx';
import Inicio from './pages/Inicio.jsx';
import TipoCuenta from './pages/TipoCuenta.jsx';
import Registro from './pages/Registro.jsx';
import Login from './pages/Login.jsx';
import DashboardTurista from './pages/turista/Dashboard.jsx';
import Explorar from './pages/turista/Explorar.jsx';
import LugarDetalle from './pages/turista/LugarDetalle.jsx';
import ActividadesTurista from './pages/turista/Actividades.jsx';
import Mascota from './pages/turista/Mascota.jsx';
import Recuerdos from './pages/turista/Recuerdos.jsx';
import PerfilTurista from './pages/turista/Perfil.jsx';
import DashboardNegocio from './pages/negocio/Dashboard.jsx';
import Establecimiento from './pages/negocio/Establecimiento.jsx';
import ActividadesNegocio from './pages/negocio/Actividades.jsx';
import Promociones from './pages/negocio/Promociones.jsx';
import Estadisticas from './pages/negocio/Estadisticas.jsx';
import PerfilNegocio from './pages/negocio/Perfil.jsx';

// Solo deja entrar a quien inicio sesion y tiene el tipo de cuenta correcto
function Protegida({ tipo, children }) {
  const sesion = obtenerSesion();
  if (sesion === null) {
    return <Navigate to="/login" />;
  }
  if (sesion.tipoUsuario !== tipo) {
    return <Navigate to={rutaInicio(sesion)} />;
  }
  return children;
}

// Si ya inicio sesion, no tiene caso que vea el inicio o el login
function SoloPublica({ children }) {
  const sesion = obtenerSesion();
  if (sesion !== null) {
    return <Navigate to={rutaInicio(sesion)} />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SoloPublica><Inicio /></SoloPublica>} />
      <Route path="/tipo-de-cuenta" element={<SoloPublica><TipoCuenta /></SoloPublica>} />
      <Route path="/registro" element={<SoloPublica><Registro /></SoloPublica>} />
      <Route path="/login" element={<SoloPublica><Login /></SoloPublica>} />

      <Route path="/turista" element={<Protegida tipo="Turista"><Layout tipo="Turista" /></Protegida>}>
        <Route index element={<DashboardTurista />} />
        <Route path="explorar" element={<Explorar />} />
        <Route path="lugares/:idLugar" element={<LugarDetalle />} />
        <Route path="actividades" element={<ActividadesTurista />} />
        <Route path="mascota" element={<Mascota />} />
        <Route path="recuerdos" element={<Recuerdos />} />
        <Route path="perfil" element={<PerfilTurista />} />
      </Route>

      <Route path="/negocio" element={<Protegida tipo="Negocio"><Layout tipo="Negocio" /></Protegida>}>
        <Route index element={<DashboardNegocio />} />
        <Route path="establecimiento" element={<Establecimiento />} />
        <Route path="actividades" element={<ActividadesNegocio />} />
        <Route path="promociones" element={<Promociones />} />
        <Route path="estadisticas" element={<Estadisticas />} />
        <Route path="perfil" element={<PerfilNegocio />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
