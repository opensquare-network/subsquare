import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Outlabels from "@energiency/chartjs-plugin-piechart-outlabels";
import { useThemeSetting } from "next-common/context/theme";
import { useMemo } from "react";
import "../../../charts/globalConfig";
import { DOUGHNUT_CONFIG_BY_CATEGORY } from "../const";

ChartJS.register(ArcElement, Tooltip, Legend, Outlabels);

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
        annotation: {
          display: false,
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
          lineWidth: 1,
          borderRadius: 0,
          borderWidth: 0,
          padding: 0,
          ...(DOUGHNUT_CONFIG_BY_CATEGORY[data?.category] ?? {}),
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
    [textPrimary, data?.category],
  );

  if (!data) {
    return null;
  }

  return (
    <div style={{ width: 190, height: 110 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
