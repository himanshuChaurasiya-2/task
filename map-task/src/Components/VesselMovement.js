import React, { useState, useEffect } from "react";
import { LatLng } from "leaflet";
import MapComponent from "./MapComponent";

const haversineDistance = (coords1, coords2) => {
  const toRad = (x) => (x * Math.PI) / 180;

  const lat1 = coords1.lat;
  const lon1 = coords1.lng;
  const lat2 = coords2.lat;
  const lon2 = coords2.lng;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const calculateNewPosition = (start, end, progress) => {
  if (!start || !end) {
    console.error("Invalid start or end coordinates:", start, end);
    return new LatLng(0, 0);
  }

  const lat = start.lat + (end.lat - start.lat) * progress;
  const lng = start.lng + (end.lng - start.lng) * progress;

  if (isNaN(lat) || isNaN(lng)) {
    console.error("Invalid latitude or longitude:", lat, lng);
    return new LatLng(0, 0);
  }

  return new LatLng(lat, lng);
};

const VesselMovement = ({ start, end, speed }) => {
  const [position, setPosition] = useState(start);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const distance = haversineDistance(start, end);
    const interval = 500; // 2FPS
    const step = (speed / 3600) * interval;

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + step / distance;
        if (newProgress >= 1) {
          clearInterval(intervalId);
          return 1;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [start, end, speed]);

  useEffect(() => {
    const newPos = calculateNewPosition(start, end, progress);
    setPosition(newPos);
  }, [progress, start, end]);

  return <MapComponent start={start} end={end} position={position} />;
};

export default VesselMovement;
