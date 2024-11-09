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
  projectName: string;
  staffName: string;
  staffnumber: string;
  staffImage: string;
  visitDate: string;
  startingLat: string;
  endingLat: string;
  startTime: string;
  endTime: string;
}

export interface ReportsData {
  reportPath: string;
}

export interface SingleProjectDashboard {
  projectId: number;
  projectName: string;
  projectLat: string;
  projectlong: string;
  lastVisitTime: string;
  plannedProgress: number;
  achievedProgress: number;
  financalProgress: number;
  allocation: number;
  releases: number;
  utilization: number;
  vehicalTrackings: VehicleTrackings[];
  staffTrackings: StaffTrackings[];
  reports: ReportsData[];
}

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

interface Props {
  id: string;
}

const ProjectDetailsDashboard = ({ id }: Props) => {
  const [data, setData] = useState<SingleProjectDashboard>();
  const dispatch = useDispatch();
  useAuthorization("projectDetailsDashboard");

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

  const handleSubmit = async (projectId: number) => {
    try {
      const response = await apiClient.get(
        `${singleProjectDashboardAPI}?projectid=${projectId}`
      );
      setData(response.data.data);
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    handleSubmit(parseInt(id));
  }, [id]);

  useEffect(() => {
    console.log("dashboard api", data);
  }, [data]);

  return (
    <div
      className={`container-fluid p-3 mb-4 ${lexend.className}`}
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
          <div className="row mb-3 ms-2 me-2">
            {/* <div className="col-lg-3 col-md-6 col">
              <Visits data={data} />
            </div> */}
            <div className="col ps-4">
              <div className="row d-flex">
                <Menu
                  background="linear-gradient(to bottom right, #FFEC40 , #A5E314, #D1E613,#DBDF11,#A3C50B)"
                  icon="/icons/eyeBold.svg"
                  value={59}
                  label="Need Consideration"
                  showTides={false}
                />
                <Menu
                  outline="1px solid rgba(12, 140, 233, 0.4)"
                  background="rgba(12, 140, 233, 0.2)"
                  icon="/icons/archery.svg"
                  value={data.achievedProgress}
                  label="Achieved Progress"
                  showTides={true}
                />
                <Menu
                  outline="1px solid rgba(50, 179, 52, 0.4)"
                  background="rgba(12, 140, 233,.5)"
                  icon="/icons/meter.svg"
                  value={Math.round(data?.plannedProgress)}
                  label="Planned Progress"
                  showTides={true}
                />
                <Menu
                  outline="1px solid rgba(232, 192, 15, 0.4)"
                  background="rgba(12, 140, 233,.5)"
                  icon="/icons/levelUp.svg"
                  value={Math.round(data?.financalProgress)}
                  label="Financial Progress"
                  showTides={true}
                />
              </div>
            </div>
          </div>
          <div className="row mb-3 ms-2 me-2">
            <div className="col-lg-5 col-md-12 col">
              <SimplePieChart data={data} />
            </div>
            <div className="col-lg-7 col-md-12 col">
              <DistributedColumnChart />
            </div>
          </div>
          <div className="row">
            <div className="col ps-4 pe-4 mb-3">
              {/* <Map data={data} /> */}
              <UpdateMap data={data} />
            </div>
          </div>
          <VehicleTracking data={data.vehicalTrackings} />
          <div
            className="row mb-3"
            style={{ marginLeft: "0px", marginRight: "0px" }}
          >
            <div className="col-lg-6 col-md-12 col">
              <StaffTracking data={data.staffTrackings} />
            </div>
            <div className="col-lg-6 col-md-12 col ps-0">
              <div className="row d-flex">
                <div className="col-lg-6 col-md-6 col-sm-12 p-0">
                  <Reports data={data.reports} />
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 p-0">
                  <VisitDate data={data.staffTrackings} />
                </div>
              </div>
            </div>
          </div>
          {/* <BottomArea /> */}
        </>
      )}
    </div>
  );
};

export default ProjectDetailsDashboard;
