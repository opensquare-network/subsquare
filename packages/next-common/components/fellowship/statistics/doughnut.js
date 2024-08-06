import { usePageProps } from "next-common/context/page";
import { cn } from "next-common/utils";
import { getRankColor } from "next-common/utils/fellowship/getRankColor";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

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

export default function DoughnutChart() {
  const { membersSummary: { totalMembersCount, rankDistribution } = {} } =
    usePageProps();

  const datasets = Object.keys(rankDistribution).map((rank) => {
    const count = rankDistribution[rank];
    const name = `Rank ${rank}`;
    const percentage = ((count / totalMembersCount) * 100).toFixed(2);
    const rankColor = getRankColor(parseInt(rank));
    return {
      label: "Members Count",
      name,
      data: count,
      percentage,
      backgroundColor: rankColor,
      borderColor: rankColor,
      borderWidth: 0,
    };
  });

  const data = {
    labels: datasets.map((item) => item.name),
    datasets,
  };

  return (
    <div className={cn("flex justify-center flex-grow", "w-[200px]")}>
      <div style={{ width: 200, height: 200 }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
