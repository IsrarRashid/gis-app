"use client";
import { useState } from "react";
import ProjectsList from "./ProjectsList";
import ListWrapper from "@/app/components/ListWrapper";

const Projects = () => {
  const [refresh, setRefresh] = useState(false);
  const [showData, setShowData] = useState(false);

  return (
    <ListWrapper>
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
    </ListWrapper>
  );
};

export default Projects;
