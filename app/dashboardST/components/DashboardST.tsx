"use client";
import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import Visits from "./Visits";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import ScheduleVisit from "./ScheduleVisit";
import MapCars from "./Map/MapCars";
import MapCarsRecorded from "./Map/MapCarsRecorded";
import Button from "@/app/components/Button";
import StaffMember from "./StaffMember";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const DashboardST = () => {
  const [mapStatus, setMapStatus] = useState(false);
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

  return (
    <div
      className={`container-fluid p-3 mt-3 mb-4 ${lexend.className}`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className="row mb-3 ms-2 me-2">
        <div className="col-lg-9 col-md-6 col position-relative">
          <div className="row">
            <div className="col">
              <div
                className="col position-absolute text-end"
                style={{ zIndex: 1, right: 23, top: 70 }}
              >
                <Button
                  className={`btn ps-2 pe-2 ${
                    mapStatus ? "btn-danger" : "btn-success"
                  }`}
                  onClick={() => setMapStatus(!mapStatus)}
                >
                  {mapStatus ? "Live" : "Recording"}
                </Button>
              </div>
              <div className="position-relative" style={{ zIndex: 0 }}>
                {mapStatus ? <MapCarsRecorded /> : <MapCars />}
              </div>
              <Visits />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col">
          <StaffMember />
          <ScheduleVisit />
        </div>
      </div>
    </div>
  );
};

export default DashboardST;
