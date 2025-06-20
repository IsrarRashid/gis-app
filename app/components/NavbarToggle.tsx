"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import Navbar from "../Navbar";

const NavbarToggle = ({ children }: PropsWithChildren) => {
  const currentPath = usePathname();

  if (currentPath === "/login") {
    return <main>{children}</main>;
  } else
    return (
      <>
        <Navbar />
        <main className="p-2">{children}</main>
      </>
    );
};

export default NavbarToggle;
