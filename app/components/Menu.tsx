import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

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
        {showTides && (
          <div style={{ position: "absolute", right: 0 }}>
            <img
              src="/icons/linkArrow.svg"
              className="img-fluid"
              style={{ width: "30px", height: "30px" }}
              alt="linkArrow"
            />
          </div>
        )}
        <div className="row d-flex flex-wrap m-0 pt-2">
          <div className="col-lg-5 col-md-5 col mt-4 text-lg-end text-md-center text-center pe-0">
            <img
              src={icon}
              alt="archery"
              className="img-fluid mt-2"
              style={{ width: "76px", height: "76px" }}
            />
          </div>
          <div className="col-lg-7  col-md-7 col mt-4 ps-0">
            <div className="row m-0">
              <div
                className="col text-white fw-bold m-0 pt-2 text-wrap ps-0"
                style={{ fontSize: "3rem" }}
              >
                <AnimatedCounter from={0} to={value} />
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
