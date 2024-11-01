import Image from "next/image";
import carCardBg from "../../../../public/images/carCardBg.png";
import maximize from "../../../../public/icons/maximize.svg";
import phone3 from "../../../../public/icons/phone3.svg";
import staffMember1 from "../../../../public/images/staffMember1.png";
// import { StaffTracking } from "./MapComponent";
import useAuthentication from "@/app/hooks/useAuthentication";
import { useState } from "react";
import { getName } from "@/app/utils";
import { DisitrictList } from "../Dashboard";

interface Props {
  data: DisitrictList;
}

const DistrictCard = ({ data }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        width: "250px",
        borderRadius: "10px",
      }}
    >
      <div
        className="row d-flex m-1 mb-0 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col fw-bold">District</div>
        <div className="col text-end color-sea-blue fs-6 fw-bold">Division</div>
      </div>
      <div
        className="row d-flex m-1 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col">{data?.districtName}</div>
        <div className="col text-end color-sea-blue fs-6">
          {data?.divisionName}
        </div>
      </div>
    </div>
  );
};

export default DistrictCard;
