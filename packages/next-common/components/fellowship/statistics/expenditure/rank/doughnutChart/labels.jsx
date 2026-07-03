import { cn } from "next-common/utils";
import { getPercentageValue } from "next-common/components/fellowship/statistics/common";
import SalaryAssetValues from "next-common/components/collectives/salaryAssetValues";

function RowItem({ bgColor, label, percentage, salary }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-3 h-3 rounded-xs shrink-0")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-12 text-textSecondary text12Medium">{label}</span>
      <div className="flex flex-col items-end ml-auto">
        <SalaryAssetValues
          salary={salary}
          className="text12Medium text-textTertiary"
        />
      </div>
      <span className="text12Medium text-textTertiary min-w-12 text-right">
        {percentage}
      </span>
    </div>
  );
}

export default function DoughnutChartLabels({ labelDataArr }) {
  return (
    <div className="flex flex-col gap-2 grow min-w-55">
      {labelDataArr.map((i) => (
        <RowItem
          key={i.label}
          label={i.label}
          bgColor={i.bgColor}
          percentage={getPercentageValue(i.percent)}
          salary={i.salary}
        />
      ))}
    </div>
  );
}
