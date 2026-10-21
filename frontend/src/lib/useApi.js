import { useCallback, useEffect, useState } from 'react';

// Carga datos de la API: const { datos, error, cargando, recargar } = useApi(() => api.get('/x'), [dep])
export function useApi(funcion, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, error: null, cargando: true });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cargar = useCallback(funcion, dependencias);

  const recargar = useCallback(async () => {
    setEstado((e) => ({ ...e, cargando: true, error: null }));
    try {
      const datos = await cargar();
      setEstado({ datos, error: null, cargando: false });
    } catch (error) {
      setEstado({ datos: null, error: error.message, cargando: false });
    }
  }, [cargar]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { ...estado, recargar, setDatos: (datos) => setEstado((e) => ({ ...e, datos })) };
}
