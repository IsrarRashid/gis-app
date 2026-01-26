"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { formatAmountWithCommas } from "../../../utils";
import { calculateLeftMargin, calculateXAxisHeight } from "../types";

export interface ChartGradient {
  id: string;
  from: string;
  to: string;
  direction?: "vertical" | "horizontal";
}

export interface MyBarChartType {
  label: string;
  value: number;
  season: string;
  percentage: number;
  color?: string; // solid color
  gradient?: ChartGradient; // optional gradient
}

interface Props {
  data: MyBarChartType[];
  layout?: "vertical" | "horizontal";
  style?: MyBarChartStyle;
  unit?: string;
  xAxisLabelOrientation?: "horizontal" | "vertical";
}

const MySimpleBarChart = ({
  data,
  layout = "horizontal",
  style = defaultVerticalChartStyle,
  unit = "",
  xAxisLabelOrientation = "horizontal",
}: Props) => {
  const fontSize = style?.axis?.fontSize ?? 12;

  const leftMargin = calculateLeftMargin(data, fontSize, "%");

  const xAxisHeight =
    calculateXAxisHeight(
      data.map((d) => d.label),
      fontSize - 10
    ) +
    (xAxisLabelOrientation === "vertical" && fontSize > 13
      ? 130
      : xAxisLabelOrientation === "vertical" && fontSize === 12
      ? 80
      : 0);

  return (
    <ResponsiveContainer width="100%" height={style?.height ?? 300}>
      <BarChart
        layout={layout}
        data={data}
        barSize={style?.barSize ?? 25}
        margin={{
          top: style?.margin?.top ?? 20,
          right: style?.margin?.right ?? 20,
          bottom: xAxisHeight,
          left: leftMargin,
        }}
      >
        {/* ================= SVG GRADIENTS ================= */}
        <defs>
          {data.map((entry, index) =>
            entry.gradient ? (
              <linearGradient
                key={`barGradient-${entry.gradient.id}`}
                id={`barGradient-${entry.gradient.id}`}
                x1="0"
                y1="0"
                x2={entry.gradient.direction === "horizontal" ? "1" : "0"}
                y2={entry.gradient.direction === "horizontal" ? "0" : "1"}
              >
                <stop offset="0%" stopColor={entry.gradient.from} />
                <stop offset="100%" stopColor={entry.gradient.to} />
              </linearGradient>
            ) : null
          )}
        </defs>

        {/* ================= AXES ================= */}
        {layout === "vertical" ? (
          <>
            <XAxis
              type="number"
              domain={[0, "dataMax + 10"]}
              tick={{
                fill: style?.axis?.tickColor ?? "rgba(0,0,0,.7)",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
              height={xAxisHeight} // ✅ AUTO height
              tickFormatter={(value) =>
                `${formatAmountWithCommas(Number(value), 0)}${unit}`
              }
            />
            <YAxis
              type="category"
              dataKey="label"
              width={70}
              tick={{
                fill: style?.axis?.tickColor ?? "rgba(0,0,0,.7)",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="label"
              scale="point"
              interval={0}
              padding={{
                left: style?.axis?.padding?.left ?? 30,
                right: style?.axis?.padding?.right ?? 30,
              }}
              tick={
                xAxisLabelOrientation === "vertical" ? (
                  <VerticalTick
                    fontSize={style?.axis?.fontSize ?? 12}
                    fill={style?.axis?.tickColor ?? "rgba(0,0,0,.7)"}
                  />
                ) : (
                  {
                    fill: style?.axis?.tickColor ?? "rgba(0,0,0,.7)",
                    fontSize: style?.axis?.fontSize ?? 12,
                  }
                )
              }
            />

            <YAxis
              tick={{
                fill: style?.axis?.tickColor ?? "rgba(0,0,0,.7)",
                fontSize: style?.axis?.fontSize ?? 12,
              }}
              tickFormatter={(value) =>
                `${formatAmountWithCommas(Number(value), 0)}${unit}`
              }
            />
          </>
        )}

        {/* ================= TOOLTIP & GRID ================= */}
        <Tooltip {...style?.tooltip} cursor={{ fill: "transparent" }} />

        <CartesianGrid
          stroke={style?.grid?.stroke ?? "rgba(53,82,151,0.4)"}
          strokeDasharray={style?.grid?.strokeDasharray ?? "5 3"}
          vertical={style?.grid?.vertical ?? true}
          horizontal={style?.grid?.horizontal ?? true}
        />

        {/* ================= BAR ================= */}
        <Bar
          dataKey="value"
          radius={
            style?.barRadius ??
            (layout === "vertical" ? [0, 10, 10, 0] : [10, 10, 0, 0])
          }
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.gradient
                  ? `url(#barGradient-${entry.gradient.id})`
                  : entry.color ?? style?.fallbackBarColor ?? "#EAA64D"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MySimpleBarChart;

export interface MyBarChartStyle {
  height?: number;
  barSize?: number;

  barRadius?: [number, number, number, number];
  fallbackBarColor?: string;

  grid?: {
    stroke?: string;
    strokeDasharray?: string;
    vertical?: boolean;
    horizontal?: boolean;
  };

  axis?: {
    tickColor?: string;
    fontSize?: number;

    padding?: {
      left?: number;
      right?: number;
    };
  };

  tooltip?: TooltipProps<ValueType, NameType>;

  label?: {
    fontSize?: number;
    valueColor?: string;
    percentageColor?: string;
    seasonColor?: string;
  };

  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export const tooltipStyles = {
  contentStyle: {
    backgroundColor: "#1E1B39",
    border: "0px",
    borderRadius: "0px",
    padding: "10px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  labelStyle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
  },
  itemStyle: {
    fontSize: "14px",
    fontWeight: "normal",
    color: "#fff",
  },
};

export const defaultVerticalChartStyle: MyBarChartStyle = {
  height: 228,
  barSize: 26.55,
  fallbackBarColor: "#2563EB",
  barRadius: [20, 20, 20, 20],
  axis: {
    tickColor: "rgba(0,0,0,.7)",
    fontSize: 12,
  },

  label: {
    fontSize: 10,
    percentageColor: "rgba(0,0,0,.7)",
    valueColor: "rgba(0,0,0,.7)",
    seasonColor: "#000",
  },

  //   tooltip: {
  //     contentStyle: {
  //       backgroundColor: "#1E1B39",
  //       borderRadius: 6,
  //       border: "none",
  //     },
  //     itemStyle: { color: "#fff" },
  //   },
};

const WrappedTick = ({
  x,
  y,
  payload,
  fontSize,
  fill,
  lineGap = 2,
  offset = 20, // 👈 distance from axis line
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  fontSize: number;
  fill: string;
  lineGap?: number;
  offset?: number;
}) => {
  if (!payload?.value || x == null || y == null) return null;

  const words = payload.value.split(" ");

  return (
    <text x={x} y={y} textAnchor="middle" fill={fill}>
      {words.map((word, index) => (
        <tspan
          key={index}
          x={x}
          dy={index === 0 ? offset : fontSize + lineGap}
          fontSize={fontSize}
        >
          {word}
        </tspan>
      ))}
    </text>
  );
};

interface VerticalTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string | number;
  };
  fill?: string;
  fontSize?: number;
}

const VerticalTick = ({
  x = 0,
  y = 0,
  payload,
  fill = "#000",
  fontSize = 12,
}: VerticalTickProps) => {
  if (!payload) return null;

  return (
    <text
      x={x}
      y={y}
      dy={8}
      textAnchor="end"
      transform={`rotate(-90, ${x}, ${y})`}
      fill={fill}
      fontSize={fontSize}
    >
      {payload.value}
    </text>
  );
};
