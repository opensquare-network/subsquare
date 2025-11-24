import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import { useThemeSetting } from "next-common/context/theme";
import { useMemo } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

export const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

export default function ProjectDoughnutChart({ data }) {
  const { textPrimary } = useThemeSetting();

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 0,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        outlabels: {
          text: (context) => {
            const percentage =
              context.dataset.percentage?.[context.dataIndex] ?? "";
            return percentage;
          },
          font: {
            size: 11,
            weight: 500,
          },
          color: textPrimary,
          backgroundColor: null,
          stretch: 1,
          lineWidth: 1,
          borderRadius: 0,
          borderWidth: 0,
        },
      },
      layout: {
        padding: {
          left: 2,
          right: 2,
          top: 1,
          bottom: 0,
        },
      },
      cutout: "45%",
      rotation: 5,
    }),
    [textPrimary],
  );

  if (!data) {
    return null;
  }

  return (
    <div style={{ width: 180, height: 110 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
