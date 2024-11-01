// components/SimplePie.tsx
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // Import ApexOptions type
import Image from "next/image";
import downArrowWhite from "../../../public/icons/downArrowWhite.svg";
import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/Button";
import { SingleProjectDashboard } from "./DashboardTwo";

// Dynamically import the ApexChart component (for SSR)
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Props {
  data: SingleProjectDashboard;
}

const SimplePieChart = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Define chart options and data
  const [chartData] = useState<{
    options: ApexOptions; // Set the type as ApexOptions
    series: number[]; // The series type is an array of numbers
  }>({
    series: [data.allocation, data.releases, data.utilization], // Data for the pie chart
    options: {
      chart: {
        type: "pie", // Correct type as per ApexOptions
      },
      labels: ["Allocation", "Releases", "Utilization"], // Labels for each slice
      colors: ["#15607A", "#1D81A2", "#18A1CD"],
      stroke: {
        show: false,
        width: 0,
      },
      legend: {
        show: true, // Keep the legend visible if needed
        formatter: function (val, opts) {
          return `${val}: ${opts.w.globals.series[opts.seriesIndex]}`;
        },
        position: "bottom", // Position legend at the bottom
        onItemHover: {
          highlightDataSeries: false, // Disable highlighting on hover
        },
      },
      dataLabels: {
        enabled: true, // Enable data labels on the chart slices
        formatter: function (val, opts) {
          return opts.w.globals.series[opts.seriesIndex].toString();
        },
        style: {
          fontSize: "14px",
          colors: ["#fff"],
        },
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
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
      }}
    >
      <div className="row d-flex p-2 m-0">
        <div
          className="col pb-2 ms-3 me-3"
          style={{ borderBottom: "1px dashed #97ABBD" }}
        >
          <div className="row d-flex">
            <div className="col">
              <p className="m-0 fw-bold" style={{ fontSize: "1.563rem" }}>
                Project Brief
              </p>
            </div>
            <div className="col mt-2 text-end">
              <Button className="btn btn-sm btn-secondary fs12px">
                Export&nbsp;
                <Image
                  src={downArrowWhite}
                  alt="downArrowWhite"
                  width={10}
                  height={10}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <div className="col ps-3 pe-3">
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
