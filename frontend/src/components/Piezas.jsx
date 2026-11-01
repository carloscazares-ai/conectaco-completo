// Piezas chicas que se repiten en varias paginas
import { Link } from 'react-router-dom';
import { Star, Camera, ListChecks, MapPin, Share2, Sparkles, ArrowUpRight, ArrowDownRight, Inbox } from 'lucide-react';

// Muestra una foto. Si no hay foto, muestra el dibujo gris de los mockups.
export function Imagen({ src, alt, className, style }) {
  return (
    <div className={'imagen ' + (className || '')} style={style}>
      {src ? (
        <img src={src} alt={alt} />
      ) : (
        <div className="imagen-relleno">
          <svg viewBox="0 0 120 80">
            <circle cx="88" cy="22" r="11" fill="#cfc7bf" />
            <path d="M6 74 L44 30 L66 54 L80 40 L114 74 Z" fill="#cfc7bf" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function Estrellas({ valor, opiniones }) {
  return (
    <span className="estrellas">
      <Star size={15} />
      <strong style={{ color: 'var(--tinta)' }}>{valor.toFixed(1)}</strong>
      {opiniones !== undefined && <span>({opiniones})</span>}
    </span>
  );
}

// Tarjeta con un numero grande, por ejemplo "950 XP"
export function Stat({ icono: Icono, valor, etiqueta, cambio }) {
  return (
    <div className="tarjeta stat">
      <div className="stat-icono"><Icono size={24} /></div>
      <div>
        <strong>{valor}</strong>
        <small>{etiqueta}</small>
      </div>
      {cambio !== undefined && <Cambio valor={cambio} />}
    </div>
  );
}

// Porcentaje contra el periodo anterior. null = antes no habia datos.
function Cambio({ valor }) {
  if (valor === null) {
    return <span className="etiqueta etiqueta-gris cambio">Nuevo</span>;
  }
  if (valor >= 0) {
    return <span className="etiqueta etiqueta-verde cambio"><ArrowUpRight size={14} /> {valor}%</span>;
  }
  return <span className="etiqueta etiqueta-roja cambio"><ArrowDownRight size={14} /> {-valor}%</span>;
}

export function LugarCard({ lugar }) {
  return (
    <Link to={'/turista/lugares/' + lugar.idLugar} className="tarjeta lugar-card">
      <Imagen src={lugar.imagenUrl} alt={lugar.nombre} />
      <div className="lugar-card-cuerpo">
        <span className="etiqueta etiqueta-terracota">{lugar.categoria}</span>
        <h3>{lugar.nombre}</h3>
        <span className="texto-tenue"><MapPin size={13} /> {lugar.direccion}</span>
        <div className="lugar-card-meta">
          <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
          {lugar.actividades > 0 && <span className="xp">{lugar.actividades} actividades</span>}
        </div>
      </div>
    </Link>
  );
}

// El icono depende del tipo de actividad
export function IconoMision({ tipo }) {
  let Icono = Sparkles;
  if (tipo === 'FOTO') Icono = Camera;
  if (tipo === 'QUIZ') Icono = ListChecks;
  if (tipo === 'VISITA') Icono = MapPin;
  if (tipo === 'COMPARTIR') Icono = Share2;

  return <div className="fila-icono"><Icono size={22} /></div>;
}

// Se muestra cuando una lista esta vacia
export function Vacio({ titulo, children }) {
  return (
    <div className="vacio">
      <Inbox size={40} />
      <strong style={{ color: 'var(--tinta)' }}>{titulo}</strong>
      {children}
    </div>
  );
}
