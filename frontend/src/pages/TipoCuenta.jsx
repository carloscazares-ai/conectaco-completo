import { Link, useNavigate } from 'react-router-dom';
import { User, Store, ChevronRight, ArrowLeft } from 'lucide-react';
import { Logo } from '../components/Layout.jsx';

export default function TipoCuenta() {
  const navigate = useNavigate();
  const ir = (tipo) => navigate(`/registro?tipo=${tipo}`);

  return (
    <div className="publica">
      <header className="publica-barra">
        <Link to="/"><Logo /></Link>
      </header>
      <div className="centrado">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
          <Link to="/" className="texto-suave" style={{ alignSelf: 'flex-start', display: 'flex', gap: 6 }}><ArrowLeft size={18} /> Volver</Link>
          <h1 style={{ fontSize: 34, fontWeight: 800, textAlign: 'center' }}>¿Qué tipo de usuario eres?</h1>
          <div className="tipos">
            <button className="tipo" onClick={() => ir('Turista')}>
              <div className="stat-icono"><User /></div>
              <h2>Turista</h2>
              <p className="texto-suave">Explora CDMX, completa actividades y gana recompensas.</p>
              <span className="xp" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Continuar <ChevronRight size={16} /></span>
            </button>
            <button className="tipo" onClick={() => ir('Negocio')}>
              <div className="stat-icono"><Store /></div>
              <h2>Negocio</h2>
              <p className="texto-suave">Promociona tu establecimiento y conecta con más personas.</p>
              <span className="xp" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Continuar <ChevronRight size={16} /></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
