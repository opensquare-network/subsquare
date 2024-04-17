import { Doughnut } from "react-chartjs-2";
import React from "react";
import { cn, formatNum } from "next-common/utils";

function RowItem({ bgColor, label, percentage }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-[12px] h-[12px] rounded-[2px]")}
        style={{ backgroundColor: bgColor }}
      ></span>
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
  const labelDatas = [
    {
      label: "0.1x",
      bgColor: "#F29CBA",
      count: 20,
      percent: 0.2,
    },
    {
      label: "1x",
      bgColor: "#EAACEC",
      count: 20,
      percent: 0.2,
    },
    {
      label: "2x",
      bgColor: "#A6EEDD",
      count: 20,
      percent: 0.2,
    },
    {
      label: "3x",
      bgColor: "#C5BAFA",
      count: 20,
      percent: 0.2,
    },
    {
      label: "4x",
      bgColor: "#A6D5FA",
      count: 10,
      percent: 0.1,
    },
    {
      label: "5x",
      bgColor: "#FFD699",
      count: 10,
      percent: 0.1,
    },
  ];
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
        "flex max-md:flex-col md:flex-row items-center gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
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
          <span className="text-textPrimary text16Bold">{formatNum(1965)}</span>
          <span className="text-textTertiary text12Medium whitespace-nowrap">
            Total Vote Accounts
          </span>
        </div>
      </div>
    </div>
  );
}
