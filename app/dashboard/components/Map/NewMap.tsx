import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import { MainDashboard, ProjectsList } from "../Dashboard";
import { useRouter } from "next/navigation";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI, singleProjectDashboardAPI } from "@/app/APIs";
import DistrictCard from "./DistrictCard";
import districtLocation from "../../../../public/images/districtLocation.png";
import projectLocation from "../../../../public/images/projectLocation.png";
import ProjectCard from "./ProjectCard";
import { SingleProjectDashboard } from "@/app/projectDetailsDashboard/components/ProjectDetailsDashboard";

const containerStyle = {
  height: "550px",
  width: "100%",
  borderRadius: "10px",
  boxShadow: "0px 3px 10px 1px #c4c4c4",
  marginBottom: "10px",
};

interface Props {
  data: MainDashboard;
  setData: Dispatch<SetStateAction<MainDashboard | undefined>>;
}

function NewMap({ data, setData }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
  });
  const [isOpen, setIsOpen] = useState(false); // State to control InfoWindow visibility

  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [singleProjectData, setSingleProjectData] =
    useState<SingleProjectDashboard>();
  const [projectsLocation, setProjectsLocation] = useState<
    ProjectsList[] | null
  >(null);
  const [activeDistrictId, setActiveDistrictId] = useState<number>(0);

  const router = useRouter();
  const mapRef = useRef<google.maps.Map | null>(null); // Use the native Google Map type

  useEffect(() => {
    if (data) {
      setPosition({
        lat: parseFloat(data.disitrictlist[0]?.latitude),
        lng: parseFloat(data.disitrictlist[0]?.longitude),
      });
    }
  }, [data]);

  useEffect(() => {
    if (data && projectsLocation) {
      const bounds = new window.google.maps.LatLngBounds(); // Use window.google.maps.LatLngBounds
      const markers =
        activeDistrictId && projectsLocation
          ? projectsLocation
          : data.disitrictlist;

      // Extend bounds based on valid markers
      markers
        ?.filter((location) => location.latitude && location.longitude)
        .forEach((location) => {
          bounds.extend({
            lat: parseFloat(location.latitude),
            lng: parseFloat(location.longitude),
          });
        });

      // Check if bounds contain valid points before fitting
      if (
        bounds.getNorthEast().lat() !== bounds.getSouthWest().lat() &&
        bounds.getNorthEast().lng() !== bounds.getSouthWest().lng()
      ) {
        mapRef.current?.fitBounds(bounds); // fitBounds on the map reference
      }
    }
  }, [data, projectsLocation, activeDistrictId]);

  const handleSubmit = async (districtId: number, showProjects: boolean) => {
    if (showProjects) {
      try {
        console.log(districtId);

        const response = await apiClient.get(
          `${mainDashboardAPI}?districtId=${districtId}`
        );
        setData(response.data.data);
        setProjectsLocation(response.data.data.projectslist);
        setActiveDistrictId(districtId);
      } catch (err) {
        console.error("Submission error:", err);
      }
    } else {
      const response = await apiClient.get(
        `${mainDashboardAPI}?districtId=${0}`
      );
      setData(response.data.data);
      setProjectsLocation(null);
      setActiveDistrictId(0);
    }
  };

  const handleMarkerClick = (districtId: number) => {
    const isActive = activeDistrictId === districtId;
    handleSubmit(districtId, !isActive); // Toggle project markers
    console.log(districtId);
  };

  const handleSingleProjectSubmit = async (projectId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}`
      );
      setSingleProjectData(response.data.data);
      if (response.data.data) {
        router.push(`/dashboardTwo/${projectId}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };
  const [hoveredMarkerId, setHoveredMarkerId] = useState<number | null>(null);

  return isLoaded && position && data ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      onLoad={(map) => {
        mapRef.current = map;

        if (data) {
          const bounds = new window.google.maps.LatLngBounds();

          data.disitrictlist
            .filter((district) => district.latitude && district.longitude)
            .forEach((district) => {
              const lat = parseFloat(district.latitude);
              const lng = parseFloat(district.longitude);
              if (!isNaN(lat) && !isNaN(lng)) {
                bounds.extend({ lat, lng });
              }
            });

          if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
          }
        }
      }}
    >
      {/* Child components, such as markers, info windows, etc. */}
      {data.disitrictlist
        .filter(
          (district) => district.latitude !== "" && district.longitude !== ""
        )
        .map((d) => (
          <Marker
            key={d.id}
            position={{
              lat: parseFloat(d.latitude),
              lng: parseFloat(d.longitude),
            }}
            onMouseOver={() => setHoveredMarkerId(d.id)} // Set the currently hovered marker ID
            onMouseOut={() => setHoveredMarkerId(null)} // Clear the hovered marker ID
            onClick={() => handleMarkerClick(d.id)}
            icon={{
              url: districtLocation.src,
              scaledSize: new window.google.maps.Size(60, 59),
            }}
          >
            {hoveredMarkerId === d.id && (
              <InfoWindow>
                <DistrictCard data={d} />
                {/* Add any other details or style as needed */}
              </InfoWindow>
            )}
          </Marker>
        ))}
      {activeDistrictId &&
        projectsLocation &&
        projectsLocation
          .filter(
            (project) => project.latitude !== "" && project.longitude !== ""
          )
          .map((project) => (
            <Marker
              key={project.id}
              position={{
                lat: parseFloat(project.latitude),
                lng: parseFloat(project.longitude),
              }}
              onMouseOver={() => setHoveredMarkerId(project.id)} // Set the currently hovered marker ID
              onMouseOut={() => setHoveredMarkerId(null)} // Clear the hovered marker ID
              onClick={() => handleSingleProjectSubmit(project.id)}
              icon={{
                url: projectLocation.src,
                scaledSize: new window.google.maps.Size(43, 51),
              }}
            >
              {hoveredMarkerId === project.id && (
                <InfoWindow>
                  <ProjectCard data={project} />
                  {/* Add any other details or style as needed */}
                </InfoWindow>
              )}
            </Marker>
          ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(NewMap);
