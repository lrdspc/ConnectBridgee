import React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  type: "bar" | "line" | "area" | "pie";
  data: any[];
  xAxis?: {
    dataKey: string;
    label?: string;
  };
  yAxis?: {
    label?: string;
  };
  series: {
    dataKey: string;
    color?: string;
    name?: string;
  }[];
  height?: number | string;
  showTooltip?: boolean;
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  showGrid?: boolean;
}

export const Chart = ({
  type,
  data,
  xAxis,
  yAxis,
  series,
  height = 300,
  showTooltip = true,
  showLegend = false,
  valueFormatter = (value) => value.toString(),
  showGrid = true,
  className,
  ...props
}: ChartProps) => {
  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis
              dataKey={xAxis?.dataKey}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              fill="#94A3B8"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={valueFormatter}
              fontSize={12}
              fill="#94A3B8"
            />
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {series.map((s, index) => (
              <Bar
                key={index}
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={s.color || "#0057B8"}
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis
              dataKey={xAxis?.dataKey}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              fill="#94A3B8"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={valueFormatter}
              fontSize={12}
              fill="#94A3B8"
            />
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {series.map((s, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                stroke={s.color || "#0057B8"}
                strokeWidth={2}
                dot={{ r: 4, fill: s.color || "#0057B8" }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
      case "area":
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
            <XAxis
              dataKey={xAxis?.dataKey}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              fontSize={12}
              fill="#94A3B8"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={valueFormatter}
              fontSize={12}
              fill="#94A3B8"
            />
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
            {series.map((s, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name || s.dataKey}
                fill={s.color || "#0057B8"}
                stroke={s.color || "#0057B8"}
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={data}
              nameKey={xAxis?.dataKey}
              dataKey={series[0].dataKey}
              fill={series[0].color || "#0057B8"}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    series[index % series.length]?.color ||
                    [
                      "#0057B8",
                      "#3984D6",
                      "#FF6B00",
                      "#FF8C3D",
                      "#10B981",
                      "#F59E0B",
                      "#EF4444",
                      "#3B82F6",
                    ][index % 8]
                  }
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip formatter={valueFormatter} />}
            {showLegend && <Legend />}
          </PieChart>
        );
    }
  };

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
