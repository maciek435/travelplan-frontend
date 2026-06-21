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
  tasks: any[]
}

function Map({ tasks }: Props) {
  const tasksWithLocation = tasks.filter(t => t.lat && t.lng)

  const center = tasksWithLocation.length > 0
    ? [tasksWithLocation[0].lat, tasksWithLocation[0].lng] as [number, number]
    : [52.2297, 21.0122] as [number, number] // Warszawa domyślnie

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap'
      />
      {tasksWithLocation.map((task) => (
        <Marker key={task.id} position={[task.lat, task.lng]} icon={defaultIcon}>
          <Popup>
            <p className="font-bold">{task.title}</p>
            <p className="text-sm">{task.location_name}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default Map