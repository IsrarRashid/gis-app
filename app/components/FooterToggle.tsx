"use client";

import { usePathname } from "next/navigation";

const FooterToggle = () => {
  const currentPath = usePathname();

  if (currentPath !== "") {
    return (
      <footer className="w-100 text-white bg-color-sea-blue text-center py-1">
        Copyright &copy; All Rights Reserved - DGM&E
      </footer>
    );
  }
};

export default FooterToggle;
