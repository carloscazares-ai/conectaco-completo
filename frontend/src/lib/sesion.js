// La sesion es quien inicio sesion. Se guarda en el navegador con localStorage.
const CLAVE = 'sesion';

export function obtenerSesion() {
  const texto = localStorage.getItem(CLAVE);
  if (texto === null) {
    return null;
  }
  return JSON.parse(texto);
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion));
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE);
}

// A que pagina va cada tipo de usuario despues de entrar
export function rutaInicio(sesion) {
  if (sesion.tipoUsuario === 'Negocio') {
    return '/negocio';
  }
  return '/turista';
}
