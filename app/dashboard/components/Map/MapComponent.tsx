"use client";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI, singleProjectDashboardAPI } from "@/app/APIs";
import DistrictCard from "./DistrictCard";
import ProjectCard from "./ProjectCard";
import districtLocation from "../../../../public/images/districtLocation.png";
import projectLocation from "../../../../public/images/projectLocation.png";
import { MainDashboard, ProjectsList } from "../Dashboard";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { SingleProjectDashboard } from "@/app/projectDetailsDashboard/components/ProjectDetailsDashboard";

const districtIcon = new L.Icon({
  iconUrl: districtLocation.src,
  iconSize: [51, 51],
  iconAnchor: [25, 25],
});

const projectIcon = new L.Icon({
  iconUrl: projectLocation.src,
  iconSize: [43, 51],
  iconAnchor: [25, 25],
});

interface Props {
  data: MainDashboard;
  setData: Dispatch<SetStateAction<MainDashboard | undefined>>;
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const MapComponent = ({ data, setData, setProjectsData }: Props) => {
  const [position, setPosition] = useState<[number, number]>();
  const [projectsLocation, setProjectsLocation] = useState<
    ProjectsList[] | null
  >(null);
  const [activeDistrictId, setActiveDistrictId] = useState<number>(0);
  const [singleProjectData, setSingleProjectData] =
    useState<SingleProjectDashboard>();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setPosition([
        parseFloat(data.disitrictlist[0]?.latitude),
        parseFloat(data.disitrictlist[0]?.longitude),
      ]);
    }
  }, [data]);

  const handleSubmit = async (districtId: number, showProjects: boolean) => {
    if (showProjects) {
      try {
        console.log(districtId);

        const response = await apiClient.get(
          `${mainDashboardAPI}?districtId=${districtId}`
        );
        setData(response.data.data);
        setProjectsLocation(response.data.data.projectslist);
        setProjectsData(response.data.data.projectslist);
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
        router.push(`/projectDetailsDashboard/${projectId}`);
      } else {
        toast.error("This Project is not yet Monitored");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {}, [singleProjectData]);

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      const bounds = L.latLngBounds([]);
      const markers =
        activeDistrictId && projectsLocation
          ? projectsLocation
          : data.disitrictlist;

      // Extend bounds only if markers have valid latitude and longitude
      markers
        ?.filter((location) => location.latitude && location.longitude)
        .forEach((location) => {
          console.log("Bounds before adding extending:", bounds);
          bounds.extend([
            parseFloat(location.latitude),
            parseFloat(location.longitude),
          ]);
          console.log("Bounds after adding extending:", bounds);
        });

      // Check if bounds contain valid points before calling fitBounds
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [10, 10] });
      }
    }, [map, data, projectsLocation, activeDistrictId]);

    return null;
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      {data && position && (
        <MapContainer
          center={position}
          zoom={17}
          style={{
            height: "840px",
            width: "100%",
            borderRadius: "10px",
          }}
          className="shadow-sm mb-2"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapUpdater />
          {data.disitrictlist
            .filter(
              (district) =>
                district.latitude !== "" && district.longitude !== ""
            )
            .map((d) => (
              <Marker
                key={d.id}
                position={[parseFloat(d.latitude), parseFloat(d.longitude)]}
                icon={districtIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(d.id),
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                }}
              >
                <Popup
                  maxWidth={195}
                  closeButton={false}
                  offset={L.point(0, -16)}
                >
                  <DistrictCard data={d} />
                </Popup>
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
                  position={[
                    parseFloat(project.latitude),
                    parseFloat(project.longitude),
                  ]}
                  icon={projectIcon}
                  eventHandlers={{
                    click: () => {
                      handleSingleProjectSubmit(project.id);
                    },
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup
                    maxWidth={195}
                    closeButton={false}
                    offset={L.point(0, -16)}
                  >
                    <ProjectCard data={project} />
                  </Popup>
                </Marker>
              ))}
        </MapContainer>
      )}
    </>
  );
};

export default MapComponent;
