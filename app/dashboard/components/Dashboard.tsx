"use client";
import ProjectsList from "@/app/projects/components/ProjectsList";
import Map from "./Map";
import Menu from "./Menu";
import Visits from "./Visits";
import { SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import ChartMenu from "./ChartMenu";
import VerticalComposedChart from "./VerticalComposedChart";
import SimplePieChart from "./SimplePieChart";
import SimpleBarChart from "./SimpleBarChart";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import SampleTable from "./SampleTable";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#7ABEF0";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      className="container-fluid p-3 mt-3 mb-4"
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "2px solid #dbdbdb",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className={`row ${lexend.className}`}>
        <div className="col-lg-9 col-md-6 col-sm-6">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Menu />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Map />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 col-sm-6">
          <ChartMenu />
          <SimpleBarChart />
          {/* <VerticalComposedChart /> */}
          <SimplePieChart />
          <div className="col">
            <Visits />
          </div>
        </div>
      </div>
      <div className="row ps-2 pe-2 mt-2">
        <div
          className="col text-center text-white rounded"
          style={{ background: "#0C8CE9" }}
        >
          <div className="row d-flex">
            <div className="col"></div>
            <div className="col">
              <p className="mt-3">List of projects</p>
            </div>
            <div className="col text-end">
              <button className="btn btn-light mt-2">
                Downloads
                <Image
                  src={downloadLineBlack}
                  alt="download"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
        <SampleTable refresh={refresh} setRefresh={setRefresh} />
      </div>
    </div>
  );
};

export default Dashboard;
