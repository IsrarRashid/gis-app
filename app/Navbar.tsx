"use client";
import Cookies from "js-cookie";
import { Lexend } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { useSelector } from "react-redux";
import Button from "./components/Button";
import GISMenu from "./components/GISMenu";
import UserDropDown from "./components/UserDropDown/UserDropDown";
import { RootState } from "./store";
import Image from "next/image";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "300",
});

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const [role, setRole] = useState<string>();

  const currentContent = useSelector(
    (state: RootState) => state.content.currentContent
  );
  const currentTutorial = useSelector(
    (state: RootState) => state.tutorial.currentTutorial
  );

  useEffect(() => {
    const userRole = Cookies.get("role");
    if (userRole) setRole(userRole);
  }, []);

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

  const [currentTime, setCurrentTime] = useState("");
  const [isEnter, setEnter] = useState(false);

  useEffect(() => {
    // Function to format the time
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const isPM = hours >= 12;
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const ampm = isPM ? "PM" : "AM";
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    // Update time every second
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light bg-color-sea-blue p-0 ${lexend.className}`}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          <Image
            src="/icons/logoNew.svg"
            className="img-fluid object-contain"
            alt="logoNew"
            width={64}
            height={64}
          />
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

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {role !== "Ministers" && (
              <li className="nav-item p-1 me-2 m-auto">
                <Link href={currentTutorial} target="_blank">
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                    onMouseEnter={() => setEnter(true)}
                    onMouseLeave={() => setEnter(false)}
                  >
                    {/* Background div */}
                    <FaPlay
                      size={16}
                      color={`${isEnter ? "white" : "rgba(255,255,255,0)"}`}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "10px",
                        height: "10px",
                        transform: "translate(-50%, -50%)",
                        zIndex: 0, // Make sure it's behind the icon
                        transition: "color .3s",
                      }}
                    />
                    {/* YouTube Icon */}
                    <FaYoutube
                      color={`${isEnter ? "red" : "white"}`}
                      size={40}
                      style={{ transition: "color .3s" }}
                    />
                  </div>
                </Link>
              </li>
            )}
            <li className="nav-item p-1 me-2">
              <Link href="https://smdp.punjab.gov.pk/" target="_blank">
                <Button
                  className="btn rounded-pill fw-bold m-auto"
                  style={{
                    background: "rgba(255, 255, 255, 0.62)",
                    color: "#424242",
                    fontSize: "0.813rem",
                    padding: "10px 15px",
                  }}
                >
                  SMDP
                </Button>
              </Link>
            </li>
            <li className="nav-item dropdown me-3">
              <UserDropDown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
