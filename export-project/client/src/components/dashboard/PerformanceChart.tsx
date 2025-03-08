import { Chart } from "@/components/ui/chart";

interface PerformanceData {
  day: string;
  visits: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  className?: string;
}

const PerformanceChart = ({ data, className }: PerformanceChartProps) => {
  // Get current day index
  const today = new Date().getDay();
  
  return (
    <Chart
      className={className}
      type="bar"
      height={150}
      data={data}
      showGrid={false}
      showLegend={false}
      xAxis={{ dataKey: "day" }}
      series={[
        {
          dataKey: "visits",
          color: "#0057B8",
          name: "Visitas"
        }
      ]}
    />
  );
};

export default PerformanceChart;
