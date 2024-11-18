"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { Fragment, useState } from "react";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";
import ProjectCard from "../Map/ProjectCard";

interface Props {
  data: SingleProjectDashboard;
}

const MyMap = ({ data }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
      {data.projectLat && data.projectlong && (
        <div style={{ width: "100%", height: "500px" }}>
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_Reduce_ID}
            mapTypeId="hybrid"
            defaultZoom={17}
            defaultCenter={{
              lat: parseFloat(data.projectLat),
              lng: parseFloat(data.projectlong),
            }}
            gestureHandling={"greedy"}
          >
            <AdvancedMarker
              position={{
                lat: parseFloat(data.projectLat),
                lng: parseFloat(data.projectlong),
              }}
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <span>
                <img
                  src="/images/projectLocation.png"
                  alt="projectLocation"
                  style={{ width: "60px", height: "70px" }}
                />
              </span>
            </AdvancedMarker>
            {open && (
              <InfoWindow
                position={{
                  lat: parseFloat(data.projectLat),
                  lng: parseFloat(data.projectlong),
                }}
                pixelOffset={[0, -60]}
                onCloseClick={() => setOpen(false)}
              >
                <ProjectCard data={data} />
              </InfoWindow>
            )}
          </Map>
        </div>
      )}
    </APIProvider>
  );
};

export default MyMap;
