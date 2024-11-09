import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Library } from "@googlemaps/js-api-loader";
import { DisitrictList, MainDashboard, ProjectsList } from "../Dashboard";
import DistrictCard from "./DistrictCard";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI, singleProjectDashboardAPI } from "@/app/APIs";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "10px",
  boxShadow: "0px 3px 10px 1px #c4c4c4",
};

interface Props {
  data: MainDashboard;
  setData: Dispatch<SetStateAction<MainDashboard | undefined>>;
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const libraries: Library[] = ["marker"];

function UpdateMap({ data, setData, setProjectsData }: Props) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`,
    libraries,
  });
  const router = useRouter();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [districtList, setDistrictList] = useState<DisitrictList[]>([]);
  const [activeDistrict, setActiveDistrict] = useState<DisitrictList | null>(
    null
  );
  const [activeProjects, setActiveProjects] = useState<ProjectsList[]>([]);

  const [districtMarkers, setDistrictMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  const [projectMarkers, setProjectMarkers] = useState<
    google.maps.marker.AdvancedMarkerElement[]
  >([]);

  const handleDistrictClick = async (districtId: number) => {
    console.log(districtId);
    try {
      const response = await apiClient.get(
        `${mainDashboardAPI}?districtId=${districtId}`
      );
      setData(response.data.data);
      setProjectsData(response.data.data.projectslist);
      setActiveProjects(response.data.data.projectslist);
      console.log("Active projects:", response.data.data.projectslist); // Check project data here
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    setDistrictList(data.disitrictlist);
  }, [data]);

  const center = {
    lat: 31.1704,
    lng: 72.7097,
  };

  useEffect(() => {
    if (isLoaded && map) {
      if (center.lat && center.lng) {
        const { AdvancedMarkerElement, PinElement } = google.maps.marker;
        const { InfoWindow, LatLngBounds } = google.maps;

        // Remove existing markers
        districtMarkers.forEach((marker) => (marker.map = null));
        setDistrictMarkers([]);

        // Create a new LatLngBounds instance
        // const bounds = new LatLngBounds();
        const newDistrictMarkers: google.maps.marker.AdvancedMarkerElement[] =
          [];

        (activeDistrict ? [activeDistrict] : districtList)
          .filter((district) => district.latitude || district.longitude)
          .forEach((district) => {
            const pin = new PinElement({
              // glyph: "P",
              background: "#ff0000",
            });

            const position = new google.maps.LatLng(
              parseFloat(district.latitude),
              parseFloat(district.longitude)
            );

            const marker = new AdvancedMarkerElement({
              map: map,
              position: position,
              content: pin.element,
              gmpClickable: true,
            });

            newDistrictMarkers.push(marker);

            // console.log("Bounds before adding district markers:", bounds);
            // Extend the bounds to include this marker's position
            // bounds.extend(position);
            // console.log("Bounds after adding district markers:", bounds);
            const districtString = `
          <div
            class="col"
            style="border-radius: 10px;"
          >
            <div
              class="row d-flex justify-content-between m-1 mb-0 fw-normal fs-6"
              style="letter-spacing: 1; "
            >
              <div class="col fw-bold">District</div>
              <div class="col text-end color-sea-blue fs-6 fw-bold">Division</div>
            </div>
            <div
              class="row d-flex m-1 fw-normal fs-6"
              style="letter-spacing: 1; "
            >
              <div class="col" style="white-space:nowrap">${district.districtName}</div>
              <div class="col">&nbsp;</div>
              <div class="col text-end color-sea-blue fs-6" style="white-space:nowrap">
                ${district.divisionName}
              </div>
            </div>
          </div>
            `;

            const infoWindow = new InfoWindow({
              content: districtString,
            });

            // Add click event directly to the marker
            marker.addListener("click", () => {
              setShowButton(true);
              setActiveDistrict(district);
              handleDistrictClick(district.id);
              infoWindow.close();
              infoWindow.open(map, marker);
            });
          });
        // map.fitBounds(bounds); // to dynamically center across all district points
        map.setCenter({
          lat: parseFloat(districtList[0]?.latitude),
          lng: parseFloat(districtList[0]?.longitude),
        });
        setDistrictMarkers(newDistrictMarkers);
      }
    }
  }, [isLoaded, map, center.lat, center.lng, activeDistrict]);

  useEffect(() => {
    if (isLoaded && map) {
      if (center.lat && center.lng) {
        const { AdvancedMarkerElement, PinElement } = google.maps.marker;
        const { InfoWindow, LatLngBounds } = google.maps;

        projectMarkers.forEach((marker) => (marker.map = null));
        setProjectMarkers([]);

        // Create a new LatLngBounds instance
        const bounds = new LatLngBounds();
        const newProjectMarkers: google.maps.marker.AdvancedMarkerElement[] =
          [];

        activeDistrict &&
          activeProjects
            .filter((project) => project.latitude || project.longitude)
            .forEach((project) => {
              const pin = new PinElement({
                // glyph: "P",
                background: "#ff0000",
              });

              const position = new google.maps.LatLng(
                parseFloat(project.latitude),
                parseFloat(project.longitude)
              );

              const marker = new AdvancedMarkerElement({
                map: map,
                position: position,
                content: pin.element,
                gmpClickable: true,
              });

              newProjectMarkers.push(marker);

              // Extend the bounds to include this marker's position
              // console.log(
              //   "Bounds before adding project markers:",
              //   bounds.toString()
              // );
              bounds.extend(position);
              // console.log(
              //   "Bounds after adding project markers:",
              //   bounds.toString()
              // );

              const projectString = `
            <div
    class="card border-0"
    style="
    width:300px;
      border-radius: "10px",
    "
  >
    <p class="m-2 mb-1 fw-normal fs-6" style=" letter-spacing: 1 ">
      ${project.projectName ? project.projectName : ""}
      &nbsp;
      <button id="project-${
        project.id
      }" class="btn btn-sm btn-primary"><img sr"/icons/more.svg" alt="details" style="width:10px; height:10px"/></button>
    </p>
    <p class="col m-2 mb-3 fw-normal fs-6">
      <span
        class="col p-1 rounded me-1"
        style=" background: #B5FFB2 "
      >
        <img
          src="/icons/tickStar.svg"
          style=" margin-bottom: 1.5px "
          alt="tickStar"
        />
        ${project.sectorName ? project.sectorName : ""}
      </span>
      <span
        class="col p-1 rounded text-white"
        style=" background: rgba(12, 140, 233, 0.35) "
      >
        <img
          src="/icons/whiteBuilding.svg"
          style=" margin-bottom: 1.5px "
          alt="whiteBuilding"
        />
        ${project.districtName ? project.districtName : ""}
      </span>
    </p>
  </div>
          `;

              const infoWindow = new InfoWindow({
                content: projectString,
              });

              google.maps.event.addListener(infoWindow, "domready", () => {
                const linkButton = document.getElementById(
                  `project-${project.id}`
                );
                if (linkButton) {
                  linkButton.addEventListener("click", () =>
                    handleSingleProjectSubmit(project.id)
                  );
                }
              });

              // Add click event directly to the marker
              marker.addListener("click", () => {
                infoWindow.close();
                infoWindow.open(map, marker);
              });
            });

        map.fitBounds(bounds); // to dynamically center across all district points
        if (activeDistrict) {
          map.setCenter({
            lat: parseFloat(activeProjects[0].latitude),
            lng: parseFloat(activeProjects[0].longitude),
          });
        }
        console.log("center called", map.getCenter());
        setProjectMarkers(newProjectMarkers);
      }
    }
  }, [isLoaded, map, center.lat, center.lng, activeProjects]);

  const handleBackButtonClick = async () => {
    setShowButton(false);
    setActiveDistrict(null); // Reset to show all districts
    try {
      const response = await apiClient.get(
        `${mainDashboardAPI}?districtId=${0}`
      );
      setData(response.data.data);
      setActiveProjects([]);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const handleSingleProjectSubmit = async (projectId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}`
      );
      if (response.data.data) {
        router.push(`/projectDetailsDashboard/${projectId}`);
      } else {
        toast.error("This Project is not yet Monitored");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  const mapOptions = {
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
    // zoom: 9,
  };

  return isLoaded ? (
    <div>
      {showButton && (
        <button
          className="btn btn-warning mb-3"
          onClick={handleBackButtonClick}
        >
          Back
        </button>
      )}
      <div>
        <Toaster />
      </div>
      {districtList && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          onLoad={(map) => setMap(map)}
          options={mapOptions}
          center={
            activeDistrict
              ? {
                  lat: parseFloat(
                    activeProjects[0] && activeProjects[0].latitude
                  ),
                  lng: parseFloat(
                    activeProjects[0] && activeProjects[0].longitude
                  ),
                }
              : {
                  lat: parseFloat(districtList[0].latitude),
                  lng: parseFloat(districtList[0].longitude),
                }
          }
        ></GoogleMap>
      )}
    </div>
  ) : (
    <></>
  );
}

export default React.memo(UpdateMap);
