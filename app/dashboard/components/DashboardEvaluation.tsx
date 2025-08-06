"use client";
import { EVALUATION_MAIN_DASHBOARD_API, MAIN_DASHBOARD_API } from "@/app/APIs";
import AnimatedCounter from "@/app/components/AnimatedCounter";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import Loader from "@/app/components/Loader";
// import Menu from "@/app/components/Menu";
import { setContent } from "@/app/features/content/contentSlice";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
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
import Cookies from "js-cookie";
import { Lexend, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import DistributedColumnChart from "./DistributedColumnChart";
import FilterButtons from "./FilterButtons";
import FinancialSlab from "./FinancialSlab";
import MyMap from "./GoogleMap/MyMap";
import ProjectsTable, { ProjectsList } from "./ProjectsTable/ProjectsTable";
import ReportReview from "./ReportReview";
import SimplePieChart from "./SimplePieChart";
import VisitsPlan from "./VisitsPlan";
import styles from "./Dashboard.module.css";
import dynamic from "next/dynamic";
import EvaluationMap from "./GoogleMap/EvaluationMap";

const Menu = dynamic(() => import("@/app/components/Menu"), { ssr: false });

const lexend = Lexend({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  preload: false,
  weight: ["400", "500", "600", "700", "800"],
});

export interface DistrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
  submittedPCIVs: number;
  visitedPCIVs: number;
  notVisitedPCIvs: number;
  successful: number;
  partiallySuccessful: number;
  notSuccessful: number;
}

export interface EvaluationMainDashboard {
  totalSubmittedPCIvs: number;
  snEs: number;
  nonSNEs: number;
  noOfVisitsMultipleSitesOrUmbrella: number;
  noOfVisitsMultipleSitesOrUmbrellaTotalSNEs: number;
  noOfVisitsMultipleSitesOrUmbrellaTotalNonSNEs: number;
  noOfVisitsSingle: number;
  noOfVisitsSingleTotalSNEs: number;
  noOfVisitsSingleTotalNonSNEs: number;
  successful: number;
  partiallySuccessful: number;
  notSuccessful: number;
  reportsInProgress: number;
  utilization80OrAbove: number;
  projectsList: [
    {
      id: number;
      gSno: string;
      projectName: string;
      districtName: string;
      latitude: string;
      longitude: string;
    }
  ];
  districtList: DistrictList[];
}

export interface FilterData {
  filterIdentifier: string;
  filterValues: string;
}

