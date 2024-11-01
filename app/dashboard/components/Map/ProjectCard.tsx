import Image from "next/image";
import carCardBg from "../../../../public/images/carCardBg.png";
import maximize from "../../../../public/icons/maximize.svg";
import phone3 from "../../../../public/icons/phone3.svg";
import staffMember1 from "../../../../public/images/staffMember1.png";
// import { StaffTracking } from "./MapComponent";
import useAuthentication from "@/app/hooks/useAuthentication";
import { useState } from "react";
import { getFormattedDate, getName } from "@/app/utils";
import tickStar from "../../../../public/icons/tickStar.svg";
import whiteBuilding from "../../../../public/icons/whiteBuilding.svg";
import { ProjectsList } from "../Dashboard";

interface Props {
  data: ProjectsList;
}

const ProjectCard = ({ data }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        width: "250px",
        borderRadius: "10px",
      }}
    >
      <p className="m-2 mb-1 fw-normal fs-6" style={{ letterSpacing: 1 }}>
        {data.projectName}
      </p>
      <p className="col m-2 mb-3 fw-normal fs-6">
        <span
          className="col p-1 rounded me-1"
          style={{ background: "#B5FFB2" }}
        >
          <Image
            src={tickStar}
            style={{ marginBottom: "1.5px" }}
            alt="tickStar"
          />{" "}
          {data.sectorName}
          {/* {getFormattedDate(new Date(data.approvalDate), "short")} */}
        </span>
        <span
          className="col p-1 rounded text-white"
          style={{ background: "rgba(12, 140, 233, 0.35)" }}
        >
          <Image
            src={whiteBuilding}
            style={{ marginBottom: "1.5px" }}
            alt="whiteBuilding"
          />{" "}
          {data.districtName}
        </span>
      </p>
    </div>
  );
};

export default ProjectCard;
