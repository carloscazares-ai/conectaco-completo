// Funciones para hablar con el backend de Spring Boot.
// Ejemplo: const lugares = await api.get('/lugares');
const BASE = '/v1';

async function pedir(ruta, metodo, datos) {
  const opciones = { method: metodo };

  // Si mandamos datos, van como JSON en el body (igual que en Postman)
  if (datos !== undefined) {
    opciones.headers = { 'Content-Type': 'application/json' };
    opciones.body = JSON.stringify(datos);
  }

  const respuesta = await fetch(BASE + ruta, opciones);
  const texto = await respuesta.text();

  let json = null;
  if (texto !== '') {
    json = JSON.parse(texto);
  }

  // Si el backend respondio con error (400, 404...), lanzamos su mensaje
  if (!respuesta.ok) {
    if (json !== null && json.error) {
      throw new Error(json.error);
    }
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  }
  return json;
}

export const api = {
  get: (ruta) => pedir(ruta, 'GET'),
  post: (ruta, datos) => pedir(ruta, 'POST', datos),
  put: (ruta, datos) => pedir(ruta, 'PUT', datos),
  del: (ruta) => pedir(ruta, 'DELETE'),
};
