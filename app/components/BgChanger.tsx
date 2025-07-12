"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useBackground from "../hooks/useBackground";
import { useEffect, useState } from "react";

const BgChanger = () => {
  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const [currentType, setCurrentType] = useState<string | null>();

  useEffect(() => {
    const type = searchParams.get("dashboardType");
    console.log("searchParams type", type);
    setCurrentType(type);
  }, [searchParams]);

  const pagePathsForBgImage = [
    "attributes",
    "dashboard-attendance",
    "attribute-groups",
    "drivers",
    "projects",
    "report-history",
    "rights",
    "roles",
    "sectors",
    "smdp-sync",
    "super-group",
    "user-projects",
    "users",
    "vehicles",
    "visit-plans",
    "visits",
    "visits-new",
    "visits-scheduled",
    "departments",
    "new-visit-plan",
    "report-analysis",
    "process",
    "dashboard-to",
  ];

  const pathSegment = currentPath.split("/")[1]; // e.g., "sectors"
  const isImagePath = pagePathsForBgImage.includes(pathSegment);
  // #CFE6F8
  useBackground(
    isImagePath
      ? "/images/bg2.png"
      : pathSegment === "dashboard-to" || pathSegment === "vehicle-tracking"
      ? "#7ABEF0"
      : currentType
      ? "#2377B6"
      : "#CFE6F8",
    isImagePath // true if it's an image, false if it's a color
  );

  return <></>; // empty component just to trigger hook
};

export default BgChanger;

// useEffect(() => {
//     console.log("currentPath", currentPath.split("/")[1]);
//     const pathSegment = currentPath.split("/")[1]; // e.g., 'dashboard'

//     const pagePathsForBgColor = ["vt-tracking", "dashboard"];
//     const pagePathsForBgImage = ["xsectors", "drivers"];

//     const isColorPath = pagePathsForBgColor.includes(pathSegment);
//     const isImagePath = pagePathsForBgImage.includes(pathSegment);

//     const background = isColorPath
//       ? "#CFE6F8"
//       : isImagePath
//       ? "/images/bg2.png"
//       : "";
//     setBackground(background);

//     const isImage = isImagePath;
//     setImage(isImage);

//     console.log("background", background);
//     console.log("isImage", isImage);
//   }, [router, currentPath]);
