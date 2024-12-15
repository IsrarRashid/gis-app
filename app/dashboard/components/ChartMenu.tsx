import Image from "next/image";
import coin from "../../../public/icons/coin.svg";
import locationPoint from "../../../public/icons/locationPoint.svg";
import files from "../../../public/icons/files.svg";
import pieChart from "../../../public/images/pieChart.png";
import topRightArrow from "../../../public/icons/topRightArrow.svg";
import { MainDashboard } from "./Dashboard";
import CustomModal from "@/app/components/CustomModal";

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
        padding: "20px",
        color: "#334155",
      }}
    >
      <div
        className="col p-2 rounded-2 mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="row d-flex m-0">
          <div className="col fw-bold text-start">Approved Cost:</div>{" "}
          <div
            className="col fw-bold text-end pe-3"
            style={{ color: "#727272" }}
          >
            {data?.approvedCost} M
          </div>
        </div>
      </div>
      <div
        className="col p-2 rounded-2 mb-2"
        style={{ background: "rgba(235, 239, 253, 0.33)" }}
      >
        <div className="row d-flex m-0">
          <div className="col fw-bold text-start">Expenditure:</div>{" "}
          <div
            className="col fw-bold text-end pe-3"
            style={{ color: "#727272" }}
          >
            {data?.expenditure} M
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartMenu;
