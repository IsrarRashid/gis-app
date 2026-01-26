import Button from "@/app/components/Button";
import { ChartGradient } from "@/app/components/Charts/BarChart/MySimpleBarChart";
import MyStackBarChart, {
  MyStackBarChartStyle,
  MyStackBarChartType,
} from "@/app/components/Charts/BarChart/MyStackBarChart";
import { ArrowUpRight03Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Card from "./Card";
import TileLabel from "./TileLabel";

const AssignProjectPartTwoBarChartTile = ({
  chartSize = "small",
}: {
  chartSize?: "small" | "large";
}) => {
  const gradient: ChartGradient = {
    id: "my-gradient-color-2",
    from: "#036CCF",
    to: "#004687",
    // direction: "vertical", // optional
  };

  const color = "rgba(117, 117, 117, 0.15)";

  // We convert total into two stacked parts:
  // gain + remaining = total

  // Backend gives:
  // total = 100
  // gain = 50

  // Frontend converts to:
  // gain = 50
  // remaining = 50

  // Now stacking works correctly.

  const data: MyStackBarChartType[] = [
    {
      label: "Amina Abrar",
      value1: {
        value: 15, //gain
        gradient,
      },
      value2: {
        value: 10, // total === remaining
        color,
      },
    },
    {
      label: "Aroos",
      value1: {
        value: 10,
        gradient,
      },
      value2: {
        value: 6,
        color,
      },
    },
    {
      label: "Qamar",
      value1: {
        value: 2,
        gradient,
      },
      value2: {
        value: 4,
        color,
      },
    },
    {
      label: "M. Salman",
      value1: {
        value: 5,
        gradient,
      },
      value2: {
        value: 8,
        color,
      },
    },
    {
      label: "Fatima",
      value1: {
        value: 12,
        gradient,
      },
      value2: {
        value: 1,
        color,
      },
    },
    {
      label: "M. Azeem",
      value1: {
        value: 16,
        gradient,
      },
      value2: {
        value: 8,
        color,
      },
    },
    {
      label: "M. Sadiq",
      value1: {
        value: 10,
        gradient,
      },
      value2: {
        value: 6,
        color,
      },
    },
    {
      label: "Qurat-ul-ain",
      value1: {
        value: 5,
        gradient,
      },
      value2: {
        value: 8,
        color,
      },
    },
    {
      label: "M. Saqib",
      value1: {
        value: 16,
        gradient,
      },
      value2: {
        value: 8,
        color,
      },
    },
    {
      label: "Adnan Ashraf",
      value1: {
        value: 2,
        gradient,
      },
      value2: {
        value: 4,
        color,
      },
    },
    {
      label: "Dr. Hamza Tanzeel",
      value1: {
        value: 10,
        gradient,
      },
      value2: {
        value: 6,
        color,
      },
    },
  ];

  const smallChartStyle: MyStackBarChartStyle = {
    height: 292,
    barSize: 28,

    stacks: [
      {
        key: "value1", // 👈 MUST match data
        color: "#22C55E",
        radius: [0, 0, 20, 20],
      },
      {
        key: "value2", // 👈 MUST match data
        color: "#F59E0B",
        radius: [20, 20, 0, 0],
      },
    ],

    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 12,
    },
  };

  const largeChartStyle: MyStackBarChartStyle = {
    height: 582,
    barSize: 56,

    stacks: [
      {
        key: "value1", // 👈 MUST match data
        color: "#22C55E",
        radius: [0, 0, 20, 20],
      },
      {
        key: "value2", // 👈 MUST match data
        color: "#F59E0B",
        radius: [20, 20, 0, 0],
      },
    ],

    axis: {
      tickColor: "rgba(0,0,0,.7)",
      fontSize: 12,
    },
  };

  return (
    <Card
      head={
        <div className="d-flex align-items-center justify-content-between">
          <TileLabel
            backgroundImage="linear-gradient(to bottom, #036CCF , #004687)"
            icon={
              <HugeiconsIcon
                icon={UserGroupIcon}
                color="white"
                size={30 * (chartSize === "small" ? 1 : 1.5)}
              />
            }
            label="Assigned Evaluation Projects"
            description="Projects Details according to member"
            chartSize={chartSize}
          />
          <Button
            className="btn fw-6"
            style={{
              borderRadius: "10px",
              background: "#F3F4F6",
              color: "#6B7280",
              padding: "0.594em 0.625em",
              fontSize: 16 * (chartSize === "small" ? 1 : 1.5) + "px",
            }}
          >
            <div className="d-flex align-items-center" style={{ gap: "9px" }}>
              <HugeiconsIcon
                icon={ArrowUpRight03Icon}
                size={21 * (chartSize === "small" ? 1 : 1.5)}
              />
              <span>Visit</span>
            </div>
          </Button>
        </div>
      }
    >
      <MyStackBarChart
        data={data}
        style={chartSize === "small" ? smallChartStyle : largeChartStyle}
      />

      <div className="d-flex justify-content-center align-items-center gap-2">
        <span
          className="d-flex align-items-center gap-2"
          style={{ padding: "4.5px 4px" }}
        >
          <span className="p-1">
            <div
              style={{
                width: 8 * (chartSize === "small" ? 1 : 2) + "px",
                height: 8 * (chartSize === "small" ? 1 : 2) + "px",
                backgroundImage:
                  "linear-gradient(to bottom, #036CCF , #013769)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
            }}
          >
            Total Assigned Projects
          </span>
        </span>
        <span
          className="d-flex align-items-center gap-2"
          style={{ padding: "4.5px 4px" }}
        >
          <span className="p-1">
            <div
              style={{
                width: 8 * (chartSize === "small" ? 1 : 2) + "px",
                height: 8 * (chartSize === "small" ? 1 : 2) + "px",
                backgroundImage:
                  "linear-gradient(to bottom, #616161 , #1E1E1E)",
              }}
            />
          </span>
          <span
            style={{
              fontSize: 12 * (chartSize === "small" ? 1 : 2) + "px",
            }}
          >
            In Progress Projects
          </span>
        </span>
      </div>
    </Card>
  );
};

export default AssignProjectPartTwoBarChartTile;
