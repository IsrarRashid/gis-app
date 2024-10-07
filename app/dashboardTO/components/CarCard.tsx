import Image from "next/image";
import carCardBg from "../../../public/images/carCardBg.png";
import profilePic7 from "../../../public/images/profilePic7.png";
import phone2 from "../../../public/icons/phone2.svg";
import maximize from "../../../public/icons/maximize.svg";
import calender2 from "../../../public/icons/calender2.svg";

const CarCard = () => {
  return (
    <div
      className="card border-0"
      style={{
        width: "196px",
        borderRadius: "10px",
      }}
    >
      <div className="container p-0 position-relative">
        <Image
          src={carCardBg}
          width={196}
          height={107}
          className="card-img-top img-fluid"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            objectFit: "cover",
          }}
          alt="carBg"
        />
        <div
          className="position-absolute text-white fs12px ps-3 pe-3 pt-1 pb-1 rounded-3 fw-normal"
          style={{
            top: "0px",
            right: "-13px",
            borderRadius: "6px",
            letterSpacing: 2,
          }}
        >
          <Image src={maximize} className="mb-1 m-1" alt="maximize" />
        </div>
        <div
          className="position-absolute text-white fs12px rounded-3 fw-normal"
          style={{
            bottom: "8px",
            left: "8px",
            borderRadius: "5px",
            background: "#22B07D",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          In Use
        </div>
      </div>
      <div className="card-body">
        <h5
          className="card-title fw-bold fs12px mb-2"
          style={{ letterSpacing: 1 }}
        >
          Ford F150 A/T
        </h5>
        <p
          className="card-text text-secondary fs12px mb-2 fw-normal"
          style={{ letterSpacing: 1, marginTop: "10px", marginBottom: "10px" }}
        >
          Z785XAZ
        </p>
        <p className="mt-2 mb-2 fw-normal fs12px" style={{ letterSpacing: 1 }}>
          <Image
            src={profilePic7}
            className="mb-1 img-fluid"
            width={20}
            height={20}
            alt="profilePic7"
          />
          &nbsp;Ali
        </p>
        <p className="mt-3 mb-2 fs10px fw-normal" style={{ letterSpacing: 1 }}>
          <Image
            src={phone2}
            width={20}
            height={20}
            className="mb-1"
            alt="phone2"
          />
          &nbsp;031823000642
        </p>
        <p className="mt-3 mb-0 fs10px fw-normal" style={{ letterSpacing: 1 }}>
          <Image
            src={calender2}
            width={20}
            height={20}
            className="mb-1"
            alt="calender2"
          />
          &nbsp;5 Sep 2024
        </p>
      </div>
    </div>
  );
};

export default CarCard;
