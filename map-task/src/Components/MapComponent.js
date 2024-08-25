import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapComponent.css";
import vesselIcon from "../assets/Frame 334.png";
import startIcon from "../assets/location_svgrepo.com (1).png";
import endIcon from "../assets/location_svgrepo.com (2).png";

const startMarker = new L.Icon({
  iconUrl: startIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const endMarker = new L.Icon({
  iconUrl: endIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const calculateRotation = (start, position) => {
  if (!start || !position) {
    console.error(
      "Invalid input to calculateRotation. Start or Position is undefined."
    );
    return 0;
  }

  const dx = position[1] - start[1];
  const dy = position[0] - start[0];

  if (isNaN(dx) || isNaN(dy)) {
    console.error("Invalid delta values:", dx, dy);
    return 0;
  }

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  return angle;
};

const VesselMarker = ({ position, rotation }) => {
  const adjustedRotation = rotation + 35;
  const icon = L.divIcon({
    className: "custom-vessel-icon",
    html: `<div style="transform: rotate(${adjustedRotation}deg); transition: transform 0.5s linear;">
              <img src="${vesselIcon}" style=" height: 70px;" />
           </div>`,
    iconAnchor: [40, 35],
  });

  return <Marker position={position} icon={icon} />;
};

const MapComponent = ({ start, end, position }) => {
  const startCoords =
    start?.lat && start?.lng ? [start.lat, start.lng] : [0, 0];
  const endCoords = end?.lat && end?.lng ? [end.lat, end.lng] : [0, 0];
  const positionCoords =
    position?.lat && position?.lng ? [position.lat, position.lng] : [0, 0];

  const angle = calculateRotation(startCoords, positionCoords);
  return (
    <MapContainer
      center={start}
      zoom={10}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Marker position={start} icon={startMarker} />
      <Marker position={end} icon={endMarker} />
      <VesselMarker position={positionCoords} rotation={angle} />
    </MapContainer>
  );
};

export default MapComponent;
