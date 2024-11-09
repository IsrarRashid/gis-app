import Image from "next/image";
import cultus from "@/public/images/cultus.png";
import driver from "@/public/images/driver.png";
import petrol from "@/public/images/petrol.png";
import engineerAhsanArif from "@/public/images/engineerAhsanArif.png";
import phone3 from "@/public/icons/phone3.svg";
import redCircle2 from "@/public/icons/redCircle2.svg";
import greenCircle from "@/public/icons/greenCircle.svg";
import meter2 from "@/public/icons/meter2.svg";
import distanceTraveled from "@/public/icons/distanceTraveled.svg";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Tracking } from "./MapCarsComponent";

interface Props {
  apiData: Tracking;
}

const CarCard = ({ apiData }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        width: "400px",
        borderRadius: "10px",
      }}
    >
      <div className="container p-0 position-relative shadow-sm text-center">
        <Image
          src={cultus}
          className="img-fluid card-img-top mt-2 mb-5"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            objectFit: "contain",
            width: "250px",
            height: "150px",
          }}
          alt="cultus"
        />
        {apiData["GBB-062"]["Engine value"] === "stopped" ? (
          <div
            className="position-absolute text-white fs-6 rounded-3 fw-normal bg-danger"
            style={{
              top: "10px",
              right: "10px",
              borderRadius: "5px",
              letterSpacing: 1,
              padding: "5px 12px 2px 12px",
            }}
          >
            Stopped
          </div>
        ) : (
          <div
            className="position-absolute text-white fs-6 rounded-3 fw-normal"
            style={{
              top: "10px",
              right: "10px",
              borderRadius: "5px",
              background: "#22B07D",
              letterSpacing: 1,
              padding: "5px 12px 2px 12px",
            }}
          >
            In Use
          </div>
        )}

        <div
          className="position-absolute fs-5 rounded-3 fw-normal"
          style={{
            bottom: "25px",
            left: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          {apiData["GBB-062"]["Engine value"] === "stopped" ? (
            <>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Engine: Off</Tooltip>}
              >
                <Image
                  src={redCircle2}
                  width={10}
                  height={10}
                  className="mb-1"
                  alt="redCircle2"
                />
              </OverlayTrigger>
            </>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Engine Running</Tooltip>}
            >
              <Image
                src={greenCircle}
                width={12}
                height={12}
                className="mb-1"
                alt="greenCircle"
              />
            </OverlayTrigger>
          )}{" "}
          {apiData["GBB-062"].Vehicle_Make} {apiData["GBB-062"].Vehicle_Model}
        </div>
        <div
          className="position-absolute fs-5 rounded-3 fw-normal"
          style={{
            bottom: "25px",
            right: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          {apiData["GBB-062"].Vehicle_Device}
        </div>
        <div
          className="position-absolute fs-5 rounded-3 fw-normal"
          style={{
            bottom: "0px",
            left: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={meter2}
            width={20}
            height={20}
            style={{ marginBottom: "2px" }}
            alt="meter2"
          />{" "}
          {apiData["GBB-062"].Speed} km/h
        </div>
        <div
          className="position-absolute fs-5 rounded-3 fw-normal"
          style={{
            bottom: "0px",
            left: "32%",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={distanceTraveled}
            width={20}
            height={20}
            style={{ marginBottom: "2px" }}
            alt="distanceTraveled"
          />{" "}
          {apiData["GBB-062"]["Distance traveled"]} km
        </div>
        <div
          className="position-absolute fs-5 rounded-3 fw-normal"
          style={{
            bottom: "0px",
            right: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={petrol}
            width={18}
            height={18}
            style={{ marginBottom: "2px" }}
            alt="petrol"
          />{" "}
          {apiData["GBB-062"]["Fuel burned"]} Ltr
        </div>
      </div>
      <div className="card-body pt-2 pb-2">
        <div
          className="row d-flex m-0 mb-2 pb-1"
          style={{ borderBottom: "1px dashed #D5D5D5" }}
        >
          <div className="col-2 p-0 m-auto">
            <Image
              src={engineerAhsanArif}
              className="mb-1 img-fluid"
              width={37}
              height={37}
              alt="engineerAhsanArif"
            />
          </div>
          <div className="col ps-0 pe-0">
            <p
              className="mt-1 mb-0 fw-normal fs-5"
              style={{ letterSpacing: 1 }}
            >
              <div className="row d-flex mt-1">
                <div className="col pe-0">Saad Bodla</div>
                <div
                  className="col text-end color-sea-blue fs-6 ps-0"
                  style={{ marginTop: "2px" }}
                >
                  Engineer
                </div>
              </div>
            </p>
            <p
              className="m-0 mt-1 fs-5 fw-normal text-secondary"
              style={{ letterSpacing: 1 }}
            >
              <Image
                src={phone3}
                width={20}
                height={20}
                className="mb-1"
                alt="phone3"
              />
              &nbsp;031823000642
            </p>
          </div>
        </div>
        <div className="row d-flex m-0">
          <div className="col-2 p-0 m-auto">
            <Image
              src={driver}
              className="mb-1 img-fluid"
              width={37}
              height={37}
              alt="driver"
            />
          </div>
          <div className="col ps-0 pe-0">
            <p
              className="mt-1 mb-0 fw-normal fs-5"
              style={{ letterSpacing: 1 }}
            >
              <div className="row d-flex mt-1">
                <div className="col pe-0">Ali Raza (Junior)</div>
                <div
                  className="col-3 text-end color-sea-blue fs-6 ps-0"
                  style={{ marginTop: "2px" }}
                >
                  Driver
                </div>
              </div>
            </p>
            <p
              className="m-0 mt-1 fs-5 fw-normal text-secondary"
              style={{ letterSpacing: 1 }}
            >
              <Image
                src={phone3}
                width={20}
                height={20}
                className="mb-1"
                alt="phone3"
              />
              &nbsp;03182342344
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
