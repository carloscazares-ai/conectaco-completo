// Grafica de visitas por dia, hecha con la libreria Recharts.
// datos = [{ fecha: '2026-10-01', valor: 5 }, ...]
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { diaYMes } from '../lib/formato.js';

export default function Grafica({ datos, alto }) {
  return (
    <ResponsiveContainer width="100%" height={alto}>
      <AreaChart data={datos}>
        <CartesianGrid vertical={false} stroke="#eadfd5" />
        <XAxis dataKey="fecha" tickFormatter={diaYMes} minTickGap={40} fontSize={12} />
        <YAxis allowDecimals={false} width={32} fontSize={12} />
        <Tooltip labelFormatter={diaYMes} formatter={(valor) => [valor, 'Visitas']} />
        <Area type="linear" dataKey="valor" stroke="#b4532a" strokeWidth={2} fill="#f7e3d6" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
