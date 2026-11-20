import BigNumber from "bignumber.js";
import { Doughnut } from "react-chartjs-2";
import "next-common/components/charts/globalConfig";
import { colors } from "next-common/components/treasury/projects/const";
import { useThemeSetting } from "next-common/context/theme";

export default function DapAllocationChart({ allocations }) {
  const { textPrimary, neutral100 } = useThemeSetting();
  const allocated = allocations
    .reduce((sum, item) => sum.plus(item.percentage), new BigNumber(0))
    .toFixed();
  const data = {
    labels: allocations.map(({ name }) => name),
    datasets: [
      {
        data: allocations.map(({ percentage }) => Number(percentage)),
        backgroundColor: allocations.map(
          (_, index) => colors[index % colors.length],
        ),
        borderWidth: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: textPrimary,
        titleColor: neutral100,
        bodyColor: neutral100,
        callbacks: { label: ({ label, raw }) => `${label}: ${raw}%` },
      },
    },
  };

  return (
    <div className="relative isolate w-[200px] h-[200px] shrink-0">
      <Doughnut
        data={data}
        options={options}
        className="relative z-10"
        role="img"
        aria-label="Current budget allocation percentages"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text20Bold text-textPrimary">{allocated}%</span>
        <span className="text12Medium text-textTertiary">allocated</span>
      </div>
    </div>
  );
}
