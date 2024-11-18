"use client";

import { Visit } from "@/app/hooks/useVisits";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Fragment, SetStateAction, useEffect, useState } from "react";
import StaffCard from "../Map/StaffCard";
import { Position, StaffTracking, TrackingRequestData } from "../DashboardST";
import { reverseGeoCodingAPI, staffTrackingAPI } from "@/app/APIs";
import apiClient from "@/app/services/api-client";

interface Props {
  data: StaffTracking[];
  markerPositions: { [userId: string]: Position };
  trackingRequestBody: TrackingRequestData;
}

const RecordingStaffTrackingMap: any = ({ trackingRequestBody }: Props) => {
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<Position>(); // Starting position (latitude, longitude)
  const [path, setPath] = useState<Position[]>([]); // Empty path initially
  const [data, setData] = useState<StaffTracking[]>();
  const [arrayIndex, setArrayIndex] = useState(0);

  const [startLocation, setStartLocation] = useState<string>();
  const [endLocation, setEndLocation] = useState<string>();

  const fetchStartLocationAddress = async (data: StaffTracking) => {
    try {
      const response = await fetch(
        `${reverseGeoCodingAPI}${data.startAddressLat},${data.startAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
      );
      const resopnseData = await response.json();
      setStartLocation(resopnseData.results[0].formatted_address);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  const fetchEndLocationAddress = async (data: StaffTracking) => {
    try {
      const response = await fetch(
        `${reverseGeoCodingAPI}${data.endAddressLat},${data.endAddressLong}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`
      );
      const resopnseData = await response.json();
      setEndLocation(resopnseData.results[0].formatted_address);
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Helper function to interpolate between two points
  const lerp = (start: number, end: number, t: number) => {
    return start + t * (end - start);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.post(
          staffTrackingAPI,
          trackingRequestBody
        );
        const responseData: StaffTracking[] = await response.data.data;
        setData(response.data.data);
        const coordinatesList = responseData[0]?.coordinates;
        if (coordinatesList.length > 0) {
          const newPath: Position[] = coordinatesList.map((coord) => ({
            lat: parseFloat(coord.latitude),
            lng: parseFloat(coord.longitude),
          }));

          setPath(newPath);
          setPosition({
            lat: parseFloat(coordinatesList[0].latitude),
            lng: parseFloat(coordinatesList[0].longitude),
          }); // Set initial position to the first coordinate
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (path.length > 0 && arrayIndex < path.length - 1) {
      let startTime: number | null = null;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / 1000; // 1 second per movement
        const start = path[arrayIndex];
        const end = path[arrayIndex + 1];

        const lat = start.lat + (end.lat - start.lat) * progress;
        const lng = start.lng + (end.lng - start.lng) * progress;
        setPosition({ lat, lng });

        if (progress < 1) {
          requestAnimationFrame(animate); // Continue animation until progress is complete
        } else {
          setPosition(end); // Snap to end position at the end
          setArrayIndex((prevIndex) => prevIndex + 1); // Move to the next point
        }
      };

      requestAnimationFrame(animate);
    }
  }, [arrayIndex, path]);

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      <div style={{ width: "100%", height: "840px" }}>
        <label htmlFor="">recording map</label>
        {data && data.length > 0 && (
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={6}
            defaultCenter={position}
            gestureHandling={"greedy"}
          >
            {data.map((d) => (
              <Fragment key={d.userId}>
                <AdvancedMarker
                  position={position}
                  onClick={() => {
                    setSelectedStaffIndex(parseInt(d.userId));
                    fetchStartLocationAddress(d);
                    fetchEndLocationAddress(d);
                  }}
                >
                  <span>
                    <img
                      src="/images/locationPointRoadBig.png"
                      alt="locationPointRoadBig"
                      style={{ width: "60px", height: "70px" }}
                    />
                  </span>
                </AdvancedMarker>
                {selectedStaffIndex === parseInt(d.userId) && (
                  <InfoWindow
                    position={{
                      lat: parseFloat(
                        d.coordinates[d.coordinates.length - 1].latitude
                      ),
                      lng: parseFloat(
                        d.coordinates[d.coordinates.length - 1].longitude
                      ),
                    }}
                    pixelOffset={[0, -60]}
                    onCloseClick={() => setOpen(false)}
                  >
                    <StaffCard
                      data={d}
                      setSelectedStaffIndex={setSelectedStaffIndex}
                      startLocation={startLocation}
                      endLocation={endLocation}
                    />
                  </InfoWindow>
                )}
              </Fragment>
            ))}
          </Map>
        )}
      </div>
    </APIProvider>
  );
};

export default RecordingStaffTrackingMap;
