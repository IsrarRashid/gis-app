"use client";
import ProjectsList from "@/app/projects/components/ProjectsList";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import ChartMenu from "./ChartMenu";
import Map from "./Map";
import Menu from "./Menu";
import Visits from "./Visits";
import { useState } from "react";
import Image from "next/image";
import coin from "../../../public/icons/coin.svg";
import locationPoint from "../../../public/icons/locationPoint.svg";
import files from "../../../public/icons/files.svg";
import pieChart from "../../../public/icons/pieChart.svg";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div
      className="container p-3 mt-3 mb-4"
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "2px solid #dbdbdb",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className="row">
        <div className="col-lg-9 col-md-10 col-sm-6 border">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Menu />
            </div>
            <div className="col-lg-12 col-md-12 col-sm-12">
              <Map />
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="row d-flex flex-column">
            <div
              className="col p-4 shadow-sm"
              style={{ background: "#C6D9F1", borderRadius: "15px" }}
            >
              <div className="row d-flex">
                <div className="col-2">
                  <Image src={locationPoint} alt="locationPoint" />
                </div>
                <div className="col">
                  <p
                    className="fw-bold pb-2"
                    style={{ borderBottom: "1px dashed #97ABBD" }}
                  >
                    Lahore Ring Road - Southern Loop (SL-3)
                  </p>
                </div>
              </div>

              <div className="row d-flex">
                <div className="col-2">
                  <Image src={coin} alt="coin" />
                </div>
                <div className="col">
                  <p>
                    <span className="fw-bold">Approved Cost:</span>{" "}
                    <span className="fw-bold" style={{ color: "#727272" }}>
                      17,785.8 M
                    </span>
                  </p>
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-2">
                  <Image src={files} alt="files" />
                </div>
                <div className="col">
                  <p>
                    <span className="fw-bold">Expenditure:</span>{" "}
                    <span className="fw-bold" style={{ color: "#727272" }}>
                      14,797 M
                    </span>
                  </p>
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-2">
                  <Image src={files} alt="files" />
                </div>
                <div className="col">
                  <p>
                    <span className="fw-bold">Progress:</span>{" "}
                    <span className="fw-bold" style={{ color: "#727272" }}>
                      80%
                    </span>
                  </p>
                </div>
              </div>

              <ChartMenu />
            </div>
            <div className="col">
              <Chart1 />
            </div>
            <div className="col">
              <Chart2 />
            </div>
            <div className="col">
              <Visits />
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col text-center">
          <p>List of projects</p>
          {/* <ProjectsList refresh={false} setRefresh={setRefresh} /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
