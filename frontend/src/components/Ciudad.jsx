// Silueta de la CDMX con el Ángel de la Independencia (para la portada)
export default function Ciudad() {
  return (
    <svg viewBox="0 0 600 300" aria-hidden="true">
      <g fill="#dcc3b0">
        <rect x="0" y="190" width="60" height="110" />
        <rect x="70" y="150" width="46" height="150" />
        <rect x="124" y="210" width="40" height="90" />
        <rect x="170" y="120" width="54" height="180" />
        <rect x="372" y="140" width="52" height="160" />
        <rect x="432" y="96" width="44" height="204" />
        <rect x="484" y="180" width="56" height="120" />
        <rect x="546" y="160" width="54" height="140" />
      </g>
      <g fill="#c9a993">
        <rect x="236" y="176" width="34" height="124" />
        <rect x="330" y="168" width="34" height="132" />
        {/* Ángel */}
        <rect x="282" y="250" width="36" height="50" />
        <rect x="290" y="110" width="20" height="142" />
        <rect x="286" y="104" width="28" height="8" />
        <path d="M300 60 L294 104 L306 104 Z" />
        <circle cx="300" cy="56" r="7" />
        <path d="M300 64 Q276 54 268 74 Q286 70 298 76 Z" />
        <path d="M300 64 Q324 54 332 74 Q314 70 302 76 Z" />
      </g>
      <g fill="#f6e7da" opacity=".8">
        {[180, 196, 212, 228].map((yy) => [180, 196, 210].map((xx) => <rect key={`${xx}-${yy}`} x={xx} y={yy} width="8" height="8" />))}
        {[150, 170, 190, 210].map((yy) => [440, 456].map((xx) => <rect key={`${xx}-${yy}`} x={xx} y={yy} width="8" height="8" />))}
      </g>
    </svg>
  );
}
