"use client";
import downArrow from "../../public/icons/down-arrow.svg";
import Image from "next/image";
import cross from "../../public/icons/cross-2.svg";
import clock2 from "../../public/icons/clock-2.svg";
import db from "../../public/icons/db.svg";
import qr from "../../public/icons/qr.svg";
import dashboard from "../../public/icons/dashboard.svg";
import user3White from "../../public/icons/user3White.svg";
import group from "../../public/icons/group.svg";
import driver from "../../public/icons/driver.svg";
import truck from "../../public/icons/truck.svg";
import visits from "../../public/icons/visits.svg";
import rolesWhite from "../../public/icons/rolesWhite.svg";
import rightsWhite from "../../public/icons/rightsWhite.svg";
import superGroupWhite from "../../public/icons/superGroupWhite.svg";
import { useDispatch } from "react-redux";
import { setContent } from "../features/content/contentSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button from "./Button";

interface Data {
  name: string;
  link: string;
  icon: any;
  backgroundColor: string;
}

const GISMenu = () => {
  const dispatch = useDispatch();

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const role = Cookies.get("role") || "";
    setRole(role);
  }, [router]);

  const data = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },
    {
      name: "DashboardTwo",
      link: "/dashboardTwo",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #DA5569 , #E73A80)",
    },
    {
      name: "Summary Dashboard",
      link: "/dashboardSummary",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #E48E6E , #EE7E37)",
    },
    {
      name: "DashboardTO",
      link: "/dashboardTO",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #a82897 , #2871a8)",
    },
    {
      name: "DashboardST",
      link: "/dashboardST",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #7f28a8 , #a82828)",
    },
    {
      name: "Sectors",
      link: "/sectors",
      icon: clock2,
      backgroundColor: "linear-gradient(to bottom right, #7b9cc9 , #b4cdf0)",
    },
    {
      name: "Projects",
      link: "/projects",
      icon: qr,
      backgroundColor: "linear-gradient(to bottom right, #8B5ABF , #5345DF)",
    },
    {
      name: "Super Group",
      link: "/superGroup",
      icon: superGroupWhite,
      backgroundColor: "linear-gradient(to bottom right, #28A897 , #E73A80)",
    },
    {
      name: "Attribute Groups",
      link: "/attributeGroups",
      icon: group,
      backgroundColor: "linear-gradient(to bottom right, #22B46A , #096764)",
    },
    {
      name: "Attributes",
      link: "/attributes",
      icon: db,
      backgroundColor: "linear-gradient(to bottom right, #F08630 , #E75161)",
    },
    {
      name: "Users",
      link: "/users",
      icon: user3White,
      backgroundColor: "linear-gradient(to bottom right, #E8A070 , #DA4A6A)",
    },
    {
      name: "Roles",
      link: "/roles",
      icon: rolesWhite,
      backgroundColor: "linear-gradient(to bottom right, #e2e870 , #daaf4a)",
    },
    {
      name: "Rights",
      link: "/rights",
      icon: rightsWhite,
      backgroundColor: "linear-gradient(to bottom right, brown , pink)",
    },
    {
      name: "Vehicle",
      link: "/vehicle",
      icon: truck,
      backgroundColor: "linear-gradient(to bottom right, #A33CB2 , #E73A80)",
    },
    {
      name: "Driver",
      link: "/driver",
      icon: driver,
      backgroundColor: "linear-gradient(to bottom right, #a2a828 , #b93ae7)",
    },
    {
      name: "Visits",
      link: "/visits",
      icon: visits,
      backgroundColor: "linear-gradient(to bottom right, #28A897 , yellow)",
    },
    // {
    //   name: "SMDP Sync",
    //   link: "/smdpSync",
    //   icon: dashboard,
    //   backgroundColor: "linear-gradient(to bottom right, #28A897 , #E73A80)",
    // },
  ];

  const getFilterdData = (role: string, data: Data[]) => {
    switch (role) {
      case "Transport Officier":
        return data.filter((d) =>
          ["Vehicle", "Driver", "DashboardTO"].includes(d.name)
        );
      // case "Admin":
      //   return data.filter((d) =>
      //     ["Vehicle", "Dashboard", "Settings"].includes(d.name)
      //   );

      default:
        return data;
    }
  };

  return (
    <>
      <Button
        type="button"
        className="nav-link btn btn-sm text-white badge rounded-pill bg-color-light-blue shadow-sm fs-6"
        style={{
          padding: "12px 15px 12px 15px",
        }}
        data-bs-toggle="modal"
        data-bs-target="#gisMenuModal"
      >
        GIS Base Monitering &nbsp;
        <Image src={downArrow} alt="down arrow" />
      </Button>

      <div
        className="modal fade"
        id="gisMenuModal"
        aria-labelledby="gisMenuModalLabel"
        aria-hidden="true"
        data-bs-backdrop="false"
      >
        <div className="modal-dialog modal-xl" style={{ marginTop: "80px" }}>
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4 bg-blur"
                style={{
                  borderRadius: "20px",
                }}
              >
                <div className="col">
                  <Button
                    className="btn p-0"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <Image src={cross} alt="cross" width={30} />
                  </Button>
                </div>
                <div className="row d-flex justify-content-center p-4">
                  {getFilterdData(role, data).map((d) => (
                    <div
                      key={d.name.toString()}
                      className="col text-center mb-3"
                    >
                      <Button
                        className="btn p-0"
                        onClick={() => {
                          router.push(d.link);
                          handleButtonClick(d.name);
                        }}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <div
                          className="col text-center"
                          style={{
                            backgroundImage: d.backgroundColor,
                            borderRadius: "10px",
                            padding: "40px 45px",
                          }}
                        >
                          <Image
                            src={d.icon}
                            alt={d.icon}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div
                          className="col text-center fw-bold mt-1 fs18px"
                          style={{ color: "#676767" }}
                        >
                          {d.name === "Summary Dashboard" ? (
                            <>
                              Summary <br />
                              Dashboard
                            </>
                          ) : (
                            d.name
                          )}
                        </div>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GISMenu;
