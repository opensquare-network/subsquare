import { Bar } from "react-chartjs-2";
import { useTheme } from "styled-components";
import { abbreviateBigNumber, cn } from "next-common/utils";
export default function AccountsVotesChart({ data, className, symbol }) {
  const theme = useTheme();
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    interaction: {
      intersect: false,
      mode: "index",
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
            const votesCount = item.dataset.data;
            const count = votesCount[item.dataIndex];
            return `${name}: ${abbreviateBigNumber(count)} ${
              (symbol && symbol) || ""
            }`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        grid: {
          drawTicks: false,
          lineWidth: 1,
          color: theme.neutral300,
        },
        border: {
          dash: [5, 5],
          color: theme.neutral300,
        },
        ticks: {
          padding: 8,
          color: theme.textTertiary,
        },
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        },
        border: {
          display: true,
          color: theme.neutral300,
        },
        ticks: {
          stepSize: 100,
          color: theme.textTertiary,
        },
      },
    },
  };

  return (
    <div className={cn("h-[184px]", className)}>
      <Bar data={data} options={options} />
    </div>
  );
}
