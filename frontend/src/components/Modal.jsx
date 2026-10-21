import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ titulo, onCerrar, children }) {
  useEffect(() => {
    const alPresionar = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [onCerrar]);

  return (
    <div className="modal-fondo" onMouseDown={(e) => e.target === e.currentTarget && onCerrar()}>
      <div className="modal tarjeta" role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-titulo">
          <h2>{titulo}</h2>
          <button type="button" className="btn btn-icono" onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
