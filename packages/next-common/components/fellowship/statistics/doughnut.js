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

  const rankData = Object.keys(rankDistribution).map((rank) => {
    const count = rankDistribution[rank];
    const name = `Rank ${rank}`;
    const percentage = `${((count / totalMembersCount) * 100).toFixed(2)}%`;
    const rankColor = getRankColor(parseInt(rank));
    return {
      name,
      count,
      percentage,
      rankColor,
    };
  });

  const data = {
    labels: rankData.map((item) => item.name),
    datasets: [
      {
        label: "Members Count",
        data: rankData.map((item) => item.count),
        backgroundColor: rankData.map((item) => item.rankColor),
        borderColor: rankData.map((item) => item.rankColor),
        borderWidth: 0,
        name: rankData.map((item) => item.name),
        percentage: rankData.map((item) => item.percentage),
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
