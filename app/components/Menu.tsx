import Image from "next/image";
import eyeBold from "../../../public/icons/eyeBold.svg";
import archery from "../../../public/icons/archery.svg";
import meter from "../../../public/icons/meter.svg";
import levelUp from "../../../public/icons/levelUp.svg";
import waveUp from "../../../public/icons/waveUp.svg";
import waveDown from "../../../public/icons/waveDown.svg";
import tideOne from "../../../public/images/tideOne.png";
import tideTwo from "../../../public/images/tideTwo.png";
import tideOneGreen from "../../../public/images/tideOneGreen.png";
import tideTwoGreen from "../../../public/images/tideTwoGreen.png";
import tideOneYellow from "../../../public/images/tideOneYellow.png";
import tideTwoYellow from "../../../public/images/tideTwoYellow.png";
import tideOneRed from "../../../public/images/tideOneRed.png";
import tideTwoRed from "../../../public/images/tideTwoRed.png";
import { motion } from "framer-motion";
import Button from "@/app/components/Button";
import { CSSProperties } from "react";

interface Props {
  tideOneImage?: string;
  tideTwoImage?: string;
  icon: string;
  value: number;
  label: string;
  showTides: boolean;
  background?: string;
  outline?: string;
}

const Menu = ({
  background,
  tideOneImage = "/images/tideOne.png",
  tideTwoImage = "/images/tideTwo.png",
  icon,
  value,
  label,
  showTides,
  outline,
}: Props) => {
  return (
    <div className="col ps-0 pe-3">
      <div
        className="col mb-2 p-0"
        style={{
          outline: outline,
          background: background,
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {showTides && (
          <>
            <motion.div
              initial={{ x: -200, y: 200 }} // Start from Y position (dynamic)
              animate={{ x: 0, y: Math.random() * 100 }} // Move to Y = 0 (top)
              transition={{ duration: 3, ease: "easeInOut" }} // Control duration and easing
              style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
            >
              <img
                src={tideOneImage}
                alt="tideOne"
                style={{ width: "160%", height: "170px" }}
              />
            </motion.div>

            <motion.div
              initial={{ x: 200, y: 200 }} // Start from Y position (dynamic)
              animate={{ x: -200, y: Math.random() * 100 }} // Move to Y = 0 (top)
              transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
              style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
            >
              <img
                src={tideTwoImage}
                alt="tideTwo"
                style={{ width: "200%", height: "170px" }}
              />
            </motion.div>
          </>
        )}

        <div className="row d-flex m-0 ps-3 pt-2">
          <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
            <img
              src={icon}
              alt="archery"
              className="img-fluid mt-2"
              style={{ width: "76px", height: "76px" }}
            />
          </div>
          <div className="col-lg-6 col-md-6 col mt-4">
            <div className="row">
              <div
                className="col-lg-12 col-md-12 col-sm-12"
                style={{ height: "60px" }}
              >
                <p
                  className="text-white fw-bold m-0 pt-2"
                  style={{ fontSize: "3rem" }}
                >
                  {value}
                </p>
              </div>
              <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger mt-2">
                {/* <img src={waveDown} alt="waveDown" width={50} height={20} />
              &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="row m-0">
          <div className="col text-center text-white mt-2">
            <p
              className="fs18px fw-bold"
              style={{ letterSpacing: 1, whiteSpace: "nowrap" }}
            >
              {label}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
