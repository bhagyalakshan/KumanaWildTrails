
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ExternalLinkIcon } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getAnimalIcon, formatDate } from "./utils";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapPopup = ({ location, animalType, date }) => {
  if (!location.lat || !location.lon) {
    return (
      <div className="p-3 text-center text-muted bg-light rounded">
        No location data available for this sighting
      </div>
    );
  }

  const position = [location.lat, location.lon];

  return (
    <div className="card w-100 max-w-90vw max-w-sm-400px rounded overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "300px", width: "100%" }}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-center">
              <span className="fs-4">{getAnimalIcon(animalType)}</span>
              <div className="fw-medium text-capitalize">
                {animalType} Sighting
              </div>
              <div className="small">{location.name}</div>
              <div className="small text-muted">
                {formatDate(new Date(date))}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="card-footer p-3 bg-light d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
        <div>
          <div className="fw-medium">{location.name}</div>
          <div className="text-muted font-monospace small">
            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </div>
        </div>
        <a
          href={`https://www.google.com/maps?q=${location.lat},${location.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-decoration-underline small d-flex align-items-center bg-white px-2 py-1 rounded"
        >
          Open in Maps <ExternalLinkIcon className="ms-1" size={12} />
        </a>
      </div>
    </div>
  );
};

export default MapPopup;
