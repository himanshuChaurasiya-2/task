import React from "react";
import VesselMovement from "./Components/VesselMovement";

function App() {
  const startCoordinates = { lat: 22.1696, lng: 91.4996 };
  const endCoordinates = { lat: 22.2637, lng: 91.7159 };
  const speed = 20;

  return (
    <div className="App">
      <VesselMovement
        start={startCoordinates}
        end={endCoordinates}
        speed={speed}
      />
    </div>
  );
}

export default App;
