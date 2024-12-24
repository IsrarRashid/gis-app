"use client";
import staffTrackingIcon from "@/public/icons/staffTracking.svg";
import userProjects from "@/public/icons/userProjects.svg";
import vehicleTrackingIcon from "@/public/icons/vehicleTracking.svg";
import visitSchedule from "@/public/icons/visitSchedule.svg";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import clock2 from "../../public/icons/clock-2.svg";
import cross from "../../public/icons/cross-2.svg";
import dashboard from "../../public/icons/dashboard.svg";
import db from "../../public/icons/db.svg";
import downArrow from "../../public/icons/down-arrow.svg";
import driver from "../../public/icons/driver.svg";
import group from "../../public/icons/group.svg";
import qr from "../../public/icons/qr.svg";
import rightsWhite from "../../public/icons/rightsWhite.svg";
import rolesWhite from "../../public/icons/rolesWhite.svg";
import superGroupWhite from "../../public/icons/superGroupWhite.svg";
import truck from "../../public/icons/truck.svg";
import user3White from "../../public/icons/user3White.svg";
import visits from "../../public/icons/visits.svg";
import { setContent } from "../features/content/contentSlice";
import Button from "./Button";

interface Data {
  name: string;
  link: string;
  icon: any;
  backgroundColor: string;
}

const GISMenu = () => {
  const dispatch = useDispatch();
  const [rights, setRights] = useState([]);

  const handleButtonClick = (content: string) => {
    dispatch(setContent(content));
  };

  const router = useRouter();
  const [role, setRole] = useState("");

  useEffect(() => {
    const rights = JSON.parse(Cookies.get("rights") || "[]");
    setRights(rights);
  }, [router]);

  const data = [
    {
      name: "DG Dashboard",
      nameId: "dashboard",
      link: "/dashboard",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },
    {
      name: "Director Dashboard",
      nameId: "dashboard-director",
      link: "/dashboard-director",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },
    {
      name: "Deputy Director Dashboard",
      nameId: "dashboard-deputy-director",
      link: "/dashboard-deputy-director",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },
    {
      name: "Officier Dashboard",
      nameId: "dashboard-officier",
      link: "/dashboard-officier",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },
    {
      name: "IT Dashboard",
      nameId: "dashboard-it",
      link: "/dashboard-it",
      icon: dashboard,
      backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
    },

    // {
    //   name: "Summary Dashboard",
    //   nameId: "summaryDashboard",
    //   link: "/summaryDashboard",
    //   icon: dashboard,
    //   backgroundColor: "linear-gradient(to bottom right, #E48E6E , #EE7E37)",
    // },
    {
      name: "Vehicle Tracking",
      nameId: "vehicle-tracking",
      link: "/vehicle-tracking",
      icon: vehicleTrackingIcon,
      backgroundColor: "linear-gradient(to bottom right, #a82897 , #2871a8)",
    },
    {
      name: "Staff Tracking",
      nameId: "staff-tracking",
      link: "/staff-tracking",
      icon: staffTrackingIcon,
      backgroundColor: "linear-gradient(to bottom right, #7f28a8 , #a82828)",
    },
    {
      name: "Sectors",
      nameId: "sectors",
      link: "/sectors",
      icon: clock2,
      backgroundColor: "linear-gradient(to bottom right, #7b9cc9 , #b4cdf0)",
    },
    {
      name: "Projects",
      nameId: "projects",
      link: "/projects",
      icon: qr,
      backgroundColor: "linear-gradient(to bottom right, #8B5ABF , #5345DF)",
    },
    {
      name: "User Projects",
      nameId: "user-projects",
      link: "/user-projects",
      icon: userProjects,
      backgroundColor: "linear-gradient(to bottom right, #542487 , #41c4c2)",
    },
    {
      name: "Super Group",
      nameId: "super-group",
      link: "/super-group",
      icon: superGroupWhite,
      backgroundColor: "linear-gradient(to bottom right, #28A897 , #E73A80)",
    },
    {
      name: "Attribute Groups",
      nameId: "attribute-groups",
      link: "/attribute-groups",
      icon: group,
      backgroundColor: "linear-gradient(to bottom right, #22B46A , #096764)",
    },
    {
      name: "Attributes",
      nameId: "attributes",
      link: "/attributes",
      icon: db,
      backgroundColor: "linear-gradient(to bottom right, #F08630 , #E75161)",
    },
    {
      name: "Users",
      nameId: "users",
      link: "/users",
      icon: user3White,
      backgroundColor: "linear-gradient(to bottom right, #E8A070 , #DA4A6A)",
    },
    {
      name: "Roles",
      nameId: "roles",
      link: "/roles",
      icon: rolesWhite,
      backgroundColor: "linear-gradient(to bottom right, #e2e870 , #daaf4a)",
    },
    {
      name: "Rights",
      nameId: "rights",
      link: "/rights",
      icon: rightsWhite,
      backgroundColor: "linear-gradient(to bottom right, brown , pink)",
    },
    {
      name: "Vehicles",
      nameId: "vehicles",
      link: "/vehicles",
      icon: truck,
      backgroundColor: "linear-gradient(to bottom right, #A33CB2 , #E73A80)",
    },
    {
      name: "Drivers",
      nameId: "drivers",
      link: "/drivers",
      icon: driver,
      backgroundColor: "linear-gradient(to bottom right, #a2a828 , #b93ae7)",
    },
    {
      name: "Visit Plans",
      nameId: "visit-plans",
      link: "/visit-plans",
      icon: visitSchedule,
      backgroundColor: "linear-gradient(to bottom right, #259799, #1b4d9e )",
    },
    {
      name: "Visits New",
      nameId: "visits-new",
      link: "/visits-new",
      icon: visits,
      backgroundColor: "linear-gradient(to bottom right, #28A811 , yellow)",
    },
    // {
    //   name: "Visits",
    //   nameId: "visits",
    //   link: "/visits",
    //   icon: visits,
    //   backgroundColor: "linear-gradient(to bottom right, #28A897 , yellow)",
    // },
    // {
    //   name: "Visits Scheduled",
    //   nameId: "visitsScheduled",
    //   link: "/visitsScheduled",
    //   icon: visitSchedule,
    //   backgroundColor: "linear-gradient(to bottom right, #28A897 , violet)",
    // },
  ];

  const [filteredMenu, setFilteredMenu] = useState(data);

  useEffect(() => {
    const rights = JSON.parse(Cookies.get("rights") || "[]");
    // Filter data based on rights
    const filteredData = data.filter((item) =>
      rights.some(
        (right: string) => right.toLowerCase() === item.nameId.toLowerCase()
      )
    );
    console.log("rights filtered", filteredData);
    setFilteredMenu(filteredData);
  }, [router]);

  return (
    <>
      {rights?.length <= 1 ? (
        <label
          className="nav-link text-white badge rounded-pill fw-bold"
          style={{
            padding: "12px 15px 12px 15px",
            fontSize: "22px",
            letterSpacing: 1,
          }}
        >
          Monitoring Dashboard
        </label>
      ) : (
        <Button
          type="button"
          className="nav-link btn btn-sm text-white badge rounded-pill bg-color-light-blue shadow-sm fs-6 fw-bold"
          style={{
            padding: "12px 15px 12px 15px",
            fontSize: "22px",
            letterSpacing: 1,
          }}
          data-bs-toggle="modal"
          data-bs-target="#gisMenuModal"
        >
          Monitoring Dashboard &nbsp;
          <Image src={downArrow} alt="down arrow" />
        </Button>
      )}

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
                  {filteredMenu.map((d) => (
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