const DashboardEvaluation = () => {
  const [data, setData] = useState<EvaluationMainDashboard>();
  const [role, setRole] = useState<string>();
  const [departmentId, setDepartmentId] = useState<number>();
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const dispatch = useDispatch();
  // useAuthorization("dashboard");

  const [isInRange, setIsInRange] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsInRange(width >= 992 && width <= 1264);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    const userRole = Cookies.get("role");
    const departmentId = Cookies.get("departmentId");
    if (userRole) setRole(userRole);
    if (departmentId) setDepartmentId(parseInt(departmentId));
  }, []);

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    handleButtonClick(
      "dashboard",
      "https://www.youtube.com/watch?v=1wgAwCufsko&ab_channel=DirectorateGeneralMonitoringandEvaluation"
    );
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(EVALUATION_MAIN_DASHBOARD_API);
      setData(response.data.data);
      console.log("evaluation data:", response.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit();
  }, []);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  const [projectsData, setProjectsData] = useState<ProjectsList[]>();

  const getProjectsList = async (status: string) => {
    setProjectsData([]);
    console.log("status", status);
    console.log("get projects with combinedFilters", combinedFilters);
    try {
      if (activeFilter === "cmInitiative") {
        const response = await apiClient.post(
          `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
          [...cmInitiativeFilters, ...otherFilters]
        );
        setProjectsData(response.data.data);
      } else {
        const response = await apiClient.post(
          `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
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
    projectsData.length > 0 &&
    Object?.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          "cost",
          "revisedAllocation",
          "pnDReleases",
          "utilization",
          "utilPercent",
          role !== "Ministers" && "visitCount",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  const filteredNoOfProjectsKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          role !== "Ministers" && "visitCount",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          role !== "Ministers" && "deadline",
          "fileGenrated",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  // Filter and map keys
  const filteredKeys =
    projectsData &&
    projectsData.length > 0 &&
    Object.keys(projectsData[0])
      .filter((key) =>
        [
          "gSno",
          "projectName",
          "sectorName",
          "districtName",
          "userName",
          "reportCompletion",
          "visitStartDate",
          "completedDate",
          role !== "Ministers" && "deadline",
          "reportStatus",
          "statusDate",
        ].includes(key)
      )
      .map((key) => key as keyof ProjectsList);

  const [utilizationData, setUtilizationData] = useState<ProjectsList[]>([]);
  const [openUtilizationData, setOpenUtilizationData] = useState<
    ProjectsList[]
  >([]);

  useEffect(() => {
    getProjectsList("TotalProject");
  }, []);

  // useEffect(() => {
  //   if (projectsData) {
  //     const filteredProjects = projectsData?.filter((project) => {
  //       const utilizationPercentage =
  //         ((project.expUpToJune + project.utilization) / project.cost) * 100;
  //       return utilizationPercentage >= 20 && utilizationPercentage <= 80;
  //     });
  //     setUtilizationData(filteredProjects);
  //   }
  // }, [projectsData]);
  useEffect(() => {
    if (projectsData) {
      const updatedProjects = projectsData.map((project) => ({
        ...project,
        utilPercent: Math.round(
          ((project.expUpToJune + project.utilization) / project.cost) * 100
        ),
      }));

      setOpenUtilizationData(updatedProjects); // Store filtered projects with utilPercent

      // Now apply the filter based on computed utilPercent
      const filteredProjects = updatedProjects.filter(
        (project) => project.utilPercent >= 20 && project.utilPercent <= 80
      );

      setUtilizationData(filteredProjects); // Store filtered projects with utilPercent
    }
  }, [projectsData]);

  return (
    <DashboardWrapper>
      <>
        <div className={`row ${lexend.className} m-0`}>
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <CustomModal
              buttonColumn="col p-0"
              isFullscreen={true}
              modalId={"TotalProject"}
              button={
                <Button
                  className="position-relative btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("TotalProject")}
                >
                  <div
                    className="position-absolute"
                    style={{
                      // background:
                      //   "linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))",
                      padding: "1px",
                      borderRadius: "10px",
                      width: "98%",
                      height: "92%",
                    }}
                  ></div>
                  <Menu
                    background="linear-gradient(to right, #155E95 , #2377B6)"
                    icon="/icons/eyeBold.svg"
                    value={data ? data.totalSubmittedPCIvs : 0}
                    label="Submitted PC(IV)s"
                    showTides={false}
                    showArrow={true}
                    textWrap={false}
                    isGrouped={false}
                    toggleLabel={true}
                    sneCount={data ? data.snEs : 0}
                    nonSneCount={data ? data.nonSNEs : 0}
                  />
                </Button>
              }
              body={
                <>
                  <div className="container-fluid border-0 p-1">
                    {projectsData && filteredNoOfProjectsKeys ? (
                      <ProjectsTable
                        keys={filteredNoOfProjectsKeys}
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
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-4 p-0">
            <div
              className="col px-1 py-0 me-1 text-center mb-2"
              style={{
                background: "rgba(12, 140, 233,.2)",
                borderRadius: "10px",
                border: "1px solid rgba(12, 140, 233,.4)",
              }}
            >
              <p className="mb-0 text-white fs14px">Projects Evaluated</p>
              <div className="row m-0 d-flex">
                <CustomModal
                  buttonColumn="col p-0"
                  isFullscreen={true}
                  modalId={"noOfPCIV"}
                  button={
                    <Button
                      className="position-relative btn p-0 pe-1 shadow-none w-100"
                      onClick={() => getProjectsList("NoOfProject")}
                    >
                      <div
                        className="position-absolute"
                        style={{
                          // background:
                          //   "linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))",
                          padding: "1px",
                          borderRadius: "10px",
                          width: "98%",
                          height: "92%",
                        }}
                      ></div>
                      <Menu
                        background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                        icon="/icons/cubes.svg"
                        value={
                          data ? data.noOfVisitsMultipleSitesOrUmbrella : 0
                        }
                        label="No. of Visits (Umbrella)"
                        showTides={false}
                        showArrow={true}
                        textWrap={false}
                        isGrouped={true}
                        toggleLabel={true}
                        sneCount={
                          data
                            ? data.noOfVisitsMultipleSitesOrUmbrellaTotalSNEs
                            : 0
                        }
                        nonSneCount={
                          data
                            ? data.noOfVisitsMultipleSitesOrUmbrellaTotalNonSNEs
                            : 0
                        }
                      />
                    </Button>
                  }
                  body={
                    <>
                      <div className="container-fluid border-0 p-1">
                        {projectsData && filteredNoOfProjectsKeys ? (
                          <ProjectsTable
                            keys={filteredNoOfProjectsKeys}
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
                  buttonColumn="col p-0"
                  isFullscreen={true}
                  modalId={"noOfPCIV"}
                  button={
                    <Button
                      className="position-relative btn p-0 pe-1 shadow-none w-100"
                      onClick={() => getProjectsList("NoOfProject")}
                    >
                      {/* <div
                          className="position-absolute"
                          style={{
                            background:
                              "linear-gradient( rgba(163, 12, 233, 0), rgba(163, 12, 233, 0.2),rgba(163, 12, 233, 0.2))",
                            transition: "all .4s",
                            opacity: !isHover1 ? 1 : 0,
                            borderRadius: "10px",
                            width: "98%",
                            height: "92%",
                          }}
                        ></div> */}
                      <div
                        className="position-absolute"
                        style={{
                          // background:
                          //   "linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))",
                          padding: "1px",
                          borderRadius: "10px",
                          width: "98%",
                          height: "92%",
                        }}
                      ></div>
                      <Menu
                        background={`linear-gradient( rgba(35, 119, 182, 0), rgba(35, 119, 182, 1))`}
                        icon="/icons/cubes.svg"
                        value={data ? data.noOfVisitsSingle : 0}
                        label="No. of Visits (Single)"
                        showTides={false}
                        showArrow={true}
                        textWrap={false}
                        isGrouped={true}
                        toggleLabel={true}
                        sneCount={data ? data.noOfVisitsSingleTotalSNEs : 0}
                        nonSneCount={
                          data ? data.noOfVisitsSingleTotalNonSNEs : 0
                        }
                      />
                    </Button>
                  }
                  body={
                    <>
                      <div className="container-fluid border-0 p-1">
                        {projectsData && filteredNoOfProjectsKeys ? (
                          <ProjectsTable
                            keys={filteredNoOfProjectsKeys}
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
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <CustomModal
              buttonColumn="col p-0"
              isFullscreen={true}
              size="xl"
              modalId={"Successful"}
              allowOpen={data && data.successful === 0 ? false : true}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("OnTrack")}
                  disabled={data && data.successful === 0}
                >
                  <Menu
                    background="rgba(39, 192, 77, 0.35)"
                    outline="1px solid rgba(43, 171, 45, 0.4)"
                    icon="/icons/doubleTick.svg"
                    value={data ? data.successful : 0}
                    label="Successful"
                    showTides={false}
                    // tideOneImage="/images/tideOneGreen.png"
                    // tideTwoImage="/images/tideTwoGreen.png"
                    showArrow={true}
                    textWrap={false}
                    labelColor="#129E5C"
                  />
                </Button>
              }
              body={
                <>
                  <div className="container-fluid border-0 p-1">
                    {projectsData && filteredKeys ? (
                      <ProjectsTable
                        keys={filteredKeys}
                        label="Successful Projects"
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
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <CustomModal
              buttonColumn="col p-0"
              isFullscreen={true}
              size="xl"
              modalId={"PartialSuccess"}
              allowOpen={data && data.partiallySuccessful === 0 ? false : true}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("OffTrack")}
                  disabled={data && data.partiallySuccessful === 0}
                >
                  <Menu
                    background="rgba(218, 248, 21, 0.4)"
                    outline="1px solid rgba(225, 186, 15, 0.4)"
                    icon="/icons/bulb.svg"
                    value={data ? data.partiallySuccessful : 0}
                    label="Partial Success"
                    showTides={false}
                    // tideOneImage="/images/tideOneYellow.png"
                    // tideTwoImage="/images/tideTwoYellow.png"
                    showArrow={true}
                    textWrap={false}
                    labelColor="#AA8B2A"
                  />
                </Button>
              }
              body={
                <>
                  <div className="container-fluid border-0 p-1">
                    {projectsData && filteredKeys ? (
                      <ProjectsTable
                        keys={filteredKeys}
                        label="Partial Success Projects"
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
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <CustomModal
              buttonColumn="col p-0"
              isFullscreen={true}
              size="xl"
              modalId={"Not Successful"}
              allowOpen={data && data.notSuccessful === 0 ? false : true}
              button={
                <Button
                  className="btn p-0 pe-1 shadow-none w-100"
                  onClick={() => getProjectsList("Critical")}
                  disabled={data && data.notSuccessful === 0}
                >
                  <Menu
                    background="rgba(233, 12, 16, 0.26)"
                    outline="1px solid rgba(233, 12, 16, 0.4)"
                    icon="/icons/critical.svg"
                    value={data ? data.notSuccessful : 0}
                    label="Not Successful"
                    showTides={false}
                    // tideOneImage="/images/tideOneRed.png"
                    // tideTwoImage="/images/tideTwoRed.png"
                    showArrow={true}
                    textWrap={false}
                    labelColor="#BA2323"
                  />
                </Button>
              }
              body={
                <>
                  <div className="container-fluid border-0 p-1">
                    {projectsData && filteredKeys ? (
                      <ProjectsTable
                        keys={filteredKeys}
                        label="Not Successful Projects"
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
        <div className={`row ${lexend.className} m-0`}>
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <CustomModal
              buttonColumn="col p-0"
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
                    value={data ? data.reportsInProgress : 0}
                    label="Reports In Progress"
                    showTides={false}
                    showArrow={true}
                    textWrap={false}
                  />
                </Button>
              }
              body={
                <>
                  <div className="container-fluid border-0 p-1">
                    {projectsData && filteredKeys ? (
                      <ProjectsTable
                        keys={filteredKeys}
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
          </div>
          {departmentId !== 1 && (
            <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
              <CustomModal
                buttonColumn="col p-0"
                isFullscreen={true}
                size="xl"
                modalId={"dgme-reports"}
                button={
                  <Button
                    className="btn p-0 pe-1 shadow-none w-100"
                    onClick={() => getProjectsList("InProcess")}
                  >
                    <Menu
                      background="rgba(12, 140, 233, 0.2)"
                      outline="1px solid rgba(12, 140, 233, 0.4)"
                      icon="/icons/clarity-building-solid.svg"
                      value={0}
                      label="DGME Reports"
                      showTides={false}
                      showArrow={true}
                      textWrap={false}
                    />
                  </Button>
                }
                body={
                  <>
                    <div className="container-fluid border-0 p-1">
                      {projectsData && filteredKeys ? (
                        <ProjectsTable
                          keys={filteredKeys}
                          label="DGME Reports"
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
          )}
          <div className="col-12 col-sm-6 col-md-6 col-lg-2 p-0">
            <ReportReview />
          </div>
        </div>

        <div className={`row m-0 ${lexend.className}`}>
          <div
            className={`p-1 ${
              isInRange ? "col-lg-8" : "col-lg-9"
            } col-md-12 col-sm-12`}
          >
            {devMap && data && (
              <EvaluationMap
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
          <div
            className={`p-1 ${
              isInRange ? "col-lg-4" : "col-lg-3"
            } col-md-12 col-sm-12`}
          >
            {role !== "Ministers" && (
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
                  HeaderRightPos={20}
                  HeaderTopPos={5}
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
                      {projectsData &&
                        projectsData.length > 0 &&
                        pageLoaded && (
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
            )}
            {role !== "Ministers" && (
              <div
                className={`col mb-2 shadow-sm fs14px p-0 ${lexend.className}`}
                style={{
                  background:
                    "linear-gradient(to right, #C6D9F1,#C6D9F1 , #E3F1C6,#E3F1C6)",
                  borderRadius: "10px",
                }}
              >
                <div className={`row d-flex m-0 ${styles.hoverWrapper}`}>
                  <div className={`p-0 ${styles.hoverWrapper}`}>
                    <div className={styles.hoverItem}>
                      <Link
                        href="/vehicle-tracking"
                        target="_blank"
                        className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: "8px",
                          background: "#C6D9F1",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="me-2 ps-2">
                            <Image
                              src={carOutline}
                              alt="Vehicle Icon"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="text-start fw-5">
                            Vehicle Tracking
                          </div>
                        </div>
                      </Link>
                    </div>
                    <div className={`${styles.hoverItem}`}>
                      <Link
                        href="/staff-tracking"
                        target="_blank"
                        className="text-decoration-none text-dark h-100 d-flex align-items-center justify-content-center"
                        style={{
                          borderRadius: "8px",
                          background: "#E3F1C6",
                        }}
                      >
                        <div className="d-flex align-items-center justify-content-center">
                          <div className="me-2 ps-2">
                            <Image
                              src={staffTracking2}
                              alt="staffTracking2"
                              width={24}
                              height={24}
                            />
                          </div>
                          <div className="text-start">Staff Tracking</div>
                        </div>
                      </Link>
                    </div>
                    <div className={`${styles.hoverItem}`}>
                      <VisitsPlan
                        getProjectsList={getProjectsList}
                        projectsData={projectsData ? projectsData : []}
                        setProjectsData={setProjectsData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                        className="row d-flex m-0 justify-content-center align-items-center btn w-100 text-white text-nowrap fw-normal fs12px py-3 px-0 position-relative"
                        style={{
                          borderRadius: "8px",
                          background: "#155E95",
                          transition: "all .3s",
                        }}
                      >
                        <div className="col-auto px-1">
                          <Image
                            src={settingCircleArrow}
                            alt="settingCircleArrow"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="col-auto px-1">
                          <p className="mb-0">Utilization</p>
                          <p className="mb-0">
                            <span className="text-nowrap">(80% - 100%)</span>
                            &nbsp;
                            <span>{data?.utilization80OrAbove}</span>
                          </p>
                        </div>
                        {role === "Super Admin" ||
                        role === "Deputy Director" ||
                        role === "Director" ? (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id={`tooltip-top`}>
                                Utilization vs Schemes Visited by DGME&apos;Team
                              </Tooltip>
                            }
                          >
                            <span
                              className="col-auto position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs12px"
                              style={{ zIndex: 1 }}
                            >
                              {data && <AnimatedCounter from={0} to={0} />}
                              <span className="visually-hidden">
                                unread messages
                              </span>
                            </span>
                          </OverlayTrigger>
                        ) : (
                          ""
                        )}
                      </Button>
                    }
                    body={
                      <>
                        <div className="container-fluid border-0 p-1">
                          {projectsData && filteredCMADPKeys ? (
                            <ProjectsTable
                              keys={filteredCMADPKeys}
                              label="Utilization(80% - 100%)"
                              projectsData={utilizationData}
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

                {role !== "Ministers" && (
                  <div className="col-auto p-1">
                    <Link
                      target="_blank"
                      href="/report-analysis"
                      className="row d-flex flex-nowrap justify-content-center m-0 btn w-100 text-white fw-normal fs12px py-3 px-0"
                      style={{
                        borderRadius: "8px",
                        background: "#155E95",
                        transition: "all .3s",
                      }}
                    >
                      <div className="col-auto px-1">
                        <Image
                          src={reportAnalysis}
                          alt="reportAnalysis"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="col-auto px-1">
                        Report
                        <br />
                        Analysis
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    </DashboardWrapper>
  );
};

export default DashboardEvaluation;
