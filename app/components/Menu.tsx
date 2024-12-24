import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { useEffect, useState } from "react";

interface Props {
  tideOneImage?: string;
  tideTwoImage?: string;
  icon?: string;
  value: number;
  label: string;
  showTides?: boolean;
  background?: string;
  outline?: string;
  showPercentageSign?: boolean;
  showArrow?: boolean;
  textWrap?: boolean;
  isGrouped?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Menu = ({
  background,
  tideOneImage = "/images/tideOne.png",
  tideTwoImage = "/images/tideTwo.png",
  onMouseEnter = () => {},
  onMouseLeave = () => {},
  icon,
  value,
  label,
  showTides,
  outline,
  showPercentageSign = false,
  showArrow = false,
  textWrap = true,
  isGrouped = false,
}: Props) => {
  const [randomValue1, setRandomValue1] = useState(0);
  const [randomValue2, setRandomValue2] = useState(0);

  useEffect(() => {
    setRandomValue1(Math.random() * 100);
    setRandomValue2(Math.random() * 100);
  }, []);

  return (
    <div className="col">
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="col mb-2 shadow-sm"
        style={{
          outline: outline,
          background: background,
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          transition: "background .4s, outline .4s",
        }}
      >
        {showTides && (
          <>
            <motion.div
              initial={{ x: -200, y: 200 }} // Start from Y position (dynamic)
              animate={{ x: 0, y: randomValue1 }} // Move to Y = 0 (top)
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
              animate={{ x: -200, y: randomValue2 }} // Move to Y = 0 (top)
              transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
              style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
            >
              <img
                src={tideTwoImage}
                alt="tideTwo"
                style={{ width: "250%", height: "170px" }}
              />
            </motion.div>
          </>
        )}
        {showArrow && (
          <div style={{ position: "absolute", right: 0 }}>
            <img
              src="/icons/linkArrow.svg"
              className="img-fluid"
              style={{
                width: `${isGrouped ? "20px" : "30px"}`,
                height: `${isGrouped ? "20px" : "30px"}`,
              }}
              alt="linkArrow"
            />
          </div>
        )}
        <div className="row d-flex flex-wrap m-0">
          <div className="col-lg-5 col-md-5 col text-lg-end text-md-center text-center pe-0 m-auto">
            {icon && (
              <img
                src={icon}
                alt={icon}
                className="img-fluid"
                style={{
                  width: `${isGrouped ? "36px" : "50px"}`,
                  height: `${isGrouped ? "36px" : "50px"}`,
                }}
              />
            )}
          </div>
          {icon ? (
            <div className="col-lg-7 col-md-7 col ps-0">
              <div className="row m-0">
                <div
                  className="col text-white fw-normal text-wrap text-break px-0"
                  style={{ fontSize: `${isGrouped ? "1.6rem" : "3rem"}` }}
                >
                  <AnimatedCounter from={0} to={value} />
                  {showPercentageSign && "%"}
                </div>
                {/* <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger">
                  <img src={waveDown} alt="waveDown" width={50} height={20} />
              &nbsp;&nbsp;<span className="fs11px">-5.23%</span>
                </div> */}
              </div>
            </div>
          ) : (
            <div className="col-lg-12 col-md-12 col text-center">
              <div className="row m-0">
                <div
                  className="col text-white fw-bold m-0 pt-2 px-0 text-wrap"
                  style={{ fontSize: "3rem" }}
                >
                  <AnimatedCounter from={0} to={value} />
                  {showPercentageSign && "%"}
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-danger">
                  {/* <img src={waveDown} alt="waveDown" width={50} height={20} />
              &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="row m-0">
          <div className="col text-center text-white">
            {textWrap ? (
              <p
                className={`${isGrouped ? "fs16px" : "fs17px"} fw-normal mb-2`}
                style={{ letterSpacing: 1 }}
              >
                {label}
              </p>
            ) : (
              <p
                className={`${
                  isGrouped ? "fs14px" : "fs17px"
                } fw-normal mb-2 text-nowrap`}
                style={{ letterSpacing: 1 }}
              >
                {label}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
