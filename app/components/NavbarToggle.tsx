"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";

const NavbarToggle = () => {
  const currentPath = usePathname();

  if (currentPath !== "/login" && currentPath !== "/privacy-policy") {
    return <Navbar />;
  } else {
    return <div style={{ height: "68px" }}></div>;
  }
};

export default NavbarToggle;
