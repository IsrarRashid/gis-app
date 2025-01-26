"use client";
import totalEmployees from "@/public/images/attendance/totalEmployees.svg";
import persent from "@/public/images/attendance/present.svg";
import lateArival from "@/public/images/attendance/lateArival.svg";
import onLeave from "@/public/images/attendance/onLeave.svg";
import onVisit from "@/public/images/attendance/onVisit.svg";
import others from "@/public/images/attendance/others.svg";
import absent from "@/public/images/attendance/absent.svg";
import leftEarly from "@/public/images/attendance/leftEarly.svg";
import wave1Blue from "@/public/images/attendance/wave1Blue.png";
import wave2Blue from "@/public/images/attendance/wave2Blue.png";
import { motion } from "framer-motion";
import Image from "next/image";
// import "./Dashboard.css";
import { HiUsers } from "react-icons/hi";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
import { FaCompass } from "react-icons/fa";
import {
  FaPersonWalkingDashedLineArrowRight,
  FaUserXmark,
} from "react-icons/fa6";
import { TbFileArrowRight, TbWorldSearch } from "react-icons/tb";
import { TfiMoreAlt } from "react-icons/tfi";
import { dashboardAttendanceAPI } from "@/app/APIs";
import Link from "next/link";
import WaveAnimation from "../WaveAnimation";
import { ReactNode, useEffect, useState } from "react";
import apiClient from "@/app/services/api-client";
import Loader from "@/app/components/Loader";
import styles from "./AttendanceHome.module.css";

interface DashboardAttendance {
  count: {
    totalEmployee: number;
    present: number;
    leave: number;
    visit: number;
    late: number;
    leftEarly: number;
    absent: number;
    others: number;
  };
}

const DashboardAttendance = () => {
  const [data, setData] = useState<DashboardAttendance>();

  useEffect(() => {
    const handleSubmit = async () => {
      try {
        const response = await apiClient.get(dashboardAttendanceAPI);
        setData(response.data);
        console.log("attendace data ", response);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    handleSubmit();
  }, []);

  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BACKEND_API}${dashboardAttendanceAPI}`
  // );
  // const attendanceData: DashboardAttendance = await res.json();

  useEffect(() => {
    // Set the background for the body
    document.body.style.background = "#CFE6F8";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      className="container-fluid p-2 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      {data ? (
        <div className="py-5">
          <section className="mx-3 pt-2 pb-5 ">
            <h1 className="fw-bold">Welcome Admin !</h1>
            <p className="text-secondary fs-5 fw-normal">Dashboard</p>
          </section>
          <section className="mx-3 pt-3 pb-5 ">
            <div className="row">
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyAttendance"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <HiUsers className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.totalEmployee}
                        </p>
                        <p style={{ fontSize: "1rem" }}>DGME Total Employees</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyPresent"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <BsFileEarmarkCheckFill
                            className="text-white"
                            size={40}
                          />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.present}
                        </p>
                        <p style={{ fontSize: "1rem" }}>Present (Bio Matric)</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyLateComer"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <FaCompass className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.late}
                        </p>
                        <p style={{ fontSize: "1rem" }}>Late Arrival</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyEarlyTime"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <FaPersonWalkingDashedLineArrowRight
                            className="text-white"
                            size={40}
                          />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.leftEarly}
                        </p>
                        <p style={{ fontSize: "1rem" }}>Left Early</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyLeave"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <TbFileArrowRight className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.leave}
                        </p>
                        <p style={{ fontSize: "1rem" }}>On Leave</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyVisit"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <TbWorldSearch className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.visit}
                        </p>
                        <p style={{ fontSize: "1rem" }}>on Visit</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyAbsent"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <FaUserXmark className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.absent}
                        </p>
                        <p style={{ fontSize: "1rem" }}>Absent</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div
                  className={`bg-white rounded-3 p-3 border h-100 ${styles.shadowMulti}`}
                >
                  <Link
                    href="/dashboard-attendance/DailyOthers"
                    className="text-decoration-none text-dark"
                  >
                    <div className="row">
                      <div className="col-3">
                        <div
                          className="rounded-circle d-flex justify-content-center align-items-center"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "linear-gradient( #5746DD , #26AE92)",
                          }}
                        >
                          <TfiMoreAlt className="text-white" size={40} />
                        </div>
                      </div>
                      <div className="col-9 text-end">
                        <p className="fs-2 fw-bold p-0 m-0">
                          {data.count.others}
                        </p>
                        <p style={{ fontSize: "1rem" }}>Others</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <div className="col mt-5">
            <WaveAnimation />
          </div>
        </div>
      ) : (
        <div>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default DashboardAttendance;
