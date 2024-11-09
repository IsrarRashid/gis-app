import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { DisitrictList, MainDashboard, ProjectsList } from "../Dashboard";
import apiClient from "@/app/services/api-client";
import { mainDashboardAPI, singleProjectDashboardAPI } from "@/app/APIs";
import DistrictCard from "../Map/DistrictCard";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import ProjectCard from "../Map/ProjectCard";

interface Props {
  data: MainDashboard;
  setData: Dispatch<SetStateAction<MainDashboard | undefined>>;
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
}

const MyMap = ({ data, setData, setProjectsData }: Props) => {
  const InitialCenterPosition = {
    lat: 31.1704,
    lng: 72.7097,
  };
  const [open, setOpen] = useState(false);
  const [districtList, setDistrictList] = useState<DisitrictList[]>([]);

  useEffect(() => {
    setDistrictList(data.disitrictlist);
  }, [data]);

  const [selectedDistrictIndex, setSelectedDistrictIndex] = useState(0);
  const [activeDistrict, setActiveDistrict] = useState<DisitrictList | null>(
    null
  );
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);
  const [activeProjects, setActiveProjects] = useState<ProjectsList[]>([]);
  const [showButton, setShowButton] = useState(false);
  const router = useRouter();

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

  const handleProjectSubmit = async (projectId: number) => {
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

  return (
    <>
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
      <APIProvider apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`}>
        <div style={{ width: "100%", height: "840px" }}>
          <Map
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultZoom={7}
            defaultCenter={InitialCenterPosition}
            gestureHandling={"greedy"}
          >
            {(activeDistrict ? [activeDistrict] : districtList)
              .filter((district) => district.latitude && district.longitude)
              .map((district) => (
                <Fragment key={district.id}>
                  <AdvancedMarker
                    style={{
                      transform: `scale(${
                        [selectedDistrictIndex].includes(district.id) ? 1.3 : 1
                      })`,
                      transition: "transform 0.1s ease-in-out",
                    }}
                    onClick={() => {
                      handleDistrictClick(district.id);
                      setActiveDistrict(district);
                      setShowButton(true);
                    }}
                    position={{
                      lat: parseFloat(district.latitude),
                      lng: parseFloat(district.longitude),
                    }}
                    onMouseEnter={() => setSelectedDistrictIndex(district.id)}
                    onMouseLeave={() =>
                      setSelectedDistrictIndex(9 + parseInt("a"))
                    }
                  >
                    <span>
                      <img
                        src="/images/districtLocation.png"
                        alt="districtLocation"
                      />
                    </span>
                  </AdvancedMarker>
                  {selectedDistrictIndex === district.id && (
                    <InfoWindow
                      position={{
                        lat: parseFloat(district.latitude),
                        lng: parseFloat(district.longitude),
                      }}
                      pixelOffset={[0, -60]}
                      onCloseClick={() => setOpen(false)}
                    >
                      <DistrictCard data={district} />
                    </InfoWindow>
                  )}
                </Fragment>
              ))}

            {activeDistrict &&
              activeProjects &&
              activeProjects
                .filter((project) => project.latitude && project.longitude)
                .map((project) => (
                  <Fragment key={project.id}>
                    <AdvancedMarker
                      style={{
                        transform: `scale(${
                          [selectedProjectIndex].includes(project.id) ? 1.3 : 1
                        })`,
                        transition: "transform 0.1s ease-in-out",
                      }}
                      onClick={() => handleProjectSubmit(project.id)}
                      position={{
                        lat: parseFloat(project.latitude),
                        lng: parseFloat(project.longitude),
                      }}
                      onMouseEnter={() => setSelectedProjectIndex(project.id)}
                      onMouseLeave={() =>
                        setSelectedProjectIndex(9 + parseInt("a"))
                      }
                    >
                      <span>
                        <img
                          src="/images/projectLocation.png"
                          alt="projectLocation"
                        />
                      </span>
                    </AdvancedMarker>
                    {selectedProjectIndex === project.id && (
                      <InfoWindow
                        position={{
                          lat: parseFloat(project.latitude),
                          lng: parseFloat(project.longitude),
                        }}
                        pixelOffset={[0, -60]}
                        onCloseClick={() => setOpen(false)}
                      >
                        <ProjectCard data={project} />
                      </InfoWindow>
                    )}
                  </Fragment>
                ))}
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default MyMap;
