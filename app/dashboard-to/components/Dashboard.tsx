"use client";
import useAuthorization from "@/app/hooks/useAuthorization";
import { useEffect, useState } from "react";
import UserProjectsList from "./UserProjectsList";
import VisitsList from "./VisitsList";
import Menu from "@/app/components/Menu";
import Image from "next/image";
import Button from "@/app/components/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Dashboard = () => {
  return (
    <div
      className="shadow"
      style={{
        padding: "2.77px",
        backgroundImage:
          "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1))",
        borderRadius: "10px",
      }}
    >
      <div
        className={"container-fluid p-1"}
        style={{
          backgroundImage:
            "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
          borderRadius: "10px",
        }}
      >
        <div className="row m-0">
          <div className="col-12 col-sm-12 col-md-6 col-lg-9 p-1">
            <div className="row m-0">
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
          <div className="col-12 col-sm-12 col-md-6 col-lg-3 p-1">
            <div
              className="col shadow-sm position-relative"
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                padding: "10px 10px 5px 10px",
              }}
            >
              <h6 className="fw-bold text-center">Vehicles</h6>

              <div className="col-auto position-absolute top-0 end-0 me-2 mt-2">
                <span
                  className="badge rounded-pill text-light fw-5"
                  style={{ background: "rgba(34, 176, 125, 0.8)" }}
                >
                  In use
                </span>
              </div>
              <div className="row m-0 d-flex align-items-center">
                <div className="col-auto">
                  <Button
                    className="btn btn-sm rounded-3 p-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <IoIosArrowBack />
                  </Button>
                </div>
                <div className="col">
                  <img
                    src="/images/car1Right.png"
                    alt="car"
                    className="img-fluid"
                    style={{ width: "240px" }}
                  />
                </div>
                <div className="col-auto">
                  <Button
                    className="btn btn-sm rounded-3 p-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <IoIosArrowForward />
                  </Button>
                </div>
              </div>
              <div
                className="col p-2"
                style={{
                  border: ".77px solid rgba(255, 255, 255, 0.6)",
                  background: "rgba(255, 255, 255, 0.6)",
                  borderRadius: "10px",
                }}
              >
                <div className="row m-0 mb-3 d-flex flex-wrap align-items-center">
                  <div className="col">
                    <p className="m-0 fw-bold">Toyota Corolla 2024</p>
                  </div>
                  <div className="col-auto">
                    <Button
                      className="btn btn-sm fs14px fw-bold"
                      style={{ background: "#F5F5FF" }}
                    >
                      TOYOO1
                    </Button>
                  </div>
                </div>
                <div className="row m-0 mb-3 d-flex flex-wrap align-items-center">
                  <div className="col">
                    <p className="m-0 fw-bold fs14px">Car Model</p>
                    <p className="m-0 fw-bold fs14px">XLI</p>
                  </div>
                  <div className="col">
                    <p className="m-0 fw-bold">
                      <p className="m-0 fw-bold fs14px text-nowrap">
                        Registeration Number
                      </p>
                      <p className="m-0 fw-bold fs14px">LEG-14-4444</p>
                    </p>
                  </div>
                </div>

                <div className="row m-0 mb-3 d-flex flex-wrap align-items-center">
                  <div className="col">
                    <p className="m-0 fw-bold fs14px">Fuel Capacity</p>
                    <p className="m-0 fw-bold fs14px">Diesel</p>
                  </div>
                  <div className="col">
                    <p className="m-0 fw-bold">
                      <p className="m-0 fw-bold fs14px">Sitting Capacity</p>
                      <p className="m-0 fw-bold fs14px">4</p>
                    </p>
                  </div>
                </div>
                <div className="row m-0 mb-3 d-flex flex-wrap align-items-center">
                  <div className="col">
                    <p className="m-0 fw-bold">
                      <p className="m-0 fw-bold fs14px">Transmission</p>
                      <p className="m-0 fw-bold fs14px">Automatic</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row p-3">
          <VisitsList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
