import Image from "next/image";
import coin from "../../../public/icons/coin.svg";
import locationPoint from "../../../public/icons/locationPoint.svg";
import files from "../../../public/icons/files.svg";
import pieChart from "../../../public/images/pieChart.png";
import topRightArrow from "../../../public/icons/topRightArrow.svg";

const ChartMenu = () => {
  return (
    <div
      className="col p-4 mb-3 shadow-sm"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="row d-flex mb-3 pb-1"
        style={{ borderBottom: "1px dashed #97ABBD" }}
      >
        <div className="col-1 p-0">
          <Image src={locationPoint} alt="locationPoint" />
        </div>
        <div className="col">
          <p className="fw-bold m-0">Lahore Ring Road - Southern Loop (SL-3)</p>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <Image src={coin} alt="coin" />
        </div>
        <div className="col p-0">
          <p className="mt-2 m-0">
            <span className="fw-bold">Approved Cost:</span>{" "}
            <span className="fw-bold" style={{ color: "#727272" }}>
              17,785.8 M
            </span>
          </p>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <Image src={files} alt="files" />
        </div>
        <div className="col p-0">
          <p className="mt-2 m-0">
            <span className="fw-bold">Expenditure:</span>{" "}
            <span className="fw-bold" style={{ color: "#727272" }}>
              14,797 M
            </span>
          </p>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <Image src={pieChart} alt="pieChart" />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col-lg-7 col-md-7 col">
              <p className="mt-2 m-0">
                <span className="fw-bold">Progress:</span>{" "}
                <span className="fw-bold" style={{ color: "#727272" }}>
                  80%
                </span>
              </p>
            </div>
            <div className="col-lg-5 col-md-5 col">
              <p className="mt-2 m-0 text-success">
                <Image src={topRightArrow} alt="topRightArrow" /> +39.69%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartMenu;
