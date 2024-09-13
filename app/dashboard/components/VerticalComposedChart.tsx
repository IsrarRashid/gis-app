"use client";
import Image from "next/image";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import greenCircle from "../../../public/icons/greenCircle.svg";
import blueCircle from "../../../public/icons/blueCircle.svg";

const data = [
  {
    name: "Page A",
    uv: 590,
    pv: 800,
    amt: 1400,
  },
  {
    name: "Page B",
    uv: 868,
    pv: 967,
    amt: 1506,
  },
  {
    name: "Page C",
    uv: 1397,
    pv: 1098,
    amt: 989,
  },
  {
    name: "Page D",
    uv: 1480,
    pv: 1200,
    amt: 1228,
  },
  {
    name: "Page E",
    uv: 1520,
    pv: 1108,
    amt: 1100,
  },
  {
    name: "Page F",
    uv: 1400,
    pv: 680,
    amt: 1700,
  },
];

const VerticalComposedChart = () => {
  return (
    <div
      className="col shadow-sm mb-3"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
      }}
    >
      <div className="row d-flex p-2 m-0">
        <div
          className="col pb-2"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col">
              <p className="m-0 fw-bold">Scope</p>
            </div>
            <div className="col">
              <div className="row d-flex">
                <div className="col">
                  <Image src={greenCircle} alt="greenCircle" />
                  &nbsp;KM
                </div>
                <div className="col">
                  <Image src={blueCircle} alt="blueCircle" />
                  &nbsp;NOS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ComposedChart
        layout="vertical"
        width={300}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" scale="band" />
        <Tooltip />
        <Legend />
        <Bar dataKey="pv" barSize={20} fill="#413ea0" />
      </ComposedChart>
    </div>
  );
};

export default VerticalComposedChart;
