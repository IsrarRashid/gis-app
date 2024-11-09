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
      className="col mb-2 shadow-sm fs14px"
      style={{
        background: "#C6D9F1",
        borderRadius: "10px",
        padding: "5px 35px 1px 35px ",
        color: "#334155",
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
    </div>
  );
};

export default ChartMenu;
