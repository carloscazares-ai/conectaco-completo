const fechaCorta = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
const diaMes = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' });

// Las fechas de la API vienen como "2026-10-21"; se leen como fecha local para no perder un día.
function aFecha(texto) {
  if (!texto) return null;
  const [anio, mes, dia] = texto.slice(0, 10).split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function fecha(texto) {
  const f = aFecha(texto);
  return f ? fechaCorta.format(f) : '';
}

export function diaYMes(texto) {
  const f = aFecha(texto);
  return f ? diaMes.format(f) : '';
}

export function numero(n) {
  return new Intl.NumberFormat('es-MX').format(n ?? 0);
}

export function hoyISO() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function zonaDe(direccion) {
  if (!direccion) return '';
  const partes = direccion.split(',').map((p) => p.trim());
  return partes.length >= 2 ? partes[partes.length - 2] : partes[0];
}
