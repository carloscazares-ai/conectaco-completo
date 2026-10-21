import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

// Avisos que aparecen abajo a la derecha: const avisar = useToast(); avisar('Listo')
const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  const avisar = useCallback((mensaje, tipo = 'ok') => {
    const id = Math.random();
    setAvisos((a) => [...a, { id, mensaje, tipo }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={avisar}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {avisos.map((a) => (
          <div key={a.id} className={`toast ${a.tipo === 'error' ? 'error' : ''}`}>
            {a.tipo === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {a.mensaje}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
