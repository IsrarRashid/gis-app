import Image from "next/image";
import profilePic6 from "../../../public/images/profilePic6.png";
import phone from "../../../public/icons/phone.svg";
import locationPointDash from "../../../public/icons/locationPointDash.svg";
import carFrontBlue from "../../../public/icons/carFrontBlue.svg";
import warning from "../../../public/icons/warning.svg";
import moreCircle from "../../../public/icons/moreCircle.svg";
import rightArrowCircle from "../../../public/icons/rightArrowCircle.svg";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  MdOutlineStar,
  MdOutlineStarHalf,
  MdOutlineStarOutline,
} from "react-icons/md";

const Drivers = () => {
  const [activeButton, setActiveButton] = useState<string>("available");

  const items2 = ["a", "a", "a", "a", "a", "a"];

  const refContainer2 = useRef<HTMLDivElement>(null);
  const refContent2 = useRef<HTMLDivElement>(null);
  const [constraints2, setConstraints2] = useState({});

  useEffect(() => {
    // Wait until both container and content are rendered
    if (refContainer2.current && refContent2.current) {
      // Calculate the width difference between container and content
      const containerHeight = refContainer2.current.offsetHeight;
      const contentHeight = refContent2.current.scrollHeight;
      // Set drag constraints dynamically based on the difference
      setConstraints2({ bottom: 0, top: -(contentHeight - containerHeight) });
    }
  }, []); // Recalculate if the items change

  return (
    <div
      className="col shadow-sm mb-3 ms-2 me-2"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="col pt-2 ms-3 me-3">
        <div className="row d-flex m-0">
          <div className="col">
            <h4
              className="fw-bold mt-2 fs18px"
              style={{
                color: "#0153AF",
                letterSpacing: "1px",
              }}
            >
              Drivers
            </h4>
          </div>
          <div className="col text-end">
            <button
              className="btn p-1 mt-1 fs12px"
              style={{
                padding: "15px 20px 15px 20px",
                fontWeight: 600,
                letterSpacing: "1px",
              }}
            >
              See All
            </button>
          </div>
        </div>
      </div>
      <div className="row d-flex mb-1">
        <div className="col text-center pe-0">
          <button
            className="btn mt-2 p-0 w-100 fs14px"
            style={{
              borderBottom:
                activeButton === "available"
                  ? "2px solid #0153AF"
                  : "2px solid #E0E0E0",
              letterSpacing: "1px",
              outline: "none",
              boxShadow: "none",
            }}
            onClick={() => setActiveButton("available")}
          >
            Available
          </button>
        </div>
        <div className="col text-center ps-0">
          <button
            className="btn mt-2 p-0 w-100 fs14px"
            style={{
              letterSpacing: "1px",
              borderBottom:
                activeButton === "inUse"
                  ? "2px solid #0153AF"
                  : "2px solid #E0E0E0",
              outline: "none",
              boxShadow: "none",
            }}
            onClick={() => setActiveButton("inUse")}
          >
            In Use
          </button>
        </div>
      </div>
      <div className="row d-flex pt-0 pb-2 m-2">
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          ref={refContainer2}
          style={{
            height: "270px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            position: "relative",
            overflow: "hidden",
            borderRadius: "12px",
          }}
        >
          <motion.div
            className="d-flex flex-column"
            drag="y" // Allow horizontal dragging
            dragConstraints={constraints2} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
            ref={refContent2}
          >
            {items2.map((d, i) => (
              <div
                key={i}
                className="row d-flex p-2 mb-2"
                style={{
                  background: "#F4F6F9",
                  border: "1px solid #D5DEEF",
                  borderRadius: "12px",
                }}
              >
                <div className="row d-flex pe-0">
                  <div className="col-lg-10 col-md-10 col-sm-12 p-0">
                    <div className="row d-flex p-2">
                      <div className="col-lg-4 col-md-4 col-sm-12 text-center">
                        <Image
                          src={profilePic6}
                          className="img-fluid mb-2"
                          alt="profilePic6"
                          width={64}
                          height={64}
                        />
                        <div className="text-center">
                          <MdOutlineStar style={{ color: "#FEC003" }} />
                          <MdOutlineStar style={{ color: "#FEC003" }} />
                          <MdOutlineStar style={{ color: "#FEC003" }} />
                          <MdOutlineStarHalf style={{ color: "#FEC003" }} />
                          <MdOutlineStarOutline style={{ color: "#FEC003" }} />
                        </div>
                        <p
                          className="m-0 fs12px fw-normal text-center"
                          style={{ color: "#627394" }}
                        >
                          Z785XAZ
                        </p>
                      </div>
                      <div className="col-lg-8 col-md-8 col">
                        <p className="m-0 fs18px fw-bold mb-2">Amjad Ali Aga</p>
                        <p
                          className="m-0 fs14px fw-normal mb-1"
                          style={{ color: "#757575" }}
                        >
                          <Image
                            src={carFrontBlue}
                            alt="carFrontBlue"
                            width={15}
                            height={14}
                          />{" "}
                          Suzuki Alto - White - 660
                        </p>
                        <p
                          className="m-0 fs14px fw-normal mb-1"
                          style={{ color: "#757575" }}
                        >
                          <Image
                            src={phone}
                            alt="phone"
                            width={15}
                            height={14}
                          />{" "}
                          Suzuki 0318-8711749
                        </p>
                        <p
                          className="m-0 fs14px fw-normal mb-1"
                          style={{ color: "#757575" }}
                        >
                          <Image
                            src={locationPointDash}
                            alt="locationPointDash"
                            width={15}
                            height={15}
                          />{" "}
                          Lahore
                        </p>
                        <p
                          className="m-0 fs8px fw-normal rounded p-1"
                          style={{ background: "#FFE8B2" }}
                        >
                          <Image
                            src={warning}
                            style={{ marginBottom: "1px" }}
                            alt="warning"
                            width={10}
                            height={10}
                          />
                          &nbsp;&nbsp;License not Checked for 1 year.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-2 col text-end p-0">
                    <button className="btn p-0">
                      <Image src={moreCircle} alt="moreCircle" />
                    </button>
                    &nbsp;
                    <button className="btn p-0">
                      <Image src={rightArrowCircle} alt="rightArrowCircle" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;
