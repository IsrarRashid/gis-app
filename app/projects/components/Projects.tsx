"use client";
import { useEffect, useState } from "react";
import ProjectsList from "./ProjectsList";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import DownloadFile from "./DownloadFile";
import DownloadPDFBtn from "@/app/components/DownloadPDFBtn";
import DownloadTextPDFBtn from "@/app/components/DownloadTextPDFBtn";
import useAuthorization from "@/app/hooks/useAuthorization";

const Projects = () => {
  const [refresh, setRefresh] = useState(false);
  const [showData, setShowData] = useState(false);
  useAuthorization("projects");


  useEffect(() => {
    // Set the background for the body
    document.body.style.backgroundImage = `url('/images/bg2.png')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";

    // Cleanup on unmount
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

  return (
    <div
      className={"container p-3 mt-3 mb-4"}
      style={{
        background: "rgba(209, 209, 209, 0.4)",
        border: "1px solid #ededed",
        padding: "10px",
        borderRadius: "15px",
      }}
    >
      <div className="row p-3">
        <ProjectsList
          refresh={refresh}
          setRefresh={setRefresh}
          showData={showData}
          setShowData={setShowData}
        />
        {/* <span>
          Image:
          <DownloadPDFBtn />
        </span>
        <DownloadFile /> */}
      </div>
    </div>
  );
};

export default Projects;
