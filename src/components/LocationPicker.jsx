import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";

const LocationPicker = ({ onSelect }) => {
  const [position, setPosition] = useState(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect(e.latlng);
      },
    });
    return null;
  };

  return (
    <MapContainer center={[43.2389, 76.8897]} zoom={13} style={{ height: "300px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      {position && <Marker position={position} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41] })} />}
    </MapContainer>
  );
};

export default LocationPicker;
