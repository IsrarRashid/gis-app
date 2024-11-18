import Image from "next/image";
import { useState } from "react";
import filterBlack from "@/public/icons/filterBlack.svg";
import { Lexend } from "next/font/google";
import Button from "@/app/components/Button";
import more from "@/public/icons/moreCircle.svg";
import vehicleTrackingIcon from "@/public/icons/vehicleTracking.svg";
import staffTrackingIcon from "@/public/icons/staffTracking.svg";
import Link from "next/link";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "400",
});

const TrackingButton = () => {
  const [selectedButton, setSelectedButton] = useState(1);

  return (
    <div
      className={`col mb-2 shadow-sm fs14px ${lexend.className}`}
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "20px 35px ",
      }}
    >
      <p className="col fw-bold mb-2">Tracking</p>
      <div className="row d-flex">
        <Link
          href="/dashboardTO"
          className="btn w-100 text-white fw-normal whiteSpaceNoWrap"
          style={{
            borderRadius: "8px",
            background: "#1E6BDD",
            marginBottom: "13px",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
        >
          <Image
            src={vehicleTrackingIcon}
            alt="vehicleTrackingIcon"
            style={{ marginBottom: "3px" }}
          />
          &nbsp;Vehicle Tracking
        </Link>
        <Link
          href="/dashboardST"
          className="btn w-100 mb-2 text-white fw-normal"
          style={{
            borderRadius: "8px",
            background: "#1E6BDD",
            paddingTop: "12px",
            paddingBottom: "12px",
          }}
        >
          <Image
            src={staffTrackingIcon}
            alt="staffTrackingIcon"
            style={{ marginBottom: "3px" }}
          />
          &nbsp;Staff Tacking
        </Link>
      </div>
    </div>
  );
};

export default TrackingButton;
