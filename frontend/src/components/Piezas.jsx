import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Camera, ListChecks, MapPin, Share2, Sparkles, ArrowUpRight, ArrowDownRight, Inbox } from 'lucide-react';

// Imagen con relleno gris (montaña y sol, como en los mockups) cuando no hay foto
export function Imagen({ src, alt = '', className = '', style }) {
  const [fallo, setFallo] = useState(false);
  return (
    <div className={`imagen ${className}`} style={style}>
      {src && !fallo ? (
        <img src={src} alt={alt} onError={() => setFallo(true)} />
      ) : (
        <div className="imagen-relleno" aria-hidden="true">
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
      <strong style={{ color: 'var(--tinta)' }}>{Number(valor ?? 0).toFixed(1)}</strong>
      {opiniones !== undefined && <span>({opiniones})</span>}
    </span>
  );
}

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

// Porcentaje contra el periodo anterior; null = no había datos antes
export function Cambio({ valor }) {
  if (valor === null || valor === undefined) {
    return <span className="etiqueta etiqueta-gris cambio">Nuevo</span>;
  }
  const sube = valor >= 0;
  const Icono = sube ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`etiqueta cambio ${sube ? 'etiqueta-verde' : 'etiqueta-roja'}`}>
      <Icono size={14} /> {Math.abs(valor)}%
    </span>
  );
}

export function LugarCard({ lugar }) {
  return (
    <Link to={`/turista/lugares/${lugar.idLugar}`} className="tarjeta lugar-card">
      <Imagen src={lugar.imagenUrl} alt={lugar.nombre} />
      <div className="lugar-card-cuerpo">
        <span className="etiqueta etiqueta-terracota" style={{ width: 'fit-content' }}>{lugar.categoria}</span>
        <h3>{lugar.nombre}</h3>
        <span className="texto-tenue"><MapPin size={13} style={{ verticalAlign: -2 }} /> {lugar.direccion}</span>
        <div className="lugar-card-meta">
          <Estrellas valor={lugar.calificacionPromedio} opiniones={lugar.opiniones} />
          {lugar.actividades > 0 && <span className="xp">{lugar.actividades} actividades</span>}
        </div>
      </div>
    </Link>
  );
}

const ICONOS_MISION = { FOTO: Camera, QUIZ: ListChecks, VISITA: MapPin, COMPARTIR: Share2 };

export function IconoMision({ tipo }) {
  const Icono = ICONOS_MISION[tipo] ?? Sparkles;
  return <div className="fila-icono"><Icono size={22} /></div>;
}

export const TIPOS_MISION = [
  { valor: 'FOTO', nombre: 'Tomar una foto' },
  { valor: 'QUIZ', nombre: 'Responder un quiz' },
  { valor: 'VISITA', nombre: 'Visitar / consumir' },
  { valor: 'COMPARTIR', nombre: 'Compartir experiencia' },
  { valor: 'OTRA', nombre: 'Otra' },
];

export function Vacio({ icono: Icono = Inbox, titulo, children }) {
  return (
    <div className="vacio">
      <Icono size={40} />
      <strong style={{ color: 'var(--tinta)' }}>{titulo}</strong>
      {children}
    </div>
  );
}

export function Estado({ cargando, error, onReintentar }) {
  if (cargando) return <div className="cargando">Cargando…</div>;
  if (error) {
    return (
      <div className="vacio">
        <strong style={{ color: 'var(--rojo)' }}>{error}</strong>
        {onReintentar && <button className="btn btn-secundario btn-chico" onClick={onReintentar}>Reintentar</button>}
      </div>
    );
  }
  return null;
}

// Calificación de 1 a 5 con estrellas que se pueden elegir
export function SelectorEstrellas({ valor, onCambiar }) {
  return (
    <div style={{ display: 'flex', gap: 4 }} role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={valor === n}
          aria-label={`${n} estrellas`}
          onClick={() => onCambiar(n)}
          style={{ border: 0, background: 'none', padding: 2, cursor: 'pointer' }}
        >
          <Star size={26} color="#e3a21a" fill={n <= valor ? '#e3a21a' : 'none'} />
        </button>
      ))}
    </div>
  );
}
