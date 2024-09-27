"use client";
import Map from "./Map";
import Menu from "./Menu";
import Visits from "./Visits";
import { useEffect, useState } from "react";
import Image from "next/image";
import ChartMenu from "./ChartMenu";
import SimplePieChart from "./SimplePieChart";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import SampleTable from "./SampleTable";
import { Lexend } from "next/font/google";
import { useDispatch } from "react-redux";
import { setContent } from "@/app/features/content/contentSlice";
import DistributedColumnChart from "./DistributedColumnChart";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const Dashboard = () => {
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

    handleButtonClick("Dashboard");
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
              <Menu />
            </div>
            <div className="col-lg-12 col-md-12 col">
              <Map />
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-12 col">
          <ChartMenu />
          {/* <SimpleBarChart /> */}
          <DistributedColumnChart />
          {/* <VerticalComposedChart /> */}
          <SimplePieChart />
          <div className="col">
            <Visits />
          </div>
        </div>
      </div>
      <div className="row ps-2 pe-2 mt-2">
        <div className="col text-center text-white rounded bg-color-sea-blue">
          <div className="row d-flex">
            <div className="col"></div>
            <div className="col" style={{ marginTop: "10px" }}>
              <p className="m-0 fs12px fw-bold">List of projects</p>
            </div>
            <div className="col text-end mt-1 mb-1">
              <button className="btn btn-sm btn-light">
                Downloads &nbsp;
                <Image
                  src={downloadLineBlack}
                  alt="download"
                  width={12}
                  height={15}
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
