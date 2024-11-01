import Image from "next/image";
import coin from "../../../public/icons/coin.svg";
import locationPoint from "../../../public/icons/locationPoint.svg";
import files from "../../../public/icons/files.svg";
import pieChart from "../../../public/images/pieChart.png";
import topRightArrow from "../../../public/icons/topRightArrow.svg";
import { MainDashboard } from "./Dashboard";

interface Props {
  data: MainDashboard;
}

const ChartMenu = ({ data }: Props) => {
  return (
    <div
      className="col mb-3 shadow-sm"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
        padding: "20px 35px 15px 35px ",
      }}
    >
      <div
        className="row d-flex rounded-2 mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <Image src={coin} alt="coin" />
        </div>
        <div className="col p-0">
          <p className="mt-2 m-0">
            <span className="fw-bold">Approved Cost:</span>{" "}
            <span className="fw-bold" style={{ color: "#727272" }}>
              {data?.approvedCost} M
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
              {data?.expenditure} M
            </span>
          </p>
        </div>
      </div>
      <div
        className="row d-flex rounded mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="col-2 p-0">
          <img
            src="/images/pieChart.png"
            alt="pieChart"
            className="img-fluid"
          />
        </div>
        <div className="col p-0">
          <div className="row d-flex">
            <div className="col">
              <p className="mt-2 m-0">
                <span className="fw-bold">Financial Progress:</span>{" "}
                <span className="fw-bold" style={{ color: "#727272" }}>
                  {Math.round(data?.progress)} %
                </span>
              </p>
            </div>
            {/* <div className="col-lg-5 col-md-5 col">
              <p className="mt-2 m-0 text-success">
                <Image src={topRightArrow} alt="topRightArrow" /> +39.69%
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartMenu;
