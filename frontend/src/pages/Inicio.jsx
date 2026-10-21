import { Link } from 'react-router-dom';
import { Compass, Trophy, Cat, Store, BarChart3, Tag } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';
import Ciudad from '../components/Ciudad.jsx';
import Michi from '../components/Michi.jsx';

export default function Inicio() {
  return (
    <div className="publica">
      <header className="publica-barra">
        <Logo />
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-suave">Iniciar sesión</Link>
          <Link to="/tipo-de-cuenta" className="btn btn-primario">Crear cuenta</Link>
        </div>
      </header>

      <section className="hero">
        <div>
          <h1>Explora <span>CDMX</span>.<br />Vive experiencias y crea recuerdos.</h1>
          <p>
            Descubre lugares, completa actividades, gana recompensas para tu mascota virtual
            y guarda los mejores momentos de tu viaje.
          </p>
          <div className="hero-botones">
            <Link to="/registro?tipo=Turista" className="btn btn-primario">Crear cuenta</Link>
            <Link to="/login" className="btn btn-secundario">Iniciar sesión</Link>
          </div>
        </div>
        <div className="hero-arte">
          <div style={{ position: 'absolute', left: '50%', top: '8%', width: '42%', transform: 'translateX(-50%)' }}>
            <Michi accesorio="Sombrero charro" className="michi-hero" />
          </div>
          <Ciudad />
        </div>
      </section>

      <section className="ventajas">
        <div className="tarjeta ventaja">
          <div className="stat-icono"><Compass /></div>
          <h3>Explora con el mapa</h3>
          <p className="texto-suave">Museos, cafés, música y parques de la ciudad, filtrados por lo que te gusta.</p>
        </div>
        <div className="tarjeta ventaja">
          <div className="stat-icono"><Trophy /></div>
          <h3>Gana experiencia</h3>
          <p className="texto-suave">Cada actividad que completas te da XP y te ayuda a subir de nivel.</p>
        </div>
        <div className="tarjeta ventaja">
          <div className="stat-icono"><Cat /></div>
          <h3>Cuida a tu mascota</h3>
          <p className="texto-suave">Canjea recompensas y personaliza a tu michi con gorras, lentes y más.</p>
        </div>
      </section>

      <section className="tarjeta franja-negocio">
        <div>
          <span className="etiqueta etiqueta-terracota"><Store size={14} /> Para negocios</span>
          <h2 style={{ marginTop: 12 }}>Tu negocio también conecta.</h2>
          <p className="texto-suave" style={{ marginTop: 10 }}>
            Promociona tu establecimiento, crea actividades y llega a más personas en CDMX.
          </p>
          <div className="hero-botones">
            <Link to="/registro?tipo=Negocio" className="btn btn-primario">Registrar mi negocio</Link>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="fila tarjeta"><div className="fila-icono"><Tag /></div><div className="fila-texto"><strong>Promociones</strong><span className="texto-tenue">Atrae visitantes con ofertas</span></div></div>
          <div className="fila tarjeta"><div className="fila-icono"><BarChart3 /></div><div className="fila-texto"><strong>Estadísticas</strong><span className="texto-tenue">Visitas, actividades y seguidores</span></div></div>
        </div>
      </section>
    </div>
  );
}
