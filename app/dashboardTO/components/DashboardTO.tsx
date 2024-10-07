"use client";
import Map from "./Map";
import { useEffect, useState } from "react";
import { Lexend } from "next/font/google";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import Drivers from "./Drivers";
import Vehicles from "./Vehicles";
import Destination from "./Destination";
import MapCars from "./MapCars";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const DashboardTO = () => {
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();

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
      className="container-fluid p-3 mt-3 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className={`row ${lexend.className}`}>
        <div className="col-lg-9 col-md-12 col">
          <div className="row">
            <div className="col-lg-12 col-md-12 col">
              {/* <Map /> */}
              <MapCars />

              <Destination />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col">
          <div className="row d-flex flex-lg-column">
            <div className="col">
              <Drivers />
            </div>
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
