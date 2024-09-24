import Image from "next/image";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import downArrowWhite from "../../../public/icons/downArrowWhite.svg";
import { useEffect, useState } from "react";
import Select from "react-select";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

interface Props {
  title: string;
}

const SimplePieChart = ({ title }: Props) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Prevent rendering on the server side
    return null;
  }
  const options = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  return (
    <div
      className="col shadow-sm mb-3"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div className="row d-flex p-3 m-0">
        <div className="col pb-2">
          <div className="row d-flex ms-3 me-3">
            <div className="col-lg-10 col-md-8 col p-0">
              <p
                className="m-0 mt-1 fw-bold"
                style={{ fontWeight: "500", fontSize: "1.125rem" }}
              >
                {title}
              </p>
            </div>
            <div
              className="col-lg-1 col-md-2 col text-start"
              style={{ marginRight: "40px" }}
            >
              <select
                className="bg-white fw-bold shadow-sm"
                style={{
                  color: "#64748B",
                  outline: "none",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                }}
                aria-label="Rows per page"
                name="rowPerPage"
              >
                <option value="day">Daily</option>
                <option value="month" selected>
                  Monthly
                </option>
                <option value="year">Yearly</option>
              </select>
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
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimplePieChart;
