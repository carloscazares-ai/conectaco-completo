import { createContext, useContext, useState } from 'react';

// Guarda quién inició sesión (lo que regresa /v1/auth/login) en el navegador.
const CLAVE = 'conectaco.sesion';
const SesionContext = createContext(null);

function leerSesion() {
  try {
    const guardada = localStorage.getItem(CLAVE);
    return guardada ? JSON.parse(guardada) : null;
  } catch {
    return null;
  }
}

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  const iniciar = (datos) => {
    setSesion(datos);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(datos));
    } catch {
      // Sin almacenamiento la sesión dura mientras la pestaña esté abierta
    }
  };

  const actualizarNombre = (nombre) => iniciar({ ...sesion, nombre });

  const cerrar = () => {
    setSesion(null);
    try {
      localStorage.removeItem(CLAVE);
    } catch {
      // Nada que limpiar
    }
  };

  return (
    <SesionContext.Provider value={{ sesion, iniciar, cerrar, actualizarNombre }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}

export function rutaInicio(sesion) {
  return sesion?.tipoUsuario === 'Negocio' ? '/negocio' : '/turista';
}
