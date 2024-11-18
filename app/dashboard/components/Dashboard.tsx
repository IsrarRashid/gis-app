"use client";
import { useEffect, useState } from "react";
import ChartMenu from "./ChartMenu";
import { Lexend } from "next/font/google";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import { mainDashboardAPI } from "@/app/APIs";
import apiClient from "@/app/services/api-client";
import ProjectsTable from "./ProjectsTable";
import Menu from "@/app/components/Menu";
import useAuthorization from "@/app/hooks/useAuthorization";
import MyMap from "./GoogleMap/MyMap";
import FilterButton from "./FilterButton";
import TrackingButton from "./TrackingButton";
import ProjectStatus from "./ProjectStatus";
import FinancialTab from "./FinancialTab";
import MenuModal from "./MenuModal";
import ProjectReportOverviewModal from "./projectReportOverview/ProjectReportOverviewModal";

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

export interface FilterData {
  filterIdentifier: string;
  filterValues: string;
}

const Dashboard = () => {
  const [data, setData] = useState<MainDashboard>();
  const [projectsData, setProjectsData] = useState<ProjectsList[]>();
  const [districtId, setDistrictId] = useState<number>();
  const [districtList, setDistrictList] = useState<DisitrictList[]>([]);

  const [filterFixedOption, setFilterFixedOption] = useState<FilterData>({
    filterIdentifier: "switch",
    filterValues: "CMInitiative",
  });
  const [filterData, setFilterData] = useState<FilterData[]>([
    {
      filterIdentifier: "switch",
      filterValues: "CMInitiative",
    },
  ]);

  const addFilter = (identifier: string, value: string) => {
    setFilterData((prevFilters) => [
      ...prevFilters,
      { filterIdentifier: identifier, filterValues: value },
    ]);
  };

  // Method to add a single filter object to filterData
  const addSingleFilter = (newFilter: FilterData) => {
    setFilterData((prevFilters) => [...prevFilters, newFilter]);
  };

  // Usage example
  const handleAddFilter = () => {
    const singleObject = { filterIdentifier: "example", filterValues: "value" };
    addSingleFilter(singleObject);
  };

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

  const handleSubmit = async (filterData: FilterData[]) => {
    try {
      const response = await apiClient.post(mainDashboardAPI, filterData);
      setData(response.data.data);
      setProjectsData(response.data.data.projectslist.reverse());
      const districtFilter = filterData.find(
        (filter) => filter.filterIdentifier === "District"
      );
      if (districtFilter) {
        setActiveProjects(response.data.data.projectslist);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(filterData);
  }, []);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  const [activeProjects, setActiveProjects] = useState<ProjectsList[]>([]);

  const handleDistrictClick = async (filterData: FilterData[]) => {
    // setDistrictId(districtId);
    // console.log(districtId);
    try {
      const response = await apiClient.post(mainDashboardAPI, filterData);
      setData(response.data.data);
      setProjectsData(response.data.data.projectslist);
      setActiveProjects(response.data.data.projectslist);
      console.log("Active projects:", response.data.data.projectslist); // Check project data here
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

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
            <MenuModal
              background="rgba(12, 140, 233, 0.2)"
              outline="1px solid rgba(12, 140, 233, 0.4)"
              icon="/icons/archery.svg"
              value={data.monitoredProjects}
              label="Being Monitored"
              showTides={true}
              districtId={districtId && districtId}
              api={`${mainDashboardAPI}/BeingMonitored`}
              modalId="menuModal0"
            />
            <MenuModal
              background="rgba(45, 199, 84, 0.35)"
              outline="1px solid rgba(50, 179, 52, 0.4)"
              icon="/icons/doubleTick.svg"
              value={data.defineLimitProjects}
              label="On Track"
              showTides={true}
              tideOneImage="/images/tideOneGreen.png"
              tideTwoImage="/images/tideTwoGreen.png"
              districtId={districtId && districtId}
              api={`${mainDashboardAPI}/OnTrack`}
              modalId="menuModal1"
            />
            <MenuModal
              background="rgba(224, 255, 22, 0.4)"
              outline="1px solid rgba(232, 192, 15, 0.4)"
              icon="/icons/bulb.svg"
              value={data.needConsidrationProjects}
              label="Off Track"
              showTides={true}
              tideOneImage="/images/tideOneYellow.png"
              tideTwoImage="/images/tideTwoYellow.png"
              districtId={districtId && districtId}
              api={`${mainDashboardAPI}/OffTrack`}
              modalId="menuModal2"
            />
            <MenuModal
              background="rgba(233, 12, 16, 0.26)"
              outline="1px solid rgba(233, 12, 16, 0.4)"
              icon="/icons/critical.svg"
              value={data.criticalProjects}
              label="Critical"
              showTides={true}
              tideOneImage="/images/tideOneRed.png"
              tideTwoImage="/images/tideTwoRed.png"
              districtId={districtId && districtId}
              api={`${mainDashboardAPI}/Critical`}
              modalId="menuModal3"
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
                setDistrictId={setDistrictId}
                handleDistrictClick={handleDistrictClick}
                activeProjects={activeProjects}
                setActiveProjects={setActiveProjects}
              />
            </div>
            <div className="col-lg-3 col-md-12 col-sm-12">
              <FilterButton
                handleDistrictClick={handleDistrictClick}
                handleSubmit={handleSubmit}
                setFilterFixedOption={setFilterFixedOption}
                filterFixedOption={filterFixedOption}
              />
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
