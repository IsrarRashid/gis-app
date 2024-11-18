"use client";
import { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import Drivers from "./Drivers";
import Vehicles from "./Vehicles";
import Destination from "./Destination";
import MapCars from "./Map/MapCars";
import MapCarsRecorded from "./Map/MapCarsRecorded";
import Button from "@/app/components/Button";
import useAuthorization from "@/app/hooks/useAuthorization";
import LiveCarTrackingMap from "./GoogleMap/LiveCarTrackingMap";
import RecordingCarTrackingMap from "./GoogleMap/RecordingCarTrackingMap";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const DashboardTO = () => {
  const [mapStatus, setMapStatus] = useState(false);
  const dispatch = useDispatch();
  useAuthorization("dashboardTO");

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#CFE6F8";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    handleButtonClick("DashboardTO");
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

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
      <div className={`row ${lexend.className}`}>
        <div className="col-lg-9 col-md-12 col position-relative">
          <div className="row">
            <div className="col">
              <div
                className="col position-absolute text-end"
                style={{ zIndex: 1, right: 23, top: 10 }}
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
                {/* {mapStatus ? <MapCarsRecorded /> : <MapCars />} */}
                {mapStatus ? (
                  <RecordingCarTrackingMap />
                ) : (
                  <LiveCarTrackingMap />
                )}
              </div>
              {/* <Destination /> */}
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col">
          <div className="row d-flex flex-lg-column">
            {/* <div className="col">
              <Drivers />
            </div> */}
            <div className="col">
              <Vehicles />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTO;
