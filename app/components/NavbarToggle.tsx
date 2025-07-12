"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";

const NavbarToggle = () => {
  const currentPath = usePathname();

  if (currentPath !== "/login") {
    return <Navbar />;
  }
};

export default NavbarToggle;
