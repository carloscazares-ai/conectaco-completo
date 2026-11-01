// Mapa de OpenStreetMap, hecho con las librerias Leaflet y React-Leaflet.
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export const CENTRO_CDMX = [19.4226, -99.1532];

// El dibujo del pin. Esta en styles.css (clase .pin)
function crearPin(seleccionado) {
  return L.divIcon({
    className: '',
    html: seleccionado ? '<div class="pin seleccionado"></div>' : '<div class="pin"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

// Avisa cuando le dan clic al mapa (lo usa "Mi establecimiento")
function DetectarClic({ onClic }) {
  useMapEvents({
    click: (evento) => onClic(evento.latlng),
  });
  return null;
}

export default function Mapa({ lugares, seleccionado, onSeleccionar, onClicMapa, centro, zoom, alto, conEnlace }) {
  return (
    <MapContainer center={centro || CENTRO_CDMX} zoom={zoom || 12} className="mapa" style={{ height: alto, minHeight: alto }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {lugares.map((lugar) => (
        <Marker
          key={lugar.idLugar}
          position={[lugar.latitud, lugar.longitud]}
          icon={crearPin(lugar.idLugar === seleccionado)}
          eventHandlers={{ click: () => { if (onSeleccionar) onSeleccionar(lugar.idLugar); } }}
        >
          {conEnlace && (
            <Popup>
              <strong>{lugar.nombre}</strong><br />
              <Link to={'/turista/lugares/' + lugar.idLugar}>Ver detalle</Link>
            </Popup>
          )}
        </Marker>
      ))}

      {onClicMapa && <DetectarClic onClic={onClicMapa} />}
    </MapContainer>
  );
}
