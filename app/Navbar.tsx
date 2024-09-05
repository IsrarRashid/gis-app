"use client";
import Image from "next/image";
import logo from "../public/images/logo.png";
import notifications from "../public/icons/notifications.svg";
import settings from "../public/icons/settings.svg";
import userIcon from "../public/icons/user.svg";
import GISMenu from "./components/GISMenu";
import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { UserData } from "./components/Login";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = Cookies.get("email") || "";
    setUserEmail(email);
  }, []);

  return (
    <nav
      className={
        lexend.className +
        " navbar navbar-expand-lg navbar-light bg-color-blue p-0"
      }
    >
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image src={logo} alt="logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
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
                      Something
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
