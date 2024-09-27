import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { startCase } from "lodash-es";
import { cn } from "next-common/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        title: () => "",
        label(item) {
          const name = item.dataset.name[item.dataIndex];
          const percentage = item.dataset.percentage[item.dataIndex];
          const count = item.dataset.data[item.dataIndex];
          return `${name}: ${count} (${percentage})`;
        },
      },
    },
  },
  cutout: "80%",
};

export function DoughnutChart({ trackReferendaCounts, trackColors }) {
  const data = {
    labels: trackReferendaCounts.map((item) => startCase(item.name)),
    datasets: [
      {
        label: "Referendum Count",
        data: trackReferendaCounts.map((item) => item.count),
        backgroundColor: trackReferendaCounts.map(
          (item) => trackColors[item.name],
        ),
        borderColor: trackReferendaCounts.map((item) => trackColors[item.name]),
        borderWidth: 0,
        name: trackReferendaCounts.map((item) => startCase(item.name)),
        percentage: trackReferendaCounts.map(
          (item) => `${(item.percent * 100).toFixed(2)}%`,
        ),
      },
    ],
  };

  return (
    <div className={cn("flex justify-center flex-grow", "w-[200px]")}>
      <div style={{ width: 200, height: 200 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
