"use client";

import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import Visits from "./Visits";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import VehicleTracking from "./VehicleTracking";
import StaffTracking from "./StaffTracking";
import Reports from "./Reports";
import VisitDate from "./VisitDate";
import BottomArea from "./BottomArea";
import DistributedColumnChart from "./DistributedColumnChart";
import SimplePieChart from "./SimplePieChart";
import apiClient from "@/app/services/api-client";
import { singleProjectDashboardAPI } from "@/app/APIs";
// import Menu from "./Menu";
import Map from "./Map/Map";
import Menu from "@/app/components/Menu";
import useAuthorization from "@/app/hooks/useAuthorization";
import UpdateMap from "./Map/UpdateMap";
import MyMap from "./GoogleMap/MyMap";
import Header from "./Header";
import WBSReport from "./WBSReport";
import { devMap } from "@/app/utils";
import LineChart from "./SimpleLineChart";
import SimpleLineChart from "./SimpleLineChart";
import WBSGroupFlow from "./WBSFlow/WBSGroupFlow";
import WBSAttributesFlow from "./WBSFlow/WBSAttributesFlow";
import WBSReportUpdated from "./WBSReportUpdated";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
import CustomModal from "@/app/components/CustomModal";
import Button from "@/app/components/Button";
import MonitoringRatingIndex from "./MonitoringRatingIndex";

export interface VehicleTrackings {
  visitId: number;
  projectName: string;
  officerName: string;
  officerPicture: string;
  vehicalNumber: string;
  vehicalPicture: string;
  driverName: string;
  driverPicture: string;
  startingDistrict: string;
  endDistrict: string;
  startLat: string;
  endLat: string;
  startLong: string;
  endLong: string;
  visitStatus: string;
}

export interface StaffTrackings {
  userId: number;
  userName: string;
  designation: string;
  phoneNumber: string;
  userPicture: string;
  projectName: string;
  districtName: string;
  planStartDate: string;
  planEndDate: string;
  visitStartTime: string;
  visitEndTime: string;
  carNumber: string;
  carPicture: string;
  driverName: string;
  status: string;
  startAddressLat: string;
  startAddressLong: string;
  endAddressLat: string;
  endAddressLong: string;
  coordinates: [
    {
      id: number;
      visitID: number;
      userID: number;
      latitude: string;
      longitude: string;
      visit_status: string;
      createdAt: string;
    }
  ];
}

export interface ReportsData {
  reportPath: string;
}

export interface Attributes {
  attributeId: number;
  attributeDataType: string;
  multiselect: number;
  label: string;
  validationRegx: string;
  min: number;
  max: number;
  required: number;
  status: number;
  hidden: number;
  createdAt: string;
  updatedAt: string;
  placeholder: string;
  attributeType: string;
  unit: string;
  parentId: number;
  errorMessage: string;
  verificationContent: string;
  verificatioContentPath: string;
  verificationType: string;
  options: [
    {
      id: number;
      attributeId: number;
      value: string;
      sortId: number;
      isActive: number;
      createdAt: string;
      updatedAt: string;
      label: string;
    }
  ];
  value: string;
  values: [
    {
      id: number;
      attributeId: number;
      attributeGrpId: number;
      projectId: number;
      visitId: number;
      value: string;
      createdAt: string;
      updatedAt: string;
      verificatioContentPath: string;
      weightage: number;
      remarks: string;
      latitude: string;
      longitude: string;
    }
  ];
  evaluationFormula: string;
  evaluationFormulaWeightage: number;
  remarks: string;
  weightage: number;
  readOnly: number;
  sortId: number;
  attributeCode: string;
  smdpIdentifier: string;
}

export interface Groups {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  group: Groups[];
  attributes: Attributes[];
}

export interface SingleProjectDashboard {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: Groups[];
  vehicalTrackings: VehicleTrackings[];
  staffTrackings: StaffTrackings[];
  accumulativePC1Cost: number;
  reports: [
    {
      reportPath: string;
    }
  ];
}

