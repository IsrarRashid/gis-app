import Image from "next/image";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import greenCircle from "../../../public/icons/greenCircle.svg";
import blueCircle from "../../../public/icons/blueCircle.svg";
import { useEffect, useState } from "react";

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const SimpleBarChart = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Prevent rendering on the server side
    return null;
  }

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
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={300}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="pv"
            fill="#8884d8"
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
          <Bar
            dataKey="uv"
            fill="#82ca9d"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
