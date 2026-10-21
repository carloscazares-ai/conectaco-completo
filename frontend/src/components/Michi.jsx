// La mascota virtual (un gatito) dibujada en SVG, con el accesorio que tenga puesto.
export default function Michi({ accesorio, className = 'mascota-svg' }) {
  return (
    <svg className={className} viewBox="0 0 200 200" role="img" aria-label={`Mascota${accesorio ? ` con ${accesorio}` : ''}`}>
      <ellipse cx="100" cy="186" rx="58" ry="8" fill="#e6ddd5" />
      {/* cola */}
      <path d="M148 150 C178 140 180 104 160 96" stroke="#b9b2ad" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* cuerpo */}
      <ellipse cx="100" cy="148" rx="52" ry="38" fill="#c9c3be" />
      <ellipse cx="100" cy="156" rx="30" ry="24" fill="#e7e2de" />
      {/* orejas */}
      <path d="M50 74 L58 28 L88 58 Z" fill="#c9c3be" />
      <path d="M150 74 L142 28 L112 58 Z" fill="#c9c3be" />
      <path d="M58 64 L62 40 L78 56 Z" fill="#f0c9c0" />
      <path d="M142 64 L138 40 L122 56 Z" fill="#f0c9c0" />
      {/* cabeza */}
      <ellipse cx="100" cy="86" rx="56" ry="46" fill="#d3cdc8" />
      {/* ojos */}
      <ellipse cx="78" cy="84" rx="9" ry="11" fill="#2b211c" />
      <ellipse cx="122" cy="84" rx="9" ry="11" fill="#2b211c" />
      <circle cx="81" cy="80" r="3" fill="#fff" />
      <circle cx="125" cy="80" r="3" fill="#fff" />
      {/* nariz y boca */}
      <path d="M95 100 L105 100 L100 106 Z" fill="#d98f84" />
      <path d="M100 106 Q94 114 88 110 M100 106 Q106 114 112 110" stroke="#7d6f68" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* bigotes */}
      <path d="M62 100 L40 96 M62 106 L40 108 M138 100 L160 96 M138 106 L160 108" stroke="#8d847e" strokeWidth="2" strokeLinecap="round" />
      {/* patas */}
      <ellipse cx="80" cy="182" rx="14" ry="8" fill="#d3cdc8" />
      <ellipse cx="120" cy="182" rx="14" ry="8" fill="#d3cdc8" />
      <Accesorio nombre={accesorio} />
    </svg>
  );
}

function Accesorio({ nombre }) {
  switch (nombre) {
    case 'Gorra':
      return (
        <g>
          <path d="M56 56 Q100 8 144 56 Z" fill="#b4532a" />
          <path d="M136 52 Q170 52 176 62 Q150 66 132 60 Z" fill="#8f3f1e" />
          <circle cx="100" cy="24" r="5" fill="#8f3f1e" />
        </g>
      );
    case 'Lentes':
      return (
        <g>
          <circle cx="78" cy="84" r="16" fill="#2b211c" fillOpacity=".85" stroke="#2b211c" strokeWidth="3" />
          <circle cx="122" cy="84" r="16" fill="#2b211c" fillOpacity=".85" stroke="#2b211c" strokeWidth="3" />
          <path d="M94 84 L106 84" stroke="#2b211c" strokeWidth="4" />
          <path d="M70 78 L76 74" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'Moño':
      return (
        <g transform="translate(100 124)">
          <path d="M0 0 L-24 -12 L-24 12 Z" fill="#d9452b" />
          <path d="M0 0 L24 -12 L24 12 Z" fill="#d9452b" />
          <circle r="7" fill="#b4532a" />
        </g>
      );
    case 'Bufanda':
      return (
        <g>
          <path d="M52 118 Q100 140 148 118 L150 132 Q100 156 50 132 Z" fill="#b4532a" />
          <path d="M120 134 L128 172 L112 172 L108 138 Z" fill="#8f3f1e" />
          <path d="M60 124 L60 134 M80 130 L80 140 M100 132 L100 142 M120 130 L120 140 M140 124 L140 134" stroke="#f7e3d6" strokeWidth="3" />
        </g>
      );
    case 'Sombrero charro':
      return (
        <g>
          <ellipse cx="100" cy="52" rx="78" ry="14" fill="#2b211c" />
          <path d="M70 52 Q72 6 100 6 Q128 6 130 52 Z" fill="#2b211c" />
          <path d="M72 42 Q100 50 128 42" stroke="#e3a21a" strokeWidth="4" fill="none" />
          <ellipse cx="100" cy="52" rx="78" ry="14" fill="none" stroke="#e3a21a" strokeWidth="3" />
        </g>
      );
    default:
      return null;
  }
}

// Ícono chico de cada recompensa para la lista
export function IconoRecompensa({ nombre }) {
  const dibujos = {
    'Gorra': <g><path d="M8 30 Q32 2 56 30 Z" fill="#b4532a" /><path d="M50 28 Q62 28 64 34 Q54 36 46 32 Z" fill="#8f3f1e" /></g>,
    'Lentes': <g><circle cx="20" cy="32" r="12" fill="#2b211c" /><circle cx="44" cy="32" r="12" fill="#2b211c" /><path d="M30 32 L34 32" stroke="#2b211c" strokeWidth="4" /></g>,
    'Moño': <g><path d="M32 32 L10 20 L10 44 Z" fill="#d9452b" /><path d="M32 32 L54 20 L54 44 Z" fill="#d9452b" /><circle cx="32" cy="32" r="6" fill="#b4532a" /></g>,
    'Bufanda': <g><path d="M8 20 Q32 34 56 20 L56 30 Q32 44 8 30 Z" fill="#b4532a" /><path d="M40 34 L44 58 L34 58 L32 36 Z" fill="#8f3f1e" /></g>,
    'Sombrero charro': <g><ellipse cx="32" cy="40" rx="28" ry="7" fill="#2b211c" /><path d="M20 40 Q20 14 32 14 Q44 14 44 40 Z" fill="#2b211c" /><path d="M21 34 Q32 38 43 34" stroke="#e3a21a" strokeWidth="3" fill="none" /></g>,
  };
  return <svg viewBox="0 0 64 64" aria-hidden="true">{dibujos[nombre] ?? <circle cx="32" cy="32" r="18" fill="#b4532a" />}</svg>;
}
