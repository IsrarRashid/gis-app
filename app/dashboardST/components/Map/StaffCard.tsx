import Image from "next/image";
import carCardBg from "../../../../public/images/carCardBg.png";
import maximize from "../../../../public/icons/maximize.svg";
import phone3 from "../../../../public/icons/phone3.svg";
import staffMember from "@/public/icons/staffMember.svg";
import useAuthentication from "@/app/hooks/useAuthentication";
import { useEffect, useState } from "react";
import { formatDateTime, getName } from "@/app/utils";
import { StaffTracking } from "../DashboardST";
import { reverseGeoCodingAPI } from "@/app/APIs";

interface Props {
  data: StaffTracking;
  setSelectedStaffIndex: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  startLocation: string | undefined;
  endLocation: string | undefined;
}

const StaffCard = ({
  data,
  setSelectedStaffIndex,
  startLocation,
  endLocation,
}: Props) => {
  const [refresh, setRefresh] = useState(false);
  const { data: users } = useAuthentication({ refresh });
  return (
    <div
      className="card border-0 letterSpacing1px"
      style={{
        width: "350px",
        borderRadius: "10px",
      }}
    >
      {data && users && (
        <>
          <div className="row d-flex m-0">
            <div className="col">
              <span
                className="badge rounded-pill text-white fs14px fw-normal p-2"
                style={{ background: "#81BFC0" }}
              >
                <img
                  src="/icons/whiteCircle.svg"
                  className="img-fluid"
                  style={{ width: "8px", height: "8px", marginBottom: "2px" }}
                />{" "}
                {data.status === "completed" ? "Completed" : "Ongoing"}
              </span>
            </div>
            <div className="col text-end p-0">
              <button
                className="btn shadow-none"
                onClick={() => setSelectedStaffIndex(9 + parseInt("a"))}
              >
                <img src="/icons/cross.svg" alt="cross" />
              </button>
            </div>
          </div>

          <div className="col text-center">
            {data.userPicture && data.userPicture.length > 0 ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.userPicture}`}
                className="mb-1 img-fluid rounded-circle shadow"
                style={{
                  width: "90px",
                  height: "90px",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
                alt="staffMember"
              />
            ) : (
              <Image
                src={staffMember}
                className="mb-1 img-fluid rounded-circle shadow"
                width={90}
                height={90}
                alt="staffMember"
              />
            )}
          </div>
          <div className="col text-center fs-5 fw-bold">{data.userName}</div>
          <div
            className="col text-center fs14px fw-normal mb-2"
            style={{ color: "#696E77" }}
          >
            {data.designation}
          </div>
          <div
            className="col py-2 px-4 m-0 mb-2"
            style={{
              background: "#F3F6F9",
              borderRadius: "10px",
              border: "1px solid #DCE2E7",
            }}
          >
            <div className="row d-flex m-0 mb-2">
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  Visit Start Date
                </p>
                <p className="fs-6 m-0 fw-normal">
                  {formatDateTime(data.visitStartTime, "date")}
                </p>
              </div>
              <div className="col-1 p-0 img-fluid">
                <img
                  src="/icons/verticalLine.svg"
                  alt="verticalLine"
                  className="img-fluid"
                  style={{ width: "100%", height: "30px" }}
                />
              </div>
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  Visit End Date
                </p>
                <p className="fs-6 m-0 fw-normal">
                  {data.status === "completed"
                    ? formatDateTime(data.visitEndTime, "date")
                    : "---"}
                </p>
              </div>
            </div>
            <div className="row d-flex m-0 mb-2">
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  Visit Start Time
                </p>
                <p className="fs-6 m-0 fw-normal">
                  {formatDateTime(data.visitStartTime, "time")}
                </p>
              </div>
              <div className="col-1 p-0 img-fluid">
                <img
                  src="/icons/verticalLine.svg"
                  alt="verticalLine"
                  className="img-fluid"
                  style={{ width: "100%", height: "30px" }}
                />
              </div>
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  Visit End Time
                </p>
                <p className="fs-6 m-0 fw-normal">
                  {data.status === "completed"
                    ? formatDateTime(data.visitEndTime, "time")
                    : "---"}
                </p>
              </div>
            </div>
            <div
              className="row d-flex mb-2"
              style={{ marginLeft: "-20px", marginRight: "0px" }}
            >
              <div className="col-1 p-0">
                <img
                  src="/icons/twoCirclesVertical.svg"
                  alt="twoCirclesVertical"
                  className="img-fluid mt-1"
                  style={{ width: "100%", height: "60px" }}
                />
              </div>
              <div className="col p-0">
                <div className="col p-0 mb-1">
                  <p
                    className="m-0 fs14px fw-normal"
                    style={{ color: "#7A889C" }}
                  >
                    Start Location
                  </p>
                  <p className="m-0 fs-6 fw-normal">{startLocation}</p>
                </div>
                <div className="col p-0">
                  <p
                    className="m-0 fs14px fw-normal"
                    style={{ color: "#7A889C" }}
                  >
                    End Location
                  </p>
                  <p className="m-0 fs-6 fw-normal">{endLocation}</p>
                </div>
              </div>
            </div>
            <div className="row d-flex m-0">
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  Driver Name
                </p>
                <p className="fs-6 m-0 fw-normal">{data.driverName}</p>
              </div>
              <div className="col">
                <p
                  className="fs14px m-0 fw-normal"
                  style={{ color: "#7A889C" }}
                >
                  &nbsp;
                </p>
                <p className="fs-6 m-0 fw-normal">
                  <img
                    src="/icons/carSideViewBlack.svg"
                    alt="carSideViewBlack"
                    className="img-fluid"
                    style={{ width: "18px", height: "18px" }}
                  />{" "}
                  {data.carNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="col fs-6 fw-normal m-0">{data.projectName}</div>
        </>
      )}
    </div>
  );
};

export default StaffCard;
