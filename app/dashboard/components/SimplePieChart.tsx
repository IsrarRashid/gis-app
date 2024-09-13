import Image from "next/image";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import downArrowWhite from "../../../public/icons/downArrowWhite.svg";
import { useEffect, useState } from "react";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

const data02 = [
  { name: "Group A", value: 2400 },
  { name: "Group B", value: 4567 },
  { name: "Group C", value: 1398 },
  { name: "Group D", value: 9800 },
  { name: "Group E", value: 3908 },
  { name: "Group F", value: 4800 },
];

const SimplePieChart = () => {
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
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="row d-flex p-3 m-0">
        <div
          className="col pb-2"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col">
              <p className="m-0 fw-bold mt-1">Project Brief</p>
            </div>
            <div className="col text-end">
              <button className="btn btn-sm btn-secondary">
                Export&nbsp;
                <Image src={downArrowWhite} alt="downArrowWhite" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data01}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Pie
            dataKey="value"
            data={data02}
            cx={500}
            cy={200}
            innerRadius={40}
            outerRadius={80}
            fill="#82ca9d"
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimplePieChart;
