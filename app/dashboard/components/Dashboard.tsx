"use client";
import Visits from "./Visits";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import ChartMenu from "./ChartMenu";
import SimplePieChart from "./SimplePieChart";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import SampleTable from "./SampleTable";
import { Lexend } from "next/font/google";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import DistributedColumnChart from "./DistributedColumnChart";
import Button from "@/app/components/Button";
import Map from "./Map/Map";
import { mainDashboardAPI } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import ProjectsTable from "./ProjectsTable";
import NewMap from "./Map/NewMap";
import Menu from "@/app/components/Menu";
import { useRouter } from "next/navigation";
// import MapT from "./Map/MapT";
import Cookies from "js-cookie";
import useAuthorization from "@/app/hooks/useAuthorization";
import UpdateMap from "./Map/UpdateMap";
import MyMap from "./GoogleMap/MyMap";
import FilterButton from "./FilterButton";
import TrackingButton from "./TrackingButton";
import ProjectStatus from "./ProjectStatus";
import FinancialTab from "./FinancialTab";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

export interface ProjectsList {
  id: number;
  gSno: string;
  projectName: string;
  sectorName: string;
  districtName: string;
  districtId: number;
  latitude: string;
  longitude: string;
  totalExpenditure: number;
  actualExpenditure: number;
  plannedProgress: number;
  physicalProgress: number;
  financalProgress: number;
}

export interface DisitrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
}

export interface MainDashboard {
  totalProjects: number;
  monitoredProjects: number;
  defineLimitProjects: number;
  needConsidrationProjects: number;
  criticalProjects: number;
  approvedCost: number;
  expenditure: number;
  progress: number;
  projectslist: ProjectsList[];
  disitrictlist: DisitrictList[];
}

const Dashboard = () => {
  const [data, setData] = useState<MainDashboard>();
  const [projectsData, setProjectsData] = useState<ProjectsList[]>();
  useAuthorization("dashboard");

  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#CFE6F8";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    handleButtonClick("Dashboard");
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  const handleSubmit = async (districtId: number) => {
    try {
      const response = await apiClient.get(
        `${mainDashboardAPI}?districtId=${districtId}`
      );
      setData(response.data.data);
      setProjectsData(response.data.data.projectslist.reverse());
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(0);
  }, []);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  return (
    <div
      className="container-fluid p-3 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {data && projectsData && (
        <>
          <div
            className={`row d-flex justify-content-between ${lexend.className} ps-2`}
          >
            <Menu
              background="linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)"
              icon="/icons/eyeBold.svg"
              value={data.totalProjects}
              label="Total Projects"
              showTides={false}
            />
            <Menu
              background="rgba(12, 140, 233, 0.2)"
              outline="1px solid rgba(12, 140, 233, 0.4)"
              icon="/icons/archery.svg"
              value={data.monitoredProjects}
              label="Being Monitored"
              showTides={true}
            />
            <Menu
              background="rgba(45, 199, 84, 0.35)"
              outline="1px solid rgba(50, 179, 52, 0.4)"
              icon="/icons/doubleTick.svg"
              value={data.defineLimitProjects}
              label="On Track"
              showTides={true}
              tideOneImage="/images/tideOneGreen.png"
              tideTwoImage="/images/tideTwoGreen.png"
            />
            <Menu
              background="rgba(224, 255, 22, 0.4)"
              outline="1px solid rgba(232, 192, 15, 0.4)"
              icon="/icons/bulb.svg"
              value={data.needConsidrationProjects}
              label="Off Track"
              showTides={true}
              tideOneImage="/images/tideOneYellow.png"
              tideTwoImage="/images/tideTwoYellow.png"
            />
            <Menu
              background="rgba(233, 12, 16, 0.26)"
              outline="1px solid rgba(233, 12, 16, 0.4)"
              icon="/icons/critical.svg"
              value={data.criticalProjects}
              label="Critical"
              showTides={true}
              tideOneImage="/images/tideOneRed.png"
              tideTwoImage="/images/tideTwoRed.png"
            />
          </div>
          <div className={`row  mt-2 ${lexend.className}`}>
            <div className="col-lg-9 col-md-12 col-sm-12 pe-1">
              {/* <Map
                data={data}
                setData={setData}
                setProjectsData={setProjectsData}
              />
              <UpdateMap
                data={data}
                setData={setData}
                setProjectsData={setProjectsData}
              /> */}
              <MyMap
                data={data}
                setData={setData}
                setProjectsData={setProjectsData}
              />
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12">
              <FilterButton />
              <TrackingButton />
              <ChartMenu data={data} />
              <ProjectStatus />
              <FinancialTab />
              {/* <SimpleBarChart /> */}
              {/* <DistributedColumnChart /> */}
              {/* <VerticalComposedChart /> */}
              {/* <SimplePieChart /> */}
              {/* <div className="col">
            <Visits />
          </div> */}
            </div>
          </div>
          <div className="row ps-2 pe-2 mt-2">
            <div className="col text-center text-white rounded bg-color-sea-blue">
              <div className="row d-flex">
                <div className="col d-none d-md-block"></div>
                <div className="col" style={{ marginTop: "10px" }}>
                  <p
                    className="m-0 fs12px fw-bold"
                    style={{ letterSpacing: 1 }}
                  >
                    List of Projects
                  </p>
                </div>
                <div className="col text-end mt-1 mb-1">
                  <Button
                    className="btn btn-sm btn-light"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Downloads &nbsp;
                    <Image
                      src={downloadLineBlack}
                      alt="download"
                      width={12}
                      height={15}
                    />
                  </Button>
                </div>
              </div>
            </div>
            <ProjectsTable
              projectsData={projectsData}
              setProjectsData={setProjectsData}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
