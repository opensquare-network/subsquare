import { Bar } from "react-chartjs-2";
import React from "react";
import { useTheme } from "styled-components";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { cn, formatNum } from "next-common/utils";

export default function VoteChart({ data, className, symbol }) {
  const theme = useTheme();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    interaction: {
      mode: "index",
    },
    layout: {
      padding: {
        top: 16, // Increase the top inner margin to display the sum
        left: -6, //Fill the gap on the left side of the X-axis
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        position: "average",
        displayColors: false,
        callbacks: {
          title: () => "",
          label(item) {
            const name = item.dataset.label;
            const count = formatNum(item.dataset.data[item.dataIndex]);
            return `${name}: ${count} ${(symbol && symbol) || ""}`;
          },
        },
      },
      datalabels: {
        color: theme.textPrimary,
        font: {
          size: 12,
          weight: 500,
          family: "Inter",
        },
        clamp: true,
        anchor: "end",
        align: "top",
        offset: 0,
        formatter: (value, context) => {
          const datasets = context.chart.data.datasets;
          if (context.datasetIndex === datasets.length - 1) {
            let total = 0;
            for (let i = 0; i <= context.datasetIndex; i++) {
              total += datasets[i].data[context.dataIndex];
            }
            total = formatNum(total);
            symbol && (total += " " + symbol);
            return total;
          } else {
            return "";
          }
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: theme.textTertiary,
        },
      },
      y: {
        stacked: true,
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          color: theme.textTertiary,
        },
      },
    },
  };

  return (
    <div className={cn("h-[172px]", className)}>
      <Bar data={data} options={options} plugins={[ChartDataLabels]} />
    </div>
  );
}
