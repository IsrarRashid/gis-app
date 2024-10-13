"use client";
import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import carIconUrl from "/images/carTop.png"; // Add a car icon to show on the map
import CarCard from "./CarCard";
import { Tracking } from "./MapCarsComponent";
import { trackingAPI } from "@/app/APIs";

const carIcon = new L.Icon({
  iconUrl: "/images/carTop2.png",
  iconSize: [50, 60], // Adjust size
  iconAnchor: [25, 25],
});

const MapCarsManualComponent = () => {
  const [position, setPosition] = useState<[number, number]>([
    31.4589, 74.2631966,
  ]); // Starting position (latitude, longitude)
  const [apiData, setAPIData] = useState<Tracking>();

  const [arrayIndex, setArrayIndex] = useState(1);
  const [path, setPath] = useState<[number, number][]>([]);

  const markerRef = useRef<L.Marker>(null);
  const speed = 0.0001; // Adjust speed of car animation
  const duration = 500; // Duration between each move (in ms)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(trackingAPI); // Replace with your API endpoint
        const data: Tracking = await response.json();
        setAPIData(data);
        const coordinatesList = data["GBB-062"]["coordnaties list"];
        if (coordinatesList.length > 0) {
          const newPath: [number, number][] = coordinatesList.map((coord) => [
            coord.lat,
            coord.lon,
          ]);
          setPath(newPath);
          setPosition([coordinatesList[0].lat, coordinatesList[0].lon]); // Set initial position to the first coordinate
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  // Helper function to interpolate between two points
  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  const moveCar = (
    from: [number, number],
    to: [number, number],
    duration: number
  ) => {
    let start = Date.now();
    const step = () => {
      const now = Date.now();
      const elapsedTime = now - start;
      const t = Math.min(elapsedTime / duration, 1); // Ensure `t` is between 0 and 1

      const newLat = lerp(from[0], to[0], t);
      const newLng = lerp(from[1], to[1], t);

      setPosition([newLat, newLng]);

      if (t < 1) {
        requestAnimationFrame(step); // Continue moving until `t` reaches 1
      } else {
        // Move to the next point after reaching the current destination
        if (arrayIndex < path.length - 1) {
          setArrayIndex((prev) => prev + 1);
        }
      }
    };

    requestAnimationFrame(step); // Start the animation
  };

  useEffect(() => {
    if (arrayIndex < path.length - 1) {
      moveCar(path[arrayIndex - 1], path[arrayIndex], duration);
    }
  }, [path, arrayIndex]);

  return (
    <div className="position-relative">
      <MapContainer
        center={position}
        zoom={17}
        style={{
          height: "670px",
          width: "100%",
          border: 0,
          borderRadius: "10px",
        }}
        className="shadow-sm mb-2"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Draw the line from Point A to Point B */}
        <Polyline positions={path} color="blue" />

        {/* Moving Car */}
        <Marker position={position} icon={carIcon} ref={markerRef}>
          <Popup
            maxWidth={195}
            className="mapPopup"
            closeButton={false}
            offset={L.point(0, -16)}
          >
            {apiData && <CarCard apiData={apiData} />}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapCarsManualComponent;
