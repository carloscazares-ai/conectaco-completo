import { useEffect } from 'react';

// Mensajito abajo a la derecha que se quita solo a los 3 segundos.
// Uso: <Aviso texto={aviso} onCerrar={() => setAviso('')} />
export default function Aviso({ texto, onCerrar }) {
  useEffect(() => {
    if (texto !== '') {
      setTimeout(onCerrar, 3000);
    }
  }, [texto]);

  if (texto === '') {
    return null;
  }
  return (
    <div className="toasts">
      <div className="toast">{texto}</div>
    </div>
  );
}
