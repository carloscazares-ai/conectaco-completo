// Cliente para la API de Spring Boot. En desarrollo, Vite manda /v1 al puerto 8080.
const BASE = '/v1';

async function request(ruta, { method = 'GET', body } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(BASE + ruta, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  }

  if (respuesta.status === 204) return null;
  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = null;
    }
  }
  if (!respuesta.ok) {
    throw new Error(datos?.error || `Error ${respuesta.status} del servidor`);
  }
  return datos;
}

export const api = {
  get: (ruta) => request(ruta),
  post: (ruta, body) => request(ruta, { method: 'POST', body: body ?? {} }),
  put: (ruta, body) => request(ruta, { method: 'PUT', body }),
  del: (ruta) => request(ruta, { method: 'DELETE' }),
};
