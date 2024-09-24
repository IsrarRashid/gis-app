// components/DistributedColumnChart.tsx
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import Image from "next/image";
import greenCircle from "../../../public/icons/greenCircle.svg";
import blueCircle from "../../../public/icons/blueCircle.svg";
import { useEffect, useState } from "react";

// Dynamically import the ApexChart component
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DistributedColumnChart = () => {
  const blueDarkColor = "#074F83";
  const blueLightColor = "#0C8CE9";
  const greenDarkColor = "#36F097";
  const greenLightColor = "#36F09733";

  // Chart options and data
  const [chartData] = useState({
    series: [
      {
        name: "Sales",
        data: [21, 22, 10, 28, 16, 21],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      plotOptions: {
        bar: {
          distributed: true, // Enable distributed columns
          horizontal: true, // Vertical columns
          borderRadiusApplication: "end",
          borderRadius: 4,
          barHeight: 10,
        },
      },
      fill: {
        type: "gradient", // Specify gradient type for fill
        gradient: {
          shade: "light",
          type: "horizontal", // Gradient direction
          shadeIntensity: 0.25,
          gradientToColors: [
            blueDarkColor,
            blueDarkColor,
            greenDarkColor,
            blueDarkColor,
            blueDarkColor,
            greenDarkColor,
          ], // End gradient colors
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      colors: [
        blueLightColor,
        blueLightColor,
        greenLightColor,
        blueLightColor,
        blueLightColor,
        greenLightColor,
      ],
      grid: {
        show: false, // Hide grid lines
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0, // Adjust padding if needed
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Bridge",
          "RCC Side Drain",
          "Pipe Culvert",
          "Subway",
          "Interchange",
          "Lenght",
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      title: {
        // text: "Distributed Column Chart",
        align: "left",
      },
    } as ApexOptions,
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
      <div className="col ps-3 pe-3">
        <ApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default DistributedColumnChart;
