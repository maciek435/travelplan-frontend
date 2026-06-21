import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// fix dla brakujących ikonek Leaflet w Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
})

interface Props {
  lat: number | null
  lng: number | null
}

function PreviewMap({ lat, lng }: Props) {
  const center = lat && lng > 0
    ? [lat, lng] as [number, number]
    : [52.2297, 21.0122] as [number, number] // Warszawa domyślnie

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap'
      />
      {lat && lng && (
        <Marker position={[lat, lng]} icon={defaultIcon}/>
      )}
    </MapContainer>
  )
}

export default PreviewMap