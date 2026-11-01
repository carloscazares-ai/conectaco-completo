import { X } from 'lucide-react';

// Ventana que aparece encima de la pagina. Lo que se pone adentro llega en "children".
export default function Modal({ titulo, onCerrar, children }) {
  return (
    <div className="modal-fondo">
      <div className="modal tarjeta">
        <div className="modal-titulo">
          <h2>{titulo}</h2>
          <button type="button" className="btn btn-icono" onClick={onCerrar}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
