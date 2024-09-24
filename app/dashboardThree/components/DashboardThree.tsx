"use client";
import { DM_Sans, Lexend } from "next/font/google";
import Menu from "./Menu";
import { useEffect, useState } from "react";
import { setContent } from "@/app/features/content/contentSlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import calendarBlack from "../../../public/icons/calendarBlack.svg";
import Select from "react-select";
import SimpleBarChart from "./SimpleBarChart";
import SimplePieChart from "./SimplePieChart";
import boxes from "../../../public/icons/boxes.svg";
import tick from "../../../public/icons/tick.svg";
import questionMark from "../../../public/icons/questionMark.svg";
import halfUpArrow from "../../../public/icons/halfUpArrow.svg";
import verticalLineLong from "../../../public/icons/verticalLineLong.svg";
import search from "../../../public/icons/search.svg";
import arrowTopRight from "../../../public/icons/arrowTopRight.svg";
import arrowDown from "../../../public/icons/arrowDown.svg";
import tree from "../../../public/icons/tree.svg";
import leaf from "../../../public/icons/leaf.svg";
import IndustryBalancer from "../../../public/icons/IndustryBalancer.svg";
import hatDegree from "../../../public/icons/hatDegree.svg";
import information from "../../../public/icons/information.svg";
import stacks from "../../../public/icons/stacks.svg";
import cow from "../../../public/icons/cow.svg";
import calendarCircle from "../../../public/icons/calendarCircle.svg";
import population from "../../../public/icons/population.svg";
import heartRate from "../../../public/icons/heartRate.svg";
import DistributedColumnChart from "./DistributedColumnChart";
import SimplePieChart2 from "./SimplePieChart2";
import StackedColumnChart from "./StackedColumnChart";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: "300",
});

