import Image from "next/image";
import carCardBg from "../../../../public/images/carCardBg.png";
import maximize from "../../../../public/icons/maximize.svg";
import phone3 from "../../../../public/icons/phone3.svg";
import staffMember1 from "../../../../public/images/staffMember1.png";
import { StaffTracking } from "./MapCarsComponent";
import useAuthentication from "@/app/hooks/useAuthentication";
import { useState } from "react";
import { getName } from "@/app/utils";

interface Props {
  data: StaffTracking;
}

const CarCard = ({ data }: Props) => {
  const [refresh, setRefresh] = useState(false);
  const { data: users } = useAuthentication({ refresh });
  return (
    <div
      className="card border-0"
      style={{
        width: "196px",
        borderRadius: "10px",
      }}
    >
      <div className="row d-flex m-0 pb-1">
        <div className="col-3 p-1">
          <Image
            src={staffMember1}
            className="mb-1 img-fluid"
            width={37}
            height={37}
            alt="staffMember1"
          />
        </div>
        <div className="col ps-0">
          <p
            className="mt-1 mb-0 fw-normal fs10px"
            style={{ letterSpacing: 1 }}
          >
            <div className="row d-flex mt-2">
              <div className="col pe-0">{getName(data.userID, users)}</div>
              <div
                className="col text-end color-sea-blue fs8px ps-0"
                style={{ marginTop: "2px" }}
              >
                Engineer
              </div>
            </div>
          </p>
          <p
            className="m-0 mt-1 fs10px fw-normal text-secondary"
            style={{ letterSpacing: 1 }}
          >
            <Image
              src={phone3}
              width={10}
              height={10}
              className="mb-1"
              alt="phone3"
            />
            &nbsp;031823000642
          </p>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
