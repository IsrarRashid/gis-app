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
import { MainDashboard } from "./Dashboard";

interface Props {
  data: MainDashboard;
}

const Menu = ({ data }: Props) => {
  let showTides = false;
  return (
    <div className="row d-flex flex-wrap justify-content-start ps-3">
      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            borderRadius: "10px",
            backgroundImage:
              "linear-gradient(to bottom right, #40DDFF , #14BAE3, #13B1E6,#11AADF,#0B98C5)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 80 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <img
              src="/images/tideOne.png"
              alt="tideOne"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 105 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <img
              src="/images/tideTwo.png"
              alt="tideTwo"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div> */}
          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <img
                src="/icons/eyeBold.svg"
                alt="eyeBold"
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
                    {data?.totalProjects}
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
              <p className="fs18px fw-bold" style={{ letterSpacing: 1 }}>
                Total Projects
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(12, 140, 233, 0.4)",
            borderRadius: "10px",
            background: "rgba(12, 140, 233, 0.2)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ x: -200, y: 200 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: Math.random() * 100 }} // Move to Y = 0 (top)
            transition={{ duration: 3, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <img
              src="/images/tideOne.png"
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
              src="/images/tideTwo.png"
              alt="tideTwo"
              style={{ width: "200%", height: "170px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <img
                src="/icons/archery.svg"
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
                    {data?.monitoredProjects}
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
              <p className="fs18px fw-bold" style={{ letterSpacing: 1 }}>
                Monitored Projects
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(50, 179, 52, 0.4)",
            borderRadius: "10px",
            background: "rgba(45, 199, 84, 0.35)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 50 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <img
              src="/images/tideOneGreen.png"
              alt="tideOneGreen"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 65 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2, left: -30, right: 0 }}
          >
            <img
              src="/images/tideTwoGreen.png"
              alt="tideTwoGreen"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <img
                src="/icons/doubleTick.svg"
                alt="doubleTick"
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
                    {data?.defineLimitProjects}
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
              <p className="fs18px fw-bold" style={{ letterSpacing: 1 }}>
                Within Defined Limit
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(232, 192, 15, 0.4)",
            borderRadius: "10px",
            background: "rgba(224, 255, 22, 0.4)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 30 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <img
              src="/images/tideOneYellow.png"
              alt="tideOneYellow"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 40 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2 }}
          >
            <img
              src="/images/tideTwoYellow.png"
              alt="tideTwoYellow"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <img
                src="/icons/bulb.svg"
                alt="bulb"
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
                    {data?.needConsidrationProjects}
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-white mt-2">
                  {/* <img src={waveUp} alt="waveUp" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs18px fw-bold" style={{ letterSpacing: 1 }}>
                Need Consideration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="col ps-0 pe-3">
        <div
          className="col mb-2 p-0"
          style={{
            outline: "1px solid rgba(233, 12, 16, 0.4)",
            borderRadius: "10px",
            background: "rgba(233, 12, 16, 0.26)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ x: -50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 30 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -1, left: -50, right: 0 }}
          >
            <img
              src="/images/tideOneRed.png"
              alt="tideOneRed"
              style={{ width: "150%", height: "130px" }}
            />
          </motion.div>

          <motion.div
            initial={{ x: 50, y: 130 }} // Start from Y position (dynamic)
            animate={{ x: 0, y: 40 }} // Move to Y = 0 (top)
            transition={{ duration: 2, ease: "easeInOut" }} // Control duration and easing
            style={{ position: "absolute", zIndex: -2 }}
          >
            <img
              src="/images/tideTwoRed.png"
              alt="tideTwoRed"
              style={{ width: "150%", height: "100px" }}
            />
          </motion.div>

          <div className="row d-flex m-0 ps-3 pt-2">
            <div className="col-lg-6 col-md-6 col mt-4 text-lg-end text-md-center text-center">
              <img
                src="/icons/critical.svg"
                alt="critical"
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
                    {data?.criticalProjects}
                  </p>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 fs11px text-white mt-2">
                  {/* <img src={waveUp} alt="waveUp" width={50} height={20} />
                  &nbsp;&nbsp;<span className="fs11px">-5.23%</span> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row m-0">
            <div className="col text-center text-white mt-2">
              <p className="fs18px fw-bold" style={{ letterSpacing: 1 }}>
                Critical
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
