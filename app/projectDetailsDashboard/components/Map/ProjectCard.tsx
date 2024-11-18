import React from "react";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const ProjectCard = ({ data }: Props) => {
  return (
    <div
      style={{
        width: "300px",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      className="p-2 rounded shadow"
    >
      <p className="m-0 fs-6 fw-bold">{data.projectName.substring(0, 10)}...</p>
      <p className="m-0 fs-6 fw-normal">{data.projectName}</p>
    </div>
  );
};

export default ProjectCard;
