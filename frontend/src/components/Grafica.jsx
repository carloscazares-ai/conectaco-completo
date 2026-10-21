import { useState } from 'react';
import { diaYMes } from '../lib/formato.js';

// Gráfica de línea para las visitas por día. datos = [{ fecha: '2026-10-01', valor: 5 }, ...]
export default function Grafica({ datos = [], alto = 220 }) {
  const [activo, setActivo] = useState(null);
  const ancho = 720;
  const margen = { arriba: 16, derecha: 12, abajo: 28, izquierda: 32 };
  const w = ancho - margen.izquierda - margen.derecha;
  const h = alto - margen.arriba - margen.abajo;

  if (datos.length === 0) return null;
  const maximo = Math.max(4, ...datos.map((d) => d.valor));
  const tope = Math.ceil(maximo / 4) * 4;
  const x = (i) => margen.izquierda + (datos.length === 1 ? w / 2 : (i * w) / (datos.length - 1));
  const y = (v) => margen.arriba + h - (v / tope) * h;

  const linea = datos.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.valor)}`).join(' ');
  const area = `${linea} L${x(datos.length - 1)},${margen.arriba + h} L${x(0)},${margen.arriba + h} Z`;
  const marcas = [0, 1, 2, 3, 4].map((k) => (tope / 4) * k);
  const cadaCuanto = Math.max(1, Math.ceil(datos.length / 6));

  return (
    <svg className="grafica" viewBox={`0 0 ${ancho} ${alto}`} role="img" aria-label="Visitas por día"
         onMouseLeave={() => setActivo(null)}>
      <defs>
        <linearGradient id="relleno" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#b4532a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#b4532a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {marcas.map((m) => (
        <g key={m}>
          <line x1={margen.izquierda} x2={ancho - margen.derecha} y1={y(m)} y2={y(m)} stroke="#eadfd5" />
          <text x={margen.izquierda - 8} y={y(m) + 4} textAnchor="end">{m}</text>
        </g>
      ))}
      {datos.map((d, i) => i % cadaCuanto === 0 && (
        <text key={d.fecha} x={x(i)} y={alto - 8} textAnchor="middle">{diaYMes(d.fecha)}</text>
      ))}
      <path d={area} fill="url(#relleno)" />
      <path d={linea} fill="none" stroke="#b4532a" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {datos.map((d, i) => (
        <rect key={d.fecha} x={x(i) - w / datos.length / 2} y={margen.arriba} width={w / datos.length} height={h}
              fill="transparent" onMouseEnter={() => setActivo(i)} />
      ))}
      {activo !== null && (
        <g pointerEvents="none">
          <line x1={x(activo)} x2={x(activo)} y1={margen.arriba} y2={margen.arriba + h} stroke="#b4532a" strokeDasharray="3 3" />
          <circle cx={x(activo)} cy={y(datos[activo].valor)} r="5" fill="#b4532a" stroke="#fff" strokeWidth="2" />
          <g transform={`translate(${Math.min(Math.max(x(activo), 70), ancho - 70)}, ${margen.arriba + 4})`}>
            <rect x="-62" y="0" width="124" height="38" rx="8" fill="#2b211c" />
            <text x="0" y="16" textAnchor="middle" style={{ fill: '#fff', fontWeight: 700 }}>
              {datos[activo].valor} visitas
            </text>
            <text x="0" y="30" textAnchor="middle" style={{ fill: '#d9cfc8' }}>{diaYMes(datos[activo].fecha)}</text>
          </g>
        </g>
      )}
    </svg>
  );
}