const DashboardThree = () => {
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  const options = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#C6D9F1", // Background for the input box
      borderRadius: "10px",
      // boxShadow: "0px 3px 5px #9c9c9c",
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#C6D9F1", // Background for the dropdown menu
    }),
  };

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#7ABEF0";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    handleButtonClick("Dashboard");
    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  const items = [
    {
      title: "Agriculture",
      icon: leaf,
    },
    {
      title: "Higher Education",
      icon: IndustryBalancer,
    },
    {
      title: "Industries, Commerce & Inversment",
      icon: hatDegree,
    },
    {
      title: "Information & Culture",
      icon: information,
    },
    {
      title: "LG&CD",
      icon: stacks,
    },
    {
      title: "Livestock & Dairy Development",
      icon: cow,
    },
    {
      title: "Planning & Development",
      icon: calendarCircle,
    },
    {
      title: "Population Welfare",
      icon: population,
    },
    {
      title: "Primary & Secondary Healthcare",
      icon: heartRate,
    },
  ];

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
      <div className="row mb-3">
        <div className="col-lg-7 col-md-12 col">
          <Menu />
          <div className="row d-flex justify-content-between mt-3 mb-3 ms-3 me-3 ">
            <div
              className="col-lg-4 col-md-9 col-sm-12 pt-2 shadow-sm text-center"
              style={{
                background: "#C6D9F1",
                borderRadius: "10px",
                whiteSpace: "nowrap",
              }}
            >
              <p
                className="m-0 fs14px"
                style={{
                  color: "#64748B",
                  fontWeight: "400",
                }}
              >
                <Image
                  src={calendarBlack}
                  alt="calendarBlack"
                  style={{ marginTop: "-4px" }}
                />
                &nbsp;Jan 12, 2024 - Sep 4, 2024
              </p>
            </div>
            <div
              className="col-lg-1 col-md-1 col"
              style={{ marginRight: "40px" }}
            >
              <select
                className="bg-color-matte-light-blue fw-bold shadow-sm"
                style={{
                  color: "#64748B",
                  outline: "none",
                  borderRadius: "10px",
                  border: 0,
                }}
                aria-label="Rows per page"
                name="rowPerPage"
              >
                <option value="day" selected>
                  Daily
                </option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
          </div>
          {/* <SimpleBarChart /> */}
          {/* <DistributedColumnChart /> */}
          <StackedColumnChart />
        </div>
        <div className="col-lg-5 col-md-12 col">
          <SimplePieChart title="Rating Index" />
          <SimplePieChart2 title="Physical Progress" />
        </div>
      </div>
      <div
        className="row d-flex justify-content-center shadow-sm mb-3 p-3 ms-1 me-1"
        style={{
          background: "#C6D9F1",
          borderRadius: "15px",
          fontSize: ".9rem",
        }}
      >
        <div className="col-lg-2 col-md-4 col">
          <div className="row d-flex">
            <div className="col-lg-4 col-md-4 col">
              <Image src={boxes} alt="boxes" />
            </div>
            <div className="col-lg-7 col-md-7 col ps-3">
              <p className="m-0 mt-2">
                <span className="fw-bold fs-3">772</span>{" "}
                <span
                  className="fs14px text-success ms-3"
                  style={{ fontWeight: "500" }}
                >
                  18%
                </span>{" "}
                <Image src={halfUpArrow} alt="halfUpArrow" />
              </p>
              <p className="m-0 fs14px fw-normal text-secondary">
                Total Schemes
              </p>
            </div>
            <div className="col-lg-1 col-md-1 col p-0">
              <Image src={verticalLineLong} alt="verticalLineLong" />
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 col ms-lg-4">
          <div className="row d-flex">
            <div className="col-lg-4 col-md-4 col ">
              <Image src={tick} alt="tick" />
            </div>
            <div className="col-lg-7 col-md-7 col ps-3">
              <p className="m-0 mt-2">
                <span className="fw-bold fs-3">10</span>{" "}
                <span
                  className="fs14px text-success ms-3"
                  style={{ fontWeight: "500" }}
                >
                  25%
                </span>
              </p>
              <p className="m-0 fs14px fw-normal text-secondary">Approved</p>
            </div>
            <div className="col-lg-1 col-md-1 col p-0">
              <Image src={verticalLineLong} alt="verticalLineLong" />
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 ms-lg-4 col">
          <div className="row d-flex">
            <div className="col-lg-4 col-md-4 col">
              <Image src={questionMark} alt="questionMark" />
            </div>
            <div className="col-lg-7 col-md-7 col ps-3">
              <p className="m-0 mt-2">
                <span className="fw-bold fs-3">02</span>{" "}
                <span
                  className="fs14px ms-3"
                  style={{ fontWeight: "500", color: "#F0950C" }}
                >
                  7%
                </span>
              </p>
              <p className="m-0 fs14px fw-normal text-secondary">Unapproved</p>
            </div>
          </div>
        </div>
      </div>
      {/* Search */}
      <div className="row d-flex">
        <div className="col-lg-11 col-md-10 col">
          <div className="input-group mb-3">
            <span className="input-group-text bg-white" id="basic-addon1">
              <Image src={search} alt="search" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 dSearchInput"
              placeholder="Search Schemes"
            />
          </div>
        </div>
        <div className="col-lg-1 col-md-2 col ps-0">
          <button
            className="btn text-white w-100"
            style={{
              backgroundImage: "linear-gradient(to right, #0C8CE9 , #13629B)",
              border: "0px",
              height: "41px",
            }}
          >
            Search
          </button>
        </div>
      </div>
      <div className="col mb-3">
        <button className="btn bg-color-sea-blue text-white fw-bold fs12px me-2 mb-2">
          Sector
        </button>
        <button className="btn bg-color-sea-blue text-white fw-bold fs12px me-2 mb-2">
          Sponsoring Agency
        </button>
        <button className="btn bg-color-sea-blue text-white fw-bold fs12px me-2 mb-2">
          Executing Agency
        </button>
      </div>
      <div className={`row d-flex ms-1 me-1 ${dmSans.className}`}>
        {items.map((d, i) => (
          <div key={i} className="col-lg-6 col-md-12 col ps-3 pe-3 pb-1">
            <div
              className="col shadow-sm mb-3 p-3"
              style={{
                background: "#C6D9F1",
                borderRadius: "15px",
                fontSize: ".9rem",
              }}
            >
              <div className="col text-end">
                <Image src={arrowTopRight} alt="arrowTopRight" />
              </div>
              <div className="row d-flex">
                <div className="col-lg-1 col-md-1 col-sm-12 ms-3 mt-2">
                  <Image src={d.icon} alt={d.icon} />
                </div>
                <div className="col-lg-10 col-md-10 col-sm-12 ms-1">
                  <p
                    className="m-0 fs-4 mb-1 ms-1"
                    style={{ fontWeight: "900" }}
                  >
                    {d.title}
                  </p>
                  <div className="row d-flex ms-1">
                    <div
                      className=" col p-2 fs12px text-center me-2 mb-1 mb-1"
                      style={{
                        color: "#0C8CE9",
                        background: "#E2F2F8",
                        borderRadius: "7px",
                        fontWeight: "900",
                      }}
                    >
                      Total Visit : 5
                    </div>
                    <div
                      className=" col p-2 fs12px text-center me-2 mb-1"
                      style={{
                        color: "#0C8CE9",
                        background: "#E2F2F8",
                        borderRadius: "7px",
                        fontWeight: "900",
                      }}
                    >
                      Total Reports: 3
                    </div>
                    <div
                      className=" col p-2 fs12px text-center me-2 mb-1"
                      style={{
                        color: "#0C8CE9",
                        background: "#E2F2F8",
                        borderRadius: "7px",
                        fontWeight: "900",
                      }}
                    >
                      Schemes: 3
                    </div>
                    <div
                      className=" col p-2 fs12px text-center me-2 mb-1"
                      style={{
                        color: "#0C8CE9",
                        background: "#E2F2F8",
                        borderRadius: "7px",
                        fontWeight: "900",
                      }}
                    >
                      Monitored 4 &nbsp;
                      <Image src={arrowDown} alt="arrowDown" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="row d-none d-md-block"
                style={{ marginTop: "-8px", marginLeft: "100px" }}
              >
                <Image src={tree} alt="tree" width={50} height={50} />
                <div className="row d-flex justify">
                  <div className="col-4 text-center">
                    <p
                      className="text-danger fw-bold"
                      style={{
                        fontWeight: "500",
                        marginLeft: "-30px",
                        marginBottom: 0,
                      }}
                    >
                      Critical
                      <br />3
                    </p>
                  </div>
                  <div className="col-4">
                    <p
                      className="m-0 text-center fw-bold"
                      style={{ color: "#2AA0F6", fontWeight: "500" }}
                    >
                      Defined Limit
                      <br />1
                    </p>
                  </div>
                  <div className="col-4">
                    <p
                      className="text-center fw-bold"
                      style={{
                        color: "#F2D01B",
                        fontWeight: "500",
                        marginLeft: "10px",
                        marginBottom: 0,
                      }}
                    >
                      Need Consideration
                      <br />5
                    </p>
                  </div>
                </div>
              </div>
              <div className="row d-flex ps-3 pe-3 pt-3">
                <div
                  className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
                  style={{ background: "rgba(255,255,255,.5)" }}
                >
                  <span className="fw-bold">Cost</span>
                  <br />
                  970.73 B
                </div>
                <div
                  className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
                  style={{ background: "rgba(255,255,255,.5)" }}
                >
                  <span className="fw-bold">Allocation</span>
                  <br />
                  278.13 B
                </div>
                <div
                  className="col-lg-3 col-md-3 col rounded-3 text-center fs14px me-2 p-1 mb-1"
                  style={{ background: "rgba(255,255,255,.5)" }}
                >
                  <span className="fw-bold">Current Year Release</span>
                  <br />
                  100.13 B
                </div>
                <div
                  className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
                  style={{ background: "rgba(255,255,255,.5)" }}
                >
                  <span className="fw-bold">Total Release</span>
                  <br />
                  2.25 B
                </div>
                <div
                  className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
                  style={{ background: "rgba(255,255,255,.5)" }}
                >
                  <span className="fw-bold">Utilization</span>
                  <br />
                  0.00 B
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardThree;
