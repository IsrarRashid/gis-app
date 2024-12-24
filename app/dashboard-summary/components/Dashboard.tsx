"use client";
import { mainDashboardAPI } from "@/app/APIs";
import AnimatedCounter from "@/app/components/AnimatedCounter";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import Loader from "@/app/components/Loader";
import Menu from "@/app/components/Menu";
import { setContent } from "@/app/features/content/contentSlice";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
import useAuthorization from "@/app/hooks/useAuthorization";
import apiClient from "@/app/services/api-client";
import { devMap, formatAmountWithCommas } from "@/app/utils";
import carOutline from "@/public/icons/carOutline.svg";
import controllingReleaseCircle from "@/public/icons/controllingReleaseCircle.svg";
import divideCircle from "@/public/icons/divideCircle.svg";
import originalAllocationCircle from "@/public/icons/originalAllocationCircle.svg";
import pndReleaseCircle from "@/public/icons/pndReleaseCircle.svg";
import reportAnalysis from "@/public/icons/reportAnalysis.svg";
import revisedAllocationCircle from "@/public/icons/revisedAllocationCircle.svg";
import settingCircleArrow from "@/public/icons/settingCircleArrow.svg";
import spendingReleaseCircle from "@/public/icons/spendingReleaseCircle.svg";
import staffTracking2 from "@/public/icons/staffTracking2.svg";
import utilizationCircle from "@/public/icons/utilizationCircle.svg";
import { Lexend, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DistributedColumnChart from "./DistributedColumnChart";
import FilterButtons from "./FilterButtons";
import FinancialSlab from "./FinancialSlab";
import MyMap from "./GoogleMap/MyMap";
import ProjectsTable, { ProjectsList } from "./ProjectsTable/ProjectsTable";
import SimplePieChart from "./SimplePieChart";
import VisitsPlan from "./VisitsPlan";
import { motion, AnimatePresence } from "framer-motion";
import ReportReview from "./ReportReview";

const lexend = Lexend({
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
});

export interface DistrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
  approved: number;
  unApproved: number;
  dropped: number;
  good: number;
  average: number;
  crtical: number;
}

export interface MainDashboard {
  totalProjects: number;
  monitoredProjects: number;
  inProcessProjects: number;
  defineLimitProjects: number;
  needConsidrationProjects: number;
  criticalProjects: number;
  approvedCost: number;
  expenditure: number;
  progress: number;
  noofProject: number;
  approved: number;
  unapproved: number;
  dropped: number;
  umbralla: number;
  a0to200: number;
  a200to400: number;
  a400to800: number;
  a800to1000: number;
  a100above: number;
  projectslist: null;
  disitrictlist: DistrictList[];
}

export interface FilterData {
  filterIdentifier: string;
  filterValues: string;
}