// export interface SingleProjectDashboard {
//   projectId: number;
//   projectName: string;
//   projectLat: string;
//   projectlong: string;
//   lastVisitTime: string;
//   plannedProgress: number;
//   achievedProgress: number;
//   financalProgress: number;
//   allocation: number;
//   releases: number;
//   utilization: number;
//   vehicalTrackings: VehicleTrackings[];
//   staffTrackings: StaffTrackings[];
//   reports: ReportsData[];
// }

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

interface Props {
  id: string;
  visitId: number;
}

const ProjectDetailsDashboard = ({ id, visitId }: Props) => {
  const [data, setData] = useState<SingleProjectDashboard>();
  const dispatch = useDispatch();
  useAuthorization("projectDetailsDashboard");
  const [physicalVsPlanned, setPhysicalVsPlanned] = useState<number>();
  const [achievedVsFinancial, setAchievedVsFinancial] = useState<number>();

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
      "projectDetailsDashboard",
      "https://www.youtube.com/watch?v=YsnLey9JCc4&ab_channel=DirectorateGeneralMonitoringandEvaluation"
    );
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  const handleSubmit = async (projectId: number, visitId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}&visitId=${visitId}`
      );
      setData(response.data.data);
      console.log(
        `check now: projectid=${projectId}&visit=${visitId}`,
        response
      );
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(parseInt(id), visitId);
  }, [id]);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  const [projectRating, setProjectRating] = useState<number>(0);
  const [cpi, setCpi] = useState<number>(0);
  const [spi, setSpi] = useState<number>(0);

  const getCPIAndSPI = () => {
    if (data) {
      const spi: string | undefined = data?.groups
        .find((group) => group.name === "Earned Value Analysis")
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("spi")
        )?.values[0]?.value;

      const cpi: string | undefined = data?.groups
        .find((group) => group.name === "Earned Value Analysis")
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes("cpi")
        )?.values[0]?.value;

      if (cpi) {
        setCpi(parseFloat(cpi));
      }
      if (spi) {
        setSpi(parseFloat(spi));
      }
    }
  };

  const searchMonitoringRatingIndex = (
    parentGroupName: string,
    groupName: string,
    attributeName: string
  ) => {
    if (data) {
      const value = data.groups
        .find((group) => group.name.toLowerCase().includes(parentGroupName))
        ?.group.find((group) => group.name.toLowerCase().includes(groupName))
        ?.attributes.find((attribute) =>
          attribute.label.toLowerCase().includes(attributeName)
        )?.values[0]?.value;
      if (value) {
        return parseInt(value);
      }
    }
  };

  useEffect(() => {
    if (data) {
      setProjectRating(
        searchMonitoringRatingIndex(
          "rating index",
          "performance",
          "project rating"
        )!
      );
      getCPIAndSPI();

      const physicalProgressVsPlannedProgress = data.groups
        .find((group) => group.name.toLowerCase().includes("progress analysis"))
        ?.attributes.filter(
          (attribute) =>
            attribute.label.toLowerCase() ===
            "physical progress vs planned progress"
        )[0];

      if (physicalProgressVsPlannedProgress?.values[0]?.value) {
        setPhysicalVsPlanned(
          parseFloat(physicalProgressVsPlannedProgress?.values[0]?.value)
        );
      }

      console.log("physicalVsPlanned:", physicalVsPlanned);

      const achievedProgressVsFinancialProgress = data.groups
        .find((group) => group.name.toLowerCase().includes("progress analysis"))
        ?.attributes.filter(
          (attribute) =>
            attribute.label.toLowerCase() ===
            "achieved progress vs financial progress"
        )[0];

      if (achievedProgressVsFinancialProgress) {
        setAchievedVsFinancial(
          parseFloat(achievedProgressVsFinancialProgress?.values[0]?.value)
        );
      }
      console.log("achievedVsFinancial:", achievedVsFinancial);
    }
  }, [data]);

  useEffect(() => {
    console.log("check id", id);
    console.log("check visit", visitId);
  }, [id, visitId]);

  return (
    <div
      className={`container-fluid p-1 mb-4 ${lexend.className}`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {data && (
        <>
          <Header data={data} />
          <div className="row d-flex flex-wrap m-0 mb-3">
            <div className="col-lg-4 col-md-12 col-sm-12">
              <DistributedColumnChart
                data={data}
                spi={spi}
                cpi={cpi}
                projectRating={projectRating}
              />
            </div>
            <div
              className="col-lg-4 col-md-12 col-sm-12 p-2 bg-color-matte-light-blue"
              style={{ borderRadius: "17px", height: "100%" }}
            >
              <div className="row d-flex m-0">
                <div className="col">
                  <p className="fw-bold fs24px p-1 pt-0 m-0">
                    Physical Progress
                  </p>
                </div>
                <div className="col">
                  <p className="fw-bold fs24px p-1 pt-0 m-0">
                    Financial Progress
                  </p>
                </div>
              </div>
              <div className="row d-flex flex-wrap m-0">
                <div className="col-6 p-1 pb-0">
                  {data.groups
                    .find((group) =>
                      group.name.toLowerCase().includes("progress analysis")
                    )
                    ?.attributes.filter(
                      (attribute) =>
                        attribute.hidden === 0 &&
                        attribute.label.toLowerCase() !==
                          "financial progress" &&
                        attribute.label.toLowerCase() !==
                          "achieved progress vs financial progress"
                    )
                    .map((attribute: any) => (
                      <Menu
                        key={attribute.attributeId}
                        outline="1px solid rgba(232, 192, 15, 0.4)"
                        background="rgba(12, 140, 233,.5)"
                        // icon="/icons/archery.svg"
                        value={Math.round(
                          parseFloat(attribute.values[0]?.value)
                        )}
                        label={
                          attribute.label.toLowerCase() ===
                          "physical progress vs planned progress"
                            ? parseFloat(attribute.values[0]?.value) <= 0
                              ? "Lag in Physical Progress"
                              : "Lead in Physical Progress"
                            : attribute.label
                        }
                        showTides={true}
                        tideOneImage="/images/tideOne.png"
                        tideTwoImage="/images/tideTwo.png"
                        showPercentageSign={true}
                      />
                    ))}
                </div>
                <div className="col-6 p-1 pb-0">
                  {data.groups
                    .find((group) =>
                      group.name.toLowerCase().includes("progress analysis")
                    )
                    ?.attributes.filter(
                      (attribute) =>
                        attribute.hidden === 0 &&
                        attribute.label.toLowerCase() !== "planned progress" &&
                        attribute.label.toLowerCase() !== "achieved progress" &&
                        attribute.label.toLowerCase() !==
                          "physical progress vs planned progress"
                    )
                    .map((attribute) => (
                      <Menu
                        key={attribute.attributeId}
                        outline="1px solid rgba(232, 192, 15, 0.4)"
                        background="rgba(240, 175, 25,1)"
                        // icon="/icons/archery.svg"
                        value={Math.round(
                          parseFloat(attribute.values[0]?.value)
                        )}
                        label={
                          attribute.label.toLowerCase() ===
                          "achieved progress vs financial progress"
                            ? parseFloat(attribute.values[0]?.value) <= 0
                              ? "Lag in Financial Progress"
                              : "Lead in Financial Progress"
                            : attribute.label
                        }
                        showTides={true}
                        tideOneImage="/images/tideOne.png"
                        tideTwoImage="/images/tideTwo.png"
                        showPercentageSign={true}
                      />
                    ))}
                  <ul className="list-group fs14px ">
                    <li className="list-group-item bg-transparent border-0 p-1">
                      <div className="d-flex">
                        <div
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "rgba(12, 140, 233,.5)",
                            marginTop: "6px",
                          }}
                        >
                          &nbsp;
                        </div>
                        <div className="col ps-1">
                          {physicalVsPlanned && physicalVsPlanned <= 0
                            ? "Lag in Achieved Physical Progress V/S Planned Physical Progress"
                            : "Ahead in Achieved Physical Progress V/S Planned Physical Progress"}
                        </div>
                      </div>
                    </li>
                    <li className="list-group-item bg-transparent border-0 p-1">
                      <div className="d-flex">
                        <div
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            background: "rgba(240, 175, 25,1)",
                            marginTop: "6px",
                          }}
                        >
                          &nbsp;
                        </div>
                        <div className="col ps-1">
                          {achievedVsFinancial && achievedVsFinancial <= 0
                            ? "Lag in Achieved Physical Progress V/S Achieved Financial Progress"
                            : "Lead in Achieved Physical Progress V/S Achieved Financial Progress"}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div className="row d-flex m-0 mb-1">
                <CustomModal
                  size="lg"
                  modalId="detailAnalysis"
                  button={
                    <Button className="btn p-0 pe-2 w-100 shadow-none">
                      <Menu
                        background={
                          projectRating > 70
                            ? "linear-gradient(to bottom right, rgba(115, 255, 64,1) , rgba(79, 227, 20,1), rgba(89, 230, 19,1),rgba(72, 223, 17,1),rgba(163, 197, 11,1))"
                            : projectRating <= 70 && projectRating >= 35
                            ? "linear-gradient(to bottom right, rgba(255, 236, 64,1), rgba(227, 227, 20,1), rgba(230, 226, 19,1),rgba(219, 223, 17,1),rgba(197, 191, 11,1))"
                            : projectRating < 35
                            ? "linear-gradient(to bottom right, rgba(255, 64, 64,1) , rgba(227, 20, 20,1), rgba(230, 19, 19,1),rgba(223, 17, 17,1),rgba(197, 11, 11,1))"
                            : ""
                        }
                        outline={
                          projectRating > 70
                            ? "1px solid rgba(50, 179, 52, 0.4)"
                            : projectRating <= 70 && projectRating >= 35
                            ? "1px solid rgba(232, 192, 15, 0.4)"
                            : projectRating < 35
                            ? "1px solid rgba(233, 12, 16, 0.4)"
                            : ""
                        }
                        value={projectRating}
                        label={
                          projectRating > 70
                            ? "MRI (Good)"
                            : projectRating <= 70 && projectRating >= 35
                            ? "MRI (Average)"
                            : projectRating < 35
                            ? "MRI (Critical)"
                            : ""
                        }
                        showTides={false}
                        tideOneImage={
                          projectRating > 70
                            ? "/images/tideOneGreen.png"
                            : projectRating <= 70 && projectRating >= 35
                            ? "/images/tideOneYellow.png"
                            : projectRating < 35
                            ? "/images/tideOneRed.png"
                            : "/images/tideOne.png"
                        }
                        tideTwoImage={
                          projectRating > 70
                            ? "/images/tideTwoGreen.png"
                            : projectRating <= 70 && projectRating >= 35
                            ? "/images/tideTwoYellow.png"
                            : projectRating < 35
                            ? "/images/tideTwoRed.png"
                            : "/images/tideTwo.png"
                        }
                      />
                    </Button>
                  }
                  body={
                    <div
                      className="container-fluid border border-white p-3 bg-white"
                      style={{
                        borderRadius: "20px",
                      }}
                    >
                      {data.groups.find((group) =>
                        group.name
                          .toLowerCase()
                          .includes("monitoring rating index")
                      ) && (
                        <MonitoringRatingIndex
                          group={
                            data.groups.find((group) =>
                              group.name
                                .toLowerCase()
                                .includes("monitoring rating index")
                            )!
                          }
                        />
                      )}
                    </div>
                  }
                />

                <div
                  className="col text-center shadow-sm mb-2 p-0 me-2"
                  style={{
                    background: `${
                      spi > 1
                        ? "linear-gradient(to bottom left, #329c1c , #28ad0e, #21a315,#31991a,#1c9e08)"
                        : spi === 1
                        ? "linear-gradient(to bottom left, #a3ff40 , #b3e314, #a7e613,#9adf11,#93c50b)"
                        : "linear-gradient(to bottom left, #ff4040 , #e31414, #e61313,#df1111,#c50b0b)"
                    }`,
                    borderRadius: "10px",
                  }}
                >
                  <div className="col py-3">
                    <p className="m-0 fw-bold fs22px text-white">SPI= {spi}</p>
                    {spi > 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">
                          No Time Overrun
                        </p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          SPI &gt; 1
                        </p>
                      </>
                    )}
                    {spi < 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">
                          Time Overrun
                        </p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          SPI &lt; 1
                        </p>
                      </>
                    )}
                    {spi === 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">On Time</p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          SPI === 1
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="col text-center shadow-sm mb-2 p-0"
                  style={{
                    background: `${
                      cpi > 1
                        ? "linear-gradient(to bottom left, #329c1c , #28ad0e, #21a315,#31991a,#1c9e08)"
                        : cpi === 1
                        ? "linear-gradient(to bottom left, #a3ff40 , #b3e314, #a7e613,#9adf11,#93c50b)"
                        : "linear-gradient(to bottom left, #ff4040 , #e31414, #e61313,#df1111,#c50b0b)"
                    }`,
                    borderRadius: "10px",
                  }}
                >
                  <div className="col py-3">
                    <p className="m-0 fw-bold fs22px text-white">CPI= {cpi}</p>
                    {cpi > 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">
                          No Cost Overrun
                        </p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          CPI &gt; 1
                        </p>
                      </>
                    )}
                    {cpi < 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">
                          Cost Overrun
                        </p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          CPI &lt; 1
                        </p>
                      </>
                    )}
                    {cpi === 1 && (
                      <>
                        <p className="m-0 fw-normal fs-6 text-white">On Cost</p>
                        <p className="m-0 fw-normal fs-6 text-white">
                          CPI &gt; 1
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col">
                <SimpleLineChart data={data} />
              </div>
            </div>
          </div>
          <div
            className="d-flex col p-0 m-0 mb-3 justify-content-center"
            style={{ overflow: "hidden", overflowX: "scroll" }}
          >
            <div className="col-lg-3 col-md-12 col-sm-12 pe-2">
              <SimplePieChart
                data={data}
                financialAnalysis={
                  data.groups.find((group) =>
                    group.name.toLowerCase().includes("financial analysis")
                  )!
                }
                projectProfile={
                  data.groups.find((group) =>
                    group.name.toLowerCase().includes("project profile")
                  )!
                }
              />
            </div>
          </div>

          <div className="row">
            <div className="col ps-4 pe-4 mb-3">
              {devMap && (
                <MyMap
                  data={
                    data.groups.find((group) =>
                      group.name.toLowerCase().startsWith("observation")
                    )!
                  }
                />
              )}
            </div>
          </div>
          {data.groups && (
            <WBSReportUpdated
              majorDeliverables={
                data.groups.find((group) =>
                  group.name.toLowerCase().includes("major deliverable")
                )!
              }
            />
          )}
          <VehicleTracking data={data.vehicalTrackings} />
          <div
            className="row mb-3"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            <div className="col-lg-8 col-md-12 col">
              <StaffTracking data={data.staffTrackings} />
            </div>
            <div className="col-lg-4 col-md-12 col ps-0">
              <Reports
                reports={data.reports}
                observations={
                  data.groups.find(
                    (group) => group.name === "Observation & Recommendations"
                  )!
                }
              />
            </div>
          </div>
          {/* <BottomArea /> */}
        </>
      )}
    </div>
  );
};

export default ProjectDetailsDashboard;
