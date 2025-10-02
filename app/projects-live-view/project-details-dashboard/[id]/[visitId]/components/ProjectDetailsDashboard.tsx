"use client";

import { SINGLE_PROJECT_DASHBOARD_API } from "@/app/APIs";
import { setContent } from "@/app/features/content/contentSlice";
import apiClient from "@/app/services/api-client";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import DistributedColumnChart from "./DistributedColumnChart";
// import SimplePieChart from "./SimplePieChart";
// import Menu from "./Menu";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal";
import Menu from "@/app/components/Menu";
import { setTutorial } from "@/app/features/tutorial/tutorialSlice";
import { devMap } from "@/app/utils";
// import SimpleLineChart from "./SimpleLineChart";
// import WBSReportUpdated from "./WBSReportUpdated";
import dynamic from "next/dynamic";
import useAuthorization from "@/app/hooks/useAuthorization";
import Loader from "@/app/components/Loader";
import Reports from "@/app/project-details-dashboard/components/Reports";
import Header from "@/app/project-details-dashboard/components/Header";
import MonitoringRatingIndex from "@/app/project-details-dashboard/components/MonitoringRatingIndex";
import MyMap from "@/app/project-details-dashboard/components/GoogleMap/MyMap";
import WBSSummary from "@/app/project-details-dashboard/components/WBSFlow/WBSSummary";
import VehicleTracking from "@/app/project-details-dashboard/components/VehicleTracking";
import StaffTracking from "@/app/project-details-dashboard/components/StaffTracking";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGridFourBold } from "react-icons/pi";

const DistributedColumnChart = dynamic(
  () =>
    import("@/app/project-details-dashboard/components/DistributedColumnChart"),
  { ssr: false }
);

const SimplePieChart = dynamic(
  () => import("@/app/project-details-dashboard/components/SimplePieChart"),
  {
    ssr: false,
  }
);

const WBSReportUpdated = dynamic(
  () => import("@/app/project-details-dashboard/components/WBSReportUpdated"),
  {
    ssr: false,
  }
);

const SimpleLineChart = dynamic(
  () => import("@/app/project-details-dashboard/components/SimpleLineChart"),
  {
    ssr: false,
  }
);

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

export interface DetailedAnalysis {
  attributeName: string;
  visitDate: string;
  officerName: string;
  location: string;
  contractorName: string;
  reName: string;
  actualPlannedProject: string;
  actualFinancialProgress: string;
  actualPhysicalProgress: string;
  overallEarnValue: string;
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
  reports: {
    reportPath: string;
  }[];
  reportsCount: number;
  detailAnalysis: DetailedAnalysis[];
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

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Props {
  id: string;
  visitId: number;
}

const ProjectDetailsDashboard = ({ id, visitId }: Props) => {
  const [data, setData] = useState<SingleProjectDashboard>();
  const [gsNo, setGsNo] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  useAuthorization("project-details-dashboard");
  const [physicalVsPlanned, setPhysicalVsPlanned] = useState<number>();
  const [achievedVsFinancial, setAchievedVsFinancial] = useState<number>();

  const handleButtonClick = (content: string, tutorialLink: string) => {
    dispatch(setContent(content));
    dispatch(setTutorial(tutorialLink));
  };

  useEffect(() => {
    handleButtonClick(
      "projectDetailsDashboard",
      "https://www.youtube.com/watch?v=PDHSsWfMhNM&ab_channel=DirectorateGeneralMonitoringandEvaluation"
    );
  }, []);

  const handleSubmit = async (projectId: number, visitId: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}&visitId=${visitId}`
      );
      setData(response.data.data);
      console.log(
        `check now: projectid=${projectId}&visit=${visitId}`,
        response
      );
      setLoading(false);
    } catch (err) {
      console.error("Submission error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSubmit(parseInt(id), visitId);
  }, [id]);

  useEffect(() => {
    console.log("dashboard api", data);
    if (data) {
      const projectProfile = data.groups
        .find((d) => d.name === "Project Profile")!
        .attributes?.filter((attribute) =>
          attribute.label.toLowerCase().includes("gs no")
        );

      console.log("projectProfile", projectProfile);

      if (projectProfile) {
        setGsNo(projectProfile[0].values[0].value);
      }
    }
  }, [data]);

  const [projectRating, setProjectRating] = useState<number>(0);
  const [cpi, setCpi] = useState<number>(0);
  const [spi, setSpi] = useState<number>(0);

  const PLANNED_PHYSICAL_PROGRESS = "planned physical progress";
  const ACTUAL_PHYSICAL_PROGRESS = "actual physical progress";
  const PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS =
    "planned physical progress\n vs actual physical progress";

  const ACTUAL_FINANCIAL_PROGRESS = "actual financial progress";
  const ACTUAL_PHYSICAL_VS_ACTUAL_FINANCIAL_PROGRESS =
    "actual physical progress vs actual financial progress";

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
            PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS
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
            ACTUAL_PHYSICAL_VS_ACTUAL_FINANCIAL_PROGRESS
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

  useEffect(() => {
    if (data) {
      const filteredAttributes = data.groups.find((group) =>
        group.name?.toLowerCase().includes("progress analysis")
      )?.attributes[5];

      console.log("Filtered attributes: ", filteredAttributes);
      console.log(
        "lowercase attributes:",
        filteredAttributes?.label.toLowerCase()
      );
      console.log(
        "lowercase attributes trim:",
        filteredAttributes?.label.trim().toLowerCase()
      );
      console.log(
        "decimal value",
        parseFloat(filteredAttributes?.values[0]?.value!)
      );
    }
  }, [data]);

  // useEffect(() => {
  //   if (data) {
  //     const wbsData = data.groups.filter((group) =>
  //       group.name.toLowerCase().includes("work breakdown structure")
  //     );

  //     const filteredAttributes = data.groups.find((group) =>
  //       group.name?.toLowerCase().includes("progress analysis")
  //     )?.attributes[5];
  //   }
  // }, [data]);

  const [showAllWbs, setShowAllWbs] = useState(false);
  return (
    <>
      {/* {isLoading && <Loader />} */}
      <div
        className="col"
        style={{
          background: "#1D1F25",
          padding: "132px 265px 133px 265px",
          borderRadius: "179px",
        }}
      >
        <div className="row d-flex align-items-center justify-content-between">
          <div className="col-auto">
            <span
              className="badge rounded-pill fw-bold"
              style={{
                fontSize: "7.25rem",
                padding: "66px 133px",
                background: "#141518",
              }}
            >
              Vehicle Tracking
            </span>
          </div>
          <div className="col-auto">
            <div className="btn-group" role="group" aria-label="Basic example">
              <Button
                className="btn rounded-end rounded-pill text-white"
                style={{
                  background: "#141518",
                  border: "8px solid #1D1F25",
                  padding: "99px 166px",
                }}
              >
                <GiHamburgerMenu size={199} />
              </Button>
              <Button
                className="btn rounded-start rounded-pill text-white"
                style={{
                  background: "#141518",
                  border: "8px solid #1D1F25",
                  padding: "99px 166px",
                }}
              >
                <PiGridFourBold size={199} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsDashboard;
