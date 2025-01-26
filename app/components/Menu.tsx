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
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="col-auto mb-2 shadow-sm"
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
      <div
        className={`row d-flex flex-wrap justify-content-center align-items-center m-0 ${
          showArrow && "mt-2"
        }`}
      >
        {icon && (
          <div className="col-auto text-lg-end text-md-center text-center px-0">
            <img
              src={icon}
              alt={icon}
              className="img-fluid"
              style={{
                width: `${isGrouped ? "30px" : "45px"}`,
                height: `${isGrouped ? "30px" : "45px"}`,
              }}
            />
          </div>
        )}
        {icon ? (
          <div
            className="col-auto text-white fw-normal text-wrap text-break px-0"
            style={{ fontSize: `${isGrouped ? "1.3rem" : "2.5rem"}` }}
          >
            <AnimatedCounter from={0} to={value} />
            {showPercentageSign && "%"}
          </div>
        ) : (
          <div
            className="col-auto text-white fw-bold px-0 text-wrap"
            style={{ fontSize: "2.5rem" }}
          >
            <AnimatedCounter from={0} to={value} />
            {showPercentageSign && "%"}
          </div>
        )}
      </div>
      <div className="col-auto text-center text-white px-2">
        {textWrap ? (
          <p className={`${isGrouped ? "fs-6" : "fs17px"} fw-normal mb-2`}>
            {label}
          </p>
        ) : (
          <p
            className={`${isGrouped ? "fs14px" : "fs17px"} mb-2 text-nowrap`}
            style={{ fontWeight: "500" }}
          >
            {label}
          </p>
        )}
      </div>
    </div>
  );
};

export default Menu;
