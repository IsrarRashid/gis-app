"use client";
import useAuthorization from "@/app/hooks/useAuthorization";
import { useEffect, useState } from "react";
import UserProjectsList from "./UserProjectsList";
import VisitsList from "./VisitsList";
import Menu from "@/app/components/Menu";
import Image from "next/image";

const Dashboard = () => {
  useEffect(() => {
    // Set the background for the body
    document.body.style.backgroundImage = `url('/images/bg2.png')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      className={"container p-3 mt-3 mb-4"}
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "1px solid #ededed",
        padding: "10px",
        borderRadius: "15px",
      }}
    >
      <div className="row d-flex m-0">
        <div className="col-8">
          <div className="row d-flex m-0">
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={12}
                label="Pending"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={12}
                label="Scheduled"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={78}
                label="Completed"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={78}
                label="Total Drivers"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={56}
                label="Total Vehicles"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
            <div className="col p-1">
              <Menu
                background="rgba(12, 140, 233, 0.2)"
                outline="1px solid rgba(12, 140, 233, 0.4)"
                icon="/icons/doubleTick.svg"
                value={12}
                label="On-Visit"
                showTides={false}
                showArrow={false}
                textWrap={false}
              />
            </div>
          </div>
          <div
            className="p-2"
            style={{ background: "#C6D9F1", borderRadius: "10px" }}
          >
            <div className="row d-flex justify-content-between m-0">
              <div className="col-auto">
                <p className="fw-bold fs18px mb-2">Vehicles</p>
              </div>
              <div className="col-auto text-start">
                <select
                  className="form-select w-100 rounded-pill bg-transparent px-3 fw-bold"
                  style={{
                    outline: "none",
                    border: "1px solid #E5E7EB",
                  }}
                  aria-label="Officer Name"
                  name="officerName"
                >
                  <option value="">POLL&nbsp;&nbsp;▼</option>
                  <option value="">officer name</option>
                  <option value="">officer name</option>
                </select>
              </div>
            </div>
            <div
              className="d-flex m-0"
              style={{
                padding: "10px",
                borderRadius: "10px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                overflowX: "scroll",
                display: "inline-block",
              }}
            >
              <div
                className="col-auto bg-white me-2"
                style={{ borderRadius: "6px" }}
              >
                <div className="row d-flex justify-content-between m-0">
                  <div className="col-auto">
                    <img
                      src="/images/car1Right.png"
                      alt="car"
                      className="img-fluid"
                      style={{ width: "160px" }}
                    />
                  </div>
                  <div className="col-auto mt-3">
                    <Image
                      src="/icons/greenCircle.svg"
                      alt="greenCircle"
                      width={8}
                      height={8}
                    />{" "}
                    <span
                      style={{ color: "#00B42A" }}
                      className="fw-bold fs14px"
                    >
                      On-Visit
                    </span>
                  </div>
                </div>
                <div className="row d-flex justify-content-between m-0 mb-2">
                  <div className="col-auto fs15px fw-5">
                    <p className="m-0 color-sea-blue fw-5 color-sea-blue">
                      Toyota Corolla 2024
                    </p>
                  </div>
                  <div className="col-auto fs13px fw-5">
                    <p className="m-0" style={{ color: "#53547D" }}>
                      GBP-76778
                    </p>
                  </div>
                </div>
                <div className="row d-flex justify-content-between m-0">
                  <div className="col-auto fs12px fw-5">
                    <p className="m-0 fw-bold ">Driver</p>
                    <p className="m-0 fw-5">Amjad Ali</p>
                  </div>
                  <div className="col-auto fs12px fw-5">
                    <p className="m-0 fw-bold" style={{ color: "#53547D" }}>
                      Engineer
                    </p>
                    <p className="m-0 fw-5">Chris Richard</p>
                  </div>
                </div>
              </div>
              <div
                className="col-auto bg-white me-2"
                style={{ borderRadius: "6px" }}
              >
                <div className="row d-flex justify-content-between m-0">
                  <div className="col-auto">
                    <img
                      src="/images/car1Right.png"
                      alt="car"
                      className="img-fluid"
                      style={{ width: "160px" }}
                    />
                  </div>
                  <div className="col-auto mt-3">
                    <Image
                      src="/icons/greenCircle.svg"
                      alt="greenCircle"
                      width={8}
                      height={8}
                    />{" "}
                    <span
                      style={{ color: "#00B42A" }}
                      className="fw-bold fs14px"
                    >
                      On-Visit
                    </span>
                  </div>
                </div>
                <div className="row d-flex justify-content-between m-0 mb-2">
                  <div className="col-auto fs15px fw-5">
                    <p className="m-0 color-sea-blue fw-5 color-sea-blue">
                      Toyota Corolla 2024
                    </p>
                  </div>
                  <div className="col-auto fs13px fw-5">
                    <p className="m-0" style={{ color: "#53547D" }}>
                      GBP-76778
                    </p>
                  </div>
                </div>
                <div className="row d-flex justify-content-between m-0">
                  <div className="col-auto fs12px fw-5">
                    <p className="m-0 fw-bold ">Driver</p>
                    <p className="m-0 fw-5">Amjad Ali</p>
                  </div>
                  <div className="col-auto fs12px fw-5">
                    <p className="m-0 fw-bold" style={{ color: "#53547D" }}>
                      Engineer
                    </p>
                    <p className="m-0 fw-5">Chris Richard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-4"></div>
      </div>

      <div className="row p-3">
        <VisitsList />
      </div>
    </div>
  );
};

export default Dashboard;
