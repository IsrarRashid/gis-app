"use client";

import { Visit } from "@/app/hooks/useVisits";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Fragment, useEffect, useState } from "react";
import StaffCard from "../Map/StaffCard";
import { Position, StaffTracking } from "../DashboardST";
import { reverseGeoCodingAPI } from "@/app/APIs";

interface Props {
  data: StaffTracking[];
  markerPositions: { [userId: string]: Position };
}

const LiveStaffTrackingMap: any = ({ data, markerPositions }: Props) => {
  const [selectedStaffIndex, setSelectedStaffIndex] = useState(0);
  const [open, setOpen] = useState(false);
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

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      <div style={{ width: "100%", height: "840px" }}>
        live map
        {data && data.length > 0 && (
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={6}
            defaultCenter={{
              lat: parseFloat(
                data[0].coordinates[data[0].coordinates.length - 1].latitude
              ),
              lng: parseFloat(
                data[0].coordinates[data[0].coordinates.length - 1].longitude
              ),
            }}
            gestureHandling={"greedy"}
          >
            {data.map((d) => (
              <Fragment key={d.userId}>
                <AdvancedMarker
                  position={markerPositions[d.userId]}
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
                    pixelOffset={[0, -70]}
                    onCloseClick={() => setOpen(false)}
                  >
                    <StaffCard
                      data={d}
                      startLocation={startLocation}
                      endLocation={endLocation}
                      setSelectedStaffIndex={setSelectedStaffIndex}
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

export default LiveStaffTrackingMap;
