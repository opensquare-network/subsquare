import { useThemeSetting } from "next-common/context/theme";
import { useMemo } from "react";

export default function useDoughnutChartOptions() {
  const { textPrimary } = useThemeSetting();

  return useMemo(
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
          stretch: 1,
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
}
