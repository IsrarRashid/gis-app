import Image from "next/image";
import downloadLineBlack from "../../../public/icons/downloadLineBlack.svg";
import adobeAcrobat from "../../../public/icons/adobeAcrobat.svg";
import { motion } from "framer-motion";

const Reports = () => {
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
            <h4 className="fw-bold mt-2">Reports</h4>
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
            dragConstraints={{ top: -(items.length * 60), bottom: 0 }} // Adjust based on content size
            whileTap={{ cursor: "grabbing" }}
          >
            {items.map((d, i) => (
              <div
                key={i}
                className="row d-flex p-2 mb-2 ms-2 me-2"
                style={{
                  background: "#DCE9F5",
                  border: ".8px dashed rgba(151, 171, 189, .5)",
                  borderRadius: "10px",
                }}
              >
                <div className="col">
                  <div className="row d-flex">
                    <div className="col-lg-2 col-md-2 col mt-2">
                      <Image src={adobeAcrobat} alt="adobeAcrobat" />
                    </div>
                    <div className="col-lg-10 col-md-9 col">
                      <p className="m-0 mt-1 fs13px fw-bold">
                        Project Report 1.pdf
                      </p>
                      <p className="m-0 fs10px text-secondary">Size: 1.3 MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-md-2 col text-end mt-2">
                  <button className="btn p-0">
                    <Image
                      src={downloadLineBlack}
                      alt="downloadLineBlack"
                      width={12}
                      height={16}
                    />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
