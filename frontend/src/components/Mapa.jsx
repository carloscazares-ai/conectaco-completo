import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

export const CENTRO_CDMX = [19.4226, -99.1532];

const pin = (seleccionado) => L.divIcon({
  className: '',
  html: `<div class="pin ${seleccionado ? 'seleccionado' : ''}"></div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -28],
});

function Enfocar({ posicion }) {
  const mapa = useMap();
  useEffect(() => {
    if (posicion) mapa.flyTo(posicion, Math.max(mapa.getZoom(), 14), { duration: 0.6 });
  }, [posicion, mapa]);
  return null;
}

function AlHacerClic({ onClic }) {
  useMapEvents({ click: (e) => onClic?.(e.latlng) });
  return null;
}

// lugares: [{ idLugar, nombre, latitud, longitud, ... }]
export default function Mapa({ lugares = [], seleccionado, onSeleccionar, onClicMapa, zoom = 12, centro, alto, popup }) {
  const enfocado = lugares.find((l) => l.idLugar === seleccionado);
  return (
    <MapContainer center={centro ?? CENTRO_CDMX} zoom={zoom} className="mapa" style={alto ? { height: alto, minHeight: alto } : undefined}
                  scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lugares.map((lugar) => (
        <Marker
          key={lugar.idLugar ?? 'nuevo'}
          position={[lugar.latitud, lugar.longitud]}
          icon={pin(lugar.idLugar === seleccionado)}
          eventHandlers={{ click: () => onSeleccionar?.(lugar.idLugar) }}
        >
          {popup && <Popup>{popup(lugar)}</Popup>}
        </Marker>
      ))}
      {enfocado && <Enfocar posicion={[enfocado.latitud, enfocado.longitud]} />}
      {onClicMapa && <AlHacerClic onClic={onClicMapa} />}
    </MapContainer>
  );
}
