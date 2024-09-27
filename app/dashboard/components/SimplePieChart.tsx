// components/SimplePie.tsx
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type
import Image from "next/image";
import downArrowWhite from "../../../public/icons/downArrowWhite.svg";
import { useEffect, useState } from "react";

// Dynamically import the ApexChart component (for SSR)
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SimplePieChart = () => {
  // Define chart options and data
  const [chartData] = useState<{
    options: ApexOptions; // Set the type as ApexOptions
    series: number[]; // The series type is an array of numbers
  }>({
    series: [20, 30, 10, 35], // Data for the pie chart
    options: {
      chart: {
        type: "pie", // Correct type as per ApexOptions
      },
      labels: ["Allocated", "Expenditure", "Releases", "Approved Cost"], // Labels for each slice
      colors: ["#5A3FFF", "#1ED6FF", "#ADE1FF", "#3DFFDC"],
      stroke: {
        show: false,
        width: 0,
      },
      legend: {
        show: false, // Keep the legend visible if needed
      },
      dataLabels: {
        dropShadow: {
          opacity: 0.3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

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
      <div className="d-flex justify-content-center mt-2 pb-2">
        <div className="col">
          <ApexChart
            options={chartData.options}
            series={chartData.series}
            type="pie"
          />
        </div>
      </div>
    </div>
  );
};

export default SimplePieChart;
