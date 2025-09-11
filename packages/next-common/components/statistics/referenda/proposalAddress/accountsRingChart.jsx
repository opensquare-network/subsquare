import { Doughnut } from "react-chartjs-2";
import { cn, formatNum } from "next-common/utils";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import { ConvictionSupport } from "next-common/utils/referendumCommon";
import { groupBy } from "lodash-es";

const convictions = Object.values(ConvictionSupport);

const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

function RowItem({ bgColor, label, percentage }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-[12px] h-[12px] rounded-[2px]")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-[48px] text-textSecondary text12Medium ">{label}</span>
      <span className="text12Medium text-textTertiary">{percentage}</span>
    </div>
  );
}

const options = {
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

export default function AccountsRingChart({ className }) {
  const allVotes = useSelector(allVotesSelector);
  const totalVotesCount = allVotes?.length || 0;
  const groupedConviction = groupBy(allVotes, "conviction");

  const labelDatas = convictions.map((c, idx) => {
    const count = groupedConviction[idx]?.length || 0;
    return {
      label: `${c}x`,
      bgColor: colors[idx],
      count,
      percent: count / totalVotesCount,
    };
  });

  const data = {
    labels: labelDatas.map((i) => i.label),
    datasets: [
      {
        data: labelDatas.map((item) => item.count),
        backgroundColor: labelDatas.map((item) => item.bgColor),
        borderColor: labelDatas.map((item) => item.bgColor),
        borderWidth: 0,
        name: labelDatas.map((i) => i.label),
        percentage: labelDatas.map(
          (item) => `${(item.percent * 100).toFixed(2)}%`,
        ),
      },
    ],
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-6",
        "max-sm:flex-col",
        className,
      )}
    >
      <div className="flex flex-col gap-2 w-[120px]">
        {labelDatas.map((i) => (
          <RowItem
            key={i.label}
            label={i.label}
            bgColor={i.bgColor}
            percentage={`${(i.percent * 100).toFixed(2)}%`}
          />
        ))}
      </div>
      <div className="w-[174px] h-[174px] relative">
        <Doughnut data={data} options={options} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
          <span className="text-textPrimary text16Bold">
            {formatNum(totalVotesCount)}
          </span>
          <span className="text-textTertiary text12Medium whitespace-nowrap">
            Total Vote Accounts
          </span>
        </div>
      </div>
    </div>
  );
}
