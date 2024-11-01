"use client";
import Image from "next/image";
import logoNew from "./../public/icons/logoNew.svg";
import notifications from "../public/icons/notifications.svg";
import settings from "../public/icons/settings.svg";
import userIcon from "../public/icons/user.svg";
import GISMenu from "./components/GISMenu";
import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import downArrowBold from "../public/icons/downArrowBold.svg";
import profilePic from "../public/icons/profilePic.svg";
import locationPointBlue from "../public/icons/locationPointBlue.svg";
import dashboardBlue from "../public/icons/dashboardBlue.svg";
import filter from "../public/icons/filter.svg";
import FilterMenu from "./dashboard/components/FilterMenu";
import useRoles from "./hooks/useRoles";
import Button from "./components/Button";
import PriorityMenu from "./dashboard/components/PriorityMenu";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const currentContent = useSelector(
    (state: RootState) => state.content.currentContent
  );

  useEffect(() => {
    const email = Cookies.get("email") || "";
    const userName = Cookies.get("userName") || "";
    setUserEmail(email);
    setUserName(userName);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("userName");
    Cookies.remove("role");
    Cookies.remove("rights");
  };

  return (
    <nav
      className={
        lexend.className +
        " navbar navbar-expand-lg navbar-light bg-color-sea-blue p-0"
      }
    >
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image src={logoNew} alt="logoNew" width={64} height={64} />
        </Link>
        <Button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <GISMenu />
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" href="#">
                    Action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="#">
                    Another action
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" href="#">
                    Something else here
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
          {(currentContent === "Dashboard" ||
            currentContent === "DashboardTO") && (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item me-2">
                <FilterMenu />
              </li>
              <li className="nav-item me-2">
                <PriorityMenu />
              </li>
              <li className="nav-item dropdown">
                <Button
                  className="nav-link btn btn-sm badge rounded-pill shadow-sm fs-6 "
                  style={{
                    padding: "5px 15px 5px 8px",
                    background: "rgba(255, 255, 255, 0.62)",
                  }}
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="row d-flex">
                    <div className="col">
                      <Image
                        className="img-fluid rounded-circle mt-1"
                        src={profilePic}
                        alt="profilePic"
                        width={38}
                        height={38}
                      />
                    </div>
                    <div className="col mt-2 p-0 me-2">
                      <p
                        className="m-0 text-dark"
                        style={{ fontSize: ".8rem" }}
                      >
                        {userName}
                      </p>
                      <p
                        className="m-0 text-dark text-start mt-1"
                        style={{ fontSize: ".68rem" }}
                      >
                        12:15PM
                      </p>
                    </div>
                    <div className="col mt-2 ps-0 pe-0">
                      <Image src={downArrowBold} alt="downArrowBold" />
                    </div>
                  </div>
                </Button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link
                      className="dropdown-item"
                      href="/login"
                      onClick={handleLogout}
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          )}
          {currentContent === "Sectors" ||
          currentContent === "Projects" ||
          currentContent === "Users" ||
          currentContent === "SuperGroup" ||
          currentContent === "Attribute Groups" ||
          currentContent === "Attributes" ||
          currentContent === "Users" ||
          currentContent === "Roles" ||
          currentContent === "Rights" ||
          currentContent === "Vehicle" ||
          currentContent === "Driver" ||
          currentContent === "SMDP Sync" ||
          currentContent === "Visits" ? (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="#">
                  <Image src={notifications} alt="notifications" />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="#">
                  <Image src={settings} alt="settings" />
                </Link>
              </li>
              {userEmail ? (
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle text-white "
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Image src={userIcon} alt="userIcon" />
                    <span className="ms-2">{userEmail}</span>
                  </Link>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <Link
                        className="dropdown-item"
                        href="/login"
                        onClick={handleLogout}
                      >
                        Logout
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <li className="nav-item">
                  <Link href="/login" className="nav-link text-white">
                    Login
                  </Link>
                </li>
              )}
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
