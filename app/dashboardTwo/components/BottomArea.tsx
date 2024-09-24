import Image from "next/image";
import { motion } from "framer-motion";
import locationImage from "../../../public/images/locationImage.png";
import uploadBlack from "../../../public/icons/uploadBlack.svg";

const BottomArea = () => {
  const items = ["a", "a", "a", "a", "a"];

  return (
    <div
      className="col shadow-sm mb-3 ms-3 me-3 pt-4 ps-4 pe-4 "
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="row d-flex"
        style={{
          overflowX: "scroll",
          overflow: "hidden",
        }}
      >
        <motion.div
          className="d-flex"
          drag="x" // Allow horizontal dragging
          dragConstraints={{ left: -(items.length * 330), right: 0 }} // Adjust based on content size
          whileTap={{ cursor: "grabbing" }}
        >
          {items.map((d, i) => (
            <div
              key={i}
              className="col-lg-3 col-md-6 col p-3 mb-3 me-4 bg-white"
              style={{
                borderRadius: "10px",
              }}
            >
              <div className="row d-flex">
                <div className="col">
                  <p
                    className="m-0 mb-1"
                    style={{ fontSize: "0.688rem", fontWeight: "500" }}
                  >
                    Lahore Ring Road
                  </p>
                  <p
                    className="m-0 mb-1 text-secondary fw-normal"
                    style={{ fontSize: "0.438rem" }}
                  >
                    11:19 AM&nbsp;&nbsp;&nbsp;Dec 21, 2022
                  </p>
                </div>
                <div className="col text-end">
                  <Image
                    src={uploadBlack}
                    alt="uploadBlack"
                    width={15}
                    height={15}
                  />
                </div>
              </div>

              <div
                className="col p-1 ms-1 me-1"
                style={{ borderTop: "0.49px solid #4F4F4F" }}
              ></div>
              <div className="col">
                <Image
                  src={locationImage}
                  alt="locationImage"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BottomArea;