const Dashboard = () => {
  const [data, setData] = useState<MainDashboard>();
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  useAuthorization("dashboard");

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#CFE6F8";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    handleButtonClick(
      "dashboard",
      "https://www.youtube.com/watch?v=4VeLWNExWZU&ab_channel=DirectorateGeneralMonitoringandEvaluation"
    );
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);
  const [isLoading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"cmInitiative" | "adp">(
    "cmInitiative"
  );

  const [otherFilters, setOtherFilters] = useState<FilterData[]>([]);
  const [combinedFilters, setCombinedFilters] = useState<FilterData[]>([]);

  const cmInitiativeFilters = [
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package",
    },
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package, Flagship / Mega Project",
    },
    {
      filterIdentifier: "ProjectSubType",
      filterValues: "CM Package, Programme",
    },
  ];

  const adpFilters = [
    {
      filterIdentifier: "",
      filterValues: "",
    },
  ];

  // Combine active filter with other filters
  useEffect(() => {
    setCombinedFilters(
      activeFilter === "cmInitiative"
        ? [...cmInitiativeFilters, ...otherFilters]
        : [...adpFilters, ...otherFilters]
    );
  }, [activeFilter]);

  const handleFilterChange = (filterType: "cmInitiative" | "adp") => {
    setActiveFilter(filterType);
  };

  const handleSubmit = async (filterData: FilterData[]) => {
    setLoading(true);
    try {
      const response = await apiClient.post(mainDashboardAPI, filterData);
      setData(response.data.data);
      // setProjectsData(response.data.data.projectslist.reverse());
      // const districtFilter = filterData.find(
      //   (filter) => filter.filterIdentifier === "District"
      // );
      // if (districtFilter) {
      //   setActiveProjects(response.data.data.projectslist);
      // }
      console.log("Israr:", response.data.data);
      console.log("FilterData:", filterData);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit(cmInitiativeFilters);
  }, []);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  const [projectsData, setProjectsData] = useState<ProjectsList[]>();

  const getProjectsList = async (status: string) => {
    console.log("status", status);
    console.log("get projects with combinedFilters", combinedFilters);
    try {
      if (activeFilter === "cmInitiative") {
        const response = await apiClient.post(
          `${mainDashboardAPI}/GetProjectsListByStatus?status=${status}`,
          [...cmInitiativeFilters, ...otherFilters]
        );
        setProjectsData(response.data.data);
      } else {
        const response = await apiClient.post(
          `${mainDashboardAPI}/GetProjectsListByStatus?status=${status}`,
          [...adpFilters, ...otherFilters]
        );
        setProjectsData(response.data.data);
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  // Filter and map keys
  const filteredCMADPKeys =
    projectsData &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "projectName",
          "sectorName",
          "districtName",
          "cost",
          "revisedAllocation",
          "pnDReleases",
          "utilization",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  const filteredNoOfProjectsKeys =
    projectsData &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "projectName",
          "sectorName",
          "districtName",
          "visitCount",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          "deadline",
          "fileGenrated",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  // Filter and map keys
  const filteredKeys =
    projectsData &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "id",
          "projectName",
          "sectorName",
          "districtName",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          "deadline",
          "fileGenrated",
          "utilization",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  const [isHover1, setHover1] = useState(false);
  const [isHover2, setHover2] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(-1);

  return (
    <div
      className="container-fluid p-2 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <>
        {isLoading && <Loader />}
        <div
          className={`row d-flex justify-content-between ${lexend.className} ps-2 flex-wrap m-0`}
        >
          <>
            <CustomModal
              isFullscreen={true}
              size="xl"
              modalId={"TotalProjects"}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("TotalProject")}
                >
                  <Menu
                    background="linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)"
                    icon="/icons/eyeBold.svg"
                    value={data ? data.totalProjects : 0}
                    label={
                      activeFilter === "cmInitiative"
                        ? "CM Initiatives"
                        : "ADP Projects"
                    }
                    showTides={false}
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div
                    className="container-fluid border-0 p-1"
                    style={{
                      height: "100%",
                      overflow: "scroll",
                    }}
                  >
                    {projectsData ? (
                      <ProjectsTable
                        keys={filteredCMADPKeys!}
                        label={
                          activeFilter === "cmInitiative"
                            ? "CM Initiatives"
                            : "ADP Projects"
                        }
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                        allowLink={false}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </>
              }
            />
            <div
              className="col px-1 py-0 pe-0 me-1 text-center"
              style={{
                width: "100%",
                height: "100%",
                background: "rgba(12, 140, 233,.2)",
                borderRadius: "10px",
                border: "1px solid rgba(12, 140, 233,.4)",
              }}
            >
              <p className="mb-1 text-white">Projects Being Monitored</p>
              <div className="row m-0 d-flex flex-nowrap">
                <CustomModal
                  isFullscreen={true}
                  size="xl"
                  modalId={"noOfProjects"}
                  button={
                    <Button
                      className="position-relative btn p-0 pe-1 shadow-none w-100"
                      onClick={() => getProjectsList("NoOfProject")}
                    >
                      <div
                        className="position-absolute"
                        style={{
                          background:
                            "linear-gradient( rgba(163, 12, 233, 0), rgba(163, 12, 233, 0.2),rgba(163, 12, 233, 0.2))",
                          transition: "background .4s, opacity .4s",
                          opacity: !isHover1 ? 1 : 0,
                          borderRadius: "10px",
                          width: "98%",
                          height: "92%",
                        }}
                      ></div>
                      <Menu
                        onMouseEnter={() => setHover1(true)}
                        onMouseLeave={() => setHover1(false)}
                        background={`rgba(163, 12, 233, ${
                          isHover1 ? "0.2" : "0"
                        })`}
                        outline={`1px solid rgba(163, 12, 233, ${
                          isHover1 ? "0.4" : "0"
                        })`}
                        icon="/icons/cubes.svg"
                        value={data ? data.noofProject : 0}
                        label="No. of Projects"
                        showTides={true}
                        showArrow={true}
                        textWrap={false}
                        isGrouped={true}
                      />
                    </Button>
                  }
                  body={
                    <>
                      <div
                        className="container-fluid border-0 p-1"
                        style={{
                          height: "100%",
                        }}
                      >
                        {projectsData ? (
                          <ProjectsTable
                            keys={filteredNoOfProjectsKeys!}
                            label="Projects"
                            projectsData={projectsData}
                            setProjectsData={setProjectsData}
                          />
                        ) : (
                          <Loader />
                        )}
                      </div>
                    </>
                  }
                />
                <CustomModal
                  isFullscreen={true}
                  size="xl"
                  modalId={"noOfVisits"}
                  button={
                    <Button
                      className="position-relative btn p-0 pe-1 shadow-none w-100"
                      onClick={() => getProjectsList("BeingMonitored")}
                    >
                      <div
                        className="position-absolute"
                        style={{
                          background:
                            "linear-gradient( rgba(12, 140, 233, 0), rgba(12, 140, 233, 0.2),rgba(12, 140, 233, 0.2))",
                          transition: "background .4s, opacity .4s",
                          opacity: !isHover2 ? 1 : 0,
                          borderRadius: "10px",
                          width: "98%",
                          height: "92%",
                        }}
                      ></div>
                      <Menu
                        onMouseEnter={() => setHover2(true)}
                        onMouseLeave={() => setHover2(false)}
                        background={`rgba(12, 140, 233, ${
                          isHover2 ? "0.2" : "0"
                        })`}
                        outline={`1px solid rgba(12, 140, 233, ${
                          isHover2 ? "0.4" : "0"
                        })`}
                        icon="/icons/archery.svg"
                        value={data ? data.monitoredProjects : 0}
                        label="No. of Visits"
                        showTides={true}
                        showArrow={true}
                        textWrap={false}
                        isGrouped={true}
                      />
                    </Button>
                  }
                  body={
                    <>
                      <div
                        className="container-fluid border-0 p-1"
                        style={{
                          height: "100%",
                          overflow: "scroll",
                        }}
                      >
                        {projectsData ? (
                          <ProjectsTable
                            keys={filteredKeys!}
                            label="Visits"
                            projectsData={projectsData}
                            setProjectsData={setProjectsData}
                          />
                        ) : (
                          <Loader />
                        )}
                      </div>
                    </>
                  }
                />
              </div>
            </div>

            <CustomModal
              isFullscreen={true}
              size="xl"
              modalId={"Good"}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("OnTrack")}
                >
                  <Menu
                    background="rgba(45, 199, 84, 0.35)"
                    outline="1px solid rgba(50, 179, 52, 0.4)"
                    icon="/icons/doubleTick.svg"
                    value={data ? data.defineLimitProjects : 0}
                    label="Good Projects"
                    showTides={true}
                    tideOneImage="/images/tideOneGreen.png"
                    tideTwoImage="/images/tideTwoGreen.png"
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div
                    className="container-fluid border-0 p-1"
                    style={{
                      height: "100%",
                      overflow: "scroll",
                    }}
                  >
                    {projectsData ? (
                      <ProjectsTable
                        keys={filteredKeys!}
                        label="Good Projects"
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </>
              }
            />

            <CustomModal
              isFullscreen={true}
              size="xl"
              modalId={"Average"}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("OffTrack")}
                >
                  <Menu
                    background="rgba(224, 255, 22, 0.4)"
                    outline="1px solid rgba(232, 192, 15, 0.4)"
                    icon="/icons/bulb.svg"
                    value={data ? data.needConsidrationProjects : 0}
                    label="Average Projects"
                    showTides={true}
                    tideOneImage="/images/tideOneYellow.png"
                    tideTwoImage="/images/tideTwoYellow.png"
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div
                    className="container-fluid border-0 p-1"
                    style={{
                      height: "100%",
                      overflow: "scroll",
                    }}
                  >
                    {projectsData ? (
                      <ProjectsTable
                        keys={filteredKeys!}
                        label="Average Projects"
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </>
              }
            />

            <CustomModal
              isFullscreen={true}
              size="xl"
              modalId={"Critical"}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("Critical")}
                >
                  <Menu
                    background="rgba(233, 12, 16, 0.26)"
                    outline="1px solid rgba(233, 12, 16, 0.4)"
                    icon="/icons/critical.svg"
                    value={data ? data.criticalProjects : 0}
                    label="Critical Projects"
                    showTides={true}
                    tideOneImage="/images/tideOneRed.png"
                    tideTwoImage="/images/tideTwoRed.png"
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div
                    className="container-fluid border-0 p-1"
                    style={{
                      height: "100%",
                      overflow: "scroll",
                    }}
                  >
                    {projectsData ? (
                      <ProjectsTable
                        keys={filteredKeys!}
                        label="Critical Projects"
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </>
              }
            />

            <CustomModal
              isFullscreen={true}
              size="xl"
              modalId={"reportsInProgress"}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("InProcess")}
                >
                  <Menu
                    background="rgba(12, 140, 233, 0.2)"
                    outline="1px solid rgba(12, 140, 233, 0.4)"
                    icon="/icons/inProcess.svg"
                    value={data ? data.inProcessProjects : 0}
                    label="Reports In Progress"
                    showTides={true}
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div
                    className="container-fluid border-0 p-1"
                    style={{
                      height: "100%",
                      overflow: "scroll",
                    }}
                  >
                    {projectsData ? (
                      <ProjectsTable
                        keys={filteredKeys!}
                        label="Reports In Progress"
                        projectsData={projectsData}
                        setProjectsData={setProjectsData}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </>
              }
            />

            <ReportReview />
          </>
        </div>
        <div className={`row m-0 mt-2 ${lexend.className}`}>
          <div className="col-lg-9 col-md-12 col-sm-12 pe-1">
            {devMap && data && (
              <MyMap
                data={data}
                handleSubmit={handleSubmit}
                activeFilter={activeFilter}
                cmInitiativeFilters={cmInitiativeFilters}
                adpFilters={adpFilters}
                otherFilters={otherFilters}
                setOtherFilters={setOtherFilters}
              />
            )}
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 pe-1">
            <FilterButtons
              handleSubmit={handleSubmit}
              setOtherFilters={setOtherFilters}
              otherFilters={otherFilters}
              handleFilterChange={handleFilterChange}
              combinedFilters={combinedFilters}
              cmInitiativeFilters={cmInitiativeFilters}
              adpFilters={adpFilters}
              activeFilter={activeFilter}
            />
            <div
              className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <CustomModal
                size="xl"
                modalId="pieBarChart"
                button={
                  <Button
                    className="btn fs18px fw-normal text-white w-100"
                    style={{
                      background: "rgba(12, 140, 233, 0.2)",
                      borderRadius: "10px",
                      border: "1px solid rgba(12, 140, 233, 0.4)",
                    }}
                    onClick={() => getProjectsList("BarPie")}
                  >
                    <Image
                      src="/icons/barPie.svg"
                      alt="barPie"
                      width={44}
                      height={44}
                    />{" "}
                    Financial Analysis
                  </Button>
                }
                body={
                  <div className="row d-flex m-0">
                    {projectsData && pageLoaded && (
                      <>
                        <div className="col mb-4">
                          <DistributedColumnChart
                            data={projectsData[0]}
                            activeFilter={activeFilter}
                          />
                        </div>
                        <div className="col mb-4">
                          <SimplePieChart
                            data={{
                              totalRevenueCost:
                                projectsData[0].totalRevenueCost,
                              totalCapitalCost:
                                projectsData[0].totalCapitalCost,
                            }}
                            activeFilter={activeFilter}
                          />
                        </div>
                      </>
                    )}
                  </div>
                }
              />
            </div>
            <div
              className={`col mb-2 shadow-sm fs14px p-0 ${lexend.className}`}
              style={{
                background:
                  "linear-gradient(to right, #C6D9F1,#C6D9F1 , #E3F1C6,#E3F1C6)",
                borderRadius: "10px",
              }}
            >
              {/* <div className="row d-flex m-0">
                {hoveredButton === -1 || hoveredButton === 0 ? (
                  <div
                    className="col p-0"
                    onMouseEnter={() => setHoveredButton(0)}
                    onMouseLeave={() => setHoveredButton(-1)}
                    style={{
                      width: `${
                        hoveredButton === -1 || hoveredButton === 0
                          ? "100%"
                          : "0%"
                      }`,
                      opacity:
                        hoveredButton === -1 || hoveredButton === 0 ? 1 : 0,
                      transition: "width 1s opacity 1s",
                    }}
                  >
                    <Link
                      href="/dashboardTO"
                      className="row d-flex m-0 justify-content-center btn w-100 fw-normal fs14px"
                      style={{
                        borderRadius: "8px",
                        background: "#C6D9F1",
                      }}
                    >
                      <div className="col-auto p-0 pe-1 my-auto">
                        <Image
                          src={carOutline}
                          alt="carOutline"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="col-auto p-0">
                        Vehicle
                        <br />
                        Tracking
                      </div>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {hoveredButton === -1 || hoveredButton === 1 ? (
                  <div
                    className="col p-0"
                    onMouseEnter={() => setHoveredButton(1)}
                    onMouseLeave={() => setHoveredButton(-1)}
                  >
                    <Link
                      href="/dashboardST"
                      className="row d-flex m-0 justify-content-center btn w-100 fw-normal fs14px"
                      style={{
                        borderRadius: "8px",
                        background: "#E3F1C6",
                      }}
                    >
                      <div className="col-auto pe-1 my-auto">
                        <Image
                          src={staffTracking2}
                          alt="staffTracking2"
                          width={24}
                          height={24}
                        />
                      </div>
                      <div className="col-auto p-0">
                        Staff
                        <br />
                        Tacking
                      </div>
                    </Link>
                  </div>
                ) : (
                  ""
                )}
                {hoveredButton === -1 || hoveredButton === 2 ? (
                  <div
                    className="col p-0"
                    style={{ zIndex: 2 }}
                    onMouseEnter={() => setHoveredButton(2)}
                    onMouseLeave={() => setHoveredButton(-1)}
                  >
                    <VisitsPlan
                      getProjectsList={getProjectsList}
                      projectsData={projectsData ? projectsData : []}
                      setProjectsData={setProjectsData}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div> */}

              <div className="row d-flex m-0">
                {/* First Item */}
                <AnimatePresence>
                  {(hoveredButton === -1 || hoveredButton === 0) && (
                    <motion.div
                      className="p-0"
                      onMouseEnter={() => setHoveredButton(0)}
                      onMouseLeave={() => setHoveredButton(-1)}
                      initial={{ flex: 1, opacity: 0 }}
                      animate={{
                        flex: hoveredButton === 0 ? 3 : 1,
                        opacity: 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <Link
                        href="/dashboardTO"
                        className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                        style={{
                          borderRadius: "8px",
                          background: "#C6D9F1",
                        }}
                      >
                        <div className="col-auto p-0 pe-1 my-auto">
                          <Image
                            src={carOutline}
                            alt="carOutline"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="col-auto p-0">
                          Vehicle
                          <br />
                          Tracking
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Second Item */}
                <AnimatePresence>
                  {(hoveredButton === -1 || hoveredButton === 1) && (
                    <motion.div
                      className="p-0"
                      onMouseEnter={() => setHoveredButton(1)}
                      onMouseLeave={() => setHoveredButton(-1)}
                      initial={{ flex: 1, opacity: 0 }}
                      animate={{
                        flex: hoveredButton === 1 ? 3 : 1,
                        opacity: 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <Link
                        href="/dashboardST"
                        className="row d-flex flex-nowrap m-0 justify-content-center btn w-100 fw-normal fs14px"
                        style={{
                          borderRadius: "8px",
                          background: "#E3F1C6",
                        }}
                      >
                        <div className="col-auto p-0 pe-1 my-auto">
                          <Image
                            src={staffTracking2}
                            alt="staffTracking2"
                            width={24}
                            height={24}
                          />
                        </div>
                        <div className="col-auto p-0">
                          Staff
                          <br />
                          Tracking
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Third Item */}
                <AnimatePresence>
                  {(hoveredButton === -1 || hoveredButton === 2) && (
                    <motion.div
                      className="p-0"
                      style={{ zIndex: 2 }}
                      onMouseEnter={() => setHoveredButton(2)}
                      onMouseLeave={() => setHoveredButton(-1)}
                      initial={{ flex: 1, opacity: 0 }}
                      animate={{
                        flex: hoveredButton === 2 ? 3 : 1,
                        opacity: 1,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut",
                      }}
                    >
                      <VisitsPlan
                        getProjectsList={getProjectsList}
                        projectsData={projectsData ? projectsData : []}
                        setProjectsData={setProjectsData}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div
              className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "10px",
              }}
            >
              <div className="row d-flex m-0">
                <div className="col p-1">
                  <CustomModal
                    isFullscreen={true}
                    modalId="utilization"
                    button={
                      <Button
                        onClick={() => getProjectsList("TotalProject")}
                        className="row d-flex m-0 justify-content-center btn w-100 text-white text-nowrap fw-normal fs12px py-3"
                        style={{
                          borderRadius: "8px",
                          background: "#1E6BDD",
                        }}
                      >
                        <div className="col-auto pe-0">
                          <Image
                            src={settingCircleArrow}
                            alt="settingCircleArrow"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="col ps-0">
                          <p className="mb-0">Utilization</p>
                          <p className="mb-0">
                            <span className="text-nowrap">(20% - 80%)</span>
                            &nbsp;
                            <span>
                              {data ? (
                                <AnimatedCounter
                                  from={0}
                                  to={data.totalProjects}
                                />
                              ) : (
                                0
                              )}
                            </span>
                          </p>
                        </div>
                        {/* <div className="col-lg-4 col-md-2 col text-end">
                            {data ? (
                              <AnimatedCounter
                                from={0}
                                to={data.totalProjects}
                              />
                            ) : (
                              0
                            )}
                          </div> */}
                      </Button>
                    }
                    body={
                      <>
                        <div
                          className="container-fluid border-0 p-1"
                          style={{
                            height: "100%",
                            overflow: "scroll",
                          }}
                        >
                          {projectsData ? (
                            <ProjectsTable
                              keys={filteredCMADPKeys!}
                              label="Utilization(20% - 80%)"
                              projectsData={projectsData}
                              setProjectsData={setProjectsData}
                              allowLink={false}
                            />
                          ) : (
                            <Loader />
                          )}
                        </div>
                      </>
                    }
                  />
                </div>
                <div className="col-auto p-1">
                  <Link
                    href="/dashboardST"
                    className="row d-flex flex-nowrap justify-content-center m-0 btn w-100 text-white fw-normal fs12px py-3"
                    style={{
                      borderRadius: "8px",
                      background: "#1E6BDD",
                    }}
                  >
                    <div className="col-auto pe-1">
                      <Image
                        src={reportAnalysis}
                        alt="reportAnalysis"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="col-auto">
                      Report
                      <br />
                      Analysis
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="col mb-2 shadow-sm fs14px p-2"
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                color: "#334155",
              }}
            >
              <CustomModal
                size="xl"
                modalId="approvedCost"
                button={
                  <Button
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col text-start fw-5">Approved Cost</div>{" "}
                      <div className="col fw-normal text-end pe-3">
                        {data ? formatAmountWithCommas(data?.approvedCost) : 0}{" "}
                        M
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <div
                    className={`container-fluid p-4 ${montserrat.className}`}
                    style={{
                      borderRadius: "20px",
                      background: "rgba(255, 255, 255,.75)",
                    }}
                  >
                    <div className="row d-flex justify-content-center m-0">
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={divideCircle}
                            alt="divideCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              7409
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Total Scheme
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={originalAllocationCircle}
                            alt="originalAllocationCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              842.00 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Original Allocation
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={revisedAllocationCircle}
                            alt="revisedAllocationCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              842.00 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Revised Allocation
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={pndReleaseCircle}
                            alt="pndReleaseCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              514.64 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              P&D Release
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={controllingReleaseCircle}
                            alt="controllingReleaseCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              498.07 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Controlling Release
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col mb-4">
                        <div
                          className="col shadow d-flex bg-white"
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={spendingReleaseCircle}
                            alt="spendingReleaseCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              472.76 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Spending Release
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-auto mb-4">
                        <div
                          className="col shadow d-flex bg-white "
                          style={{
                            borderRadius: "12px",
                            padding: "20px 28px 10px 28px",
                          }}
                        >
                          <Image
                            src={utilizationCircle}
                            alt="utilizationCircle"
                            width={64}
                            height={64}
                            className="mt-2"
                          />
                          &nbsp;&nbsp;&nbsp;
                          <div className="col mb-4">
                            <p
                              className="m-0 fw-normal text-nowrap"
                              style={{ fontSize: "2.125rem" }}
                            >
                              249.86 B
                            </p>
                            <p className="m-0 text-secondary fw-normal fs20px text-nowrap">
                              Utilization
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />

              <div
                className="col p-2 rounded-2 mb-2"
                style={{ background: "rgba(235, 239, 253, 1)" }}
              >
                <div className="row d-flex m-0">
                  <div className="col fw-5 text-start">Expenditure</div>
                  <div className="col fw-normal text-end pe-3">
                    {data ? formatAmountWithCommas(data?.expenditure) : 0} M
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col mb-2 shadow-sm fs14px"
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "25px 25px 25px 25px",
              }}
            >
              <p
                className="mb-2 fw-5 pb-1"
                style={{ borderBottom: "1px dashed #97ABBD" }}
              >
                Project Status
              </p>
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Approved"
                button={
                  <Button
                    onClick={() => getProjectsList("Approved")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Approved</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-success">
                        {data ? (
                          <AnimatedCounter from={0} to={data.approved} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Approved Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Unapproved"
                button={
                  <Button
                    onClick={() => getProjectsList("Un-Approved")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Unapproved</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-danger">
                        {data ? (
                          <AnimatedCounter from={0} to={data.unapproved} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Unapproved Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Dropped"
                button={
                  <Button
                    onClick={() => getProjectsList("Dropped")}
                    className="btn w-100 col p-2 rounded-2 mb-2 fs14px"
                    style={{ background: "rgba(235, 239, 253, 1)" }}
                  >
                    <div className="row d-flex m-0">
                      <div className="col fw-5 text-start">Dropped</div>{" "}
                      <div className="col fw-normal text-end pe-3 text-secondary">
                        {data ? (
                          <AnimatedCounter from={0} to={data.dropped} />
                        ) : (
                          0
                        )}
                      </div>
                    </div>
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Dropped Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>

            <div
              className={`col mb-3 shadow-sm fs14px ${lexend.className}`}
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "20px 35px 15px 35px ",
                color: "#334155",
              }}
            >
              <p className="col fw-5 mb-2">Project Cost Slab</p>
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="0.1M"
                button={
                  <Button
                    className="btn w-100 p-0"
                    onClick={() => getProjectsList("0to200")}
                  >
                    <FinancialSlab
                      projectCategory="DDC"
                      initialLimitLabel="0.1M"
                      endLimitLabel="Up to 200M"
                      value={data ? data.a0to200 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="0.1M to Up to 200M DDC Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above200M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("201to400")}
                  >
                    <FinancialSlab
                      projectCategory="DDWP"
                      initialLimitLabel="Above 200M"
                      endLimitLabel="Up to 400M"
                      value={data ? data.a200to400 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Above 200M to Up to 400M DDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above400M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("401to800")}
                  >
                    <FinancialSlab
                      projectCategory="DDSC"
                      initialLimitLabel="Above 400M"
                      endLimitLabel="Up to 800M"
                      value={data ? data.a400to800 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Above 400M Up to 800M DDSC Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="Above800M"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("801to1000")}
                  >
                    <FinancialSlab
                      projectCategory="PDWP"
                      initialLimitLabel="Above 800M"
                      endLimitLabel="Up to 10B"
                      value={data ? data.a800to1000 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="Above 800M to upto 10B PDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
              <CustomModal
                isFullscreen={true}
                size="xl"
                modalId="10Billion"
                button={
                  <Button
                    className="btn p-0 w-100"
                    onClick={() => getProjectsList("1001Above")}
                  >
                    <FinancialSlab
                      projectCategory="CDWP"
                      initialLimitLabel="10 Billion"
                      endLimitLabel="or Above"
                      value={data ? data.a800to1000 : 0}
                    />
                  </Button>
                }
                body={
                  <>
                    <div
                      className="container-fluid border-0 p-1"
                      style={{
                        height: "100%",
                        overflow: "scroll",
                      }}
                    >
                      {projectsData ? (
                        <ProjectsTable
                          keys={filteredCMADPKeys!}
                          label="10 Billion or above CDWP Projects"
                          projectsData={projectsData}
                          setProjectsData={setProjectsData}
                          allowLink={false}
                        />
                      ) : (
                        <Loader />
                      )}
                    </div>
                  </>
                }
              />
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Dashboard;
