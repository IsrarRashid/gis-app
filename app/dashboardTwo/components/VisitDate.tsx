import Image from "next/image";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import blueClock from "../../../public/icons/blueClock.svg";
import { motion } from "framer-motion";

const VisitDate = () => {
  const items = ["a", "a", "a", "a"];
  return (
    <div
      className="col shadow-sm mb-3 ms-3 me-3 pt-4 ps-4 pe-4 "
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="row d-flex m-0">
        <div
          className="col pb-1 mb-3"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="col">
            <h4 className="fw-bold mt-2">Visit Date</h4>
          </div>
        </div>
      </div>
      <div className="row pb-2">
        <div
          className="col"
          style={{
            height: "255px",
            whiteSpace: "nowrap",
            overflowY: "scroll",
            overflow: "hidden",
          }}
        >
          <motion.div
            className="d-flex flex-column"
            drag="y" // Allow horizontal dragging
            dragConstraints={{ top: -(items.length * 90), bottom: 0 }} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
          >
            {items.map((d, i) => (
              <div
                key={i}
                className="row d-flex p-2 mb-2 bg-white ms-2 me-2"
                style={{
                  borderRadius: "10px",
                }}
              >
                <div className="col-lg-3 col-md-3 col mt-2">
                  <Image src={blueClock} alt="blueClock" />
                </div>
                <div className="col-lg-9 col-md-9 col ps-0">
                  <p className="m-0 mt-1 fs14px">Lahore Ring Road</p>
                  <p className="m-0 fw-bold fs-5">30/03/2024</p>
                  <p className="m-0 fs12px" style={{ color: "#B1B1B1" }}>
                    2 days ago
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisitDate;
