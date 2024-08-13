import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

function SalaryValueDisplay(count) {
  const { decimals, symbol } = useSalaryAsset();
  return count ? (
    <ValueDisplay value={toPrecision(count, decimals)} symbol={symbol} />
  ) : (
    ""
  );
}

function RowItem({ bgColor, label, percentage, count }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-[12px] h-[12px] rounded-[2px]")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-[48px] text-textSecondary text12Medium ">{label}</span>
      <span className="text12Medium text-textTertiary">
        {SalaryValueDisplay(count)}
      </span>
      <span className="ml-auto text12Medium text-textTertiary">
        {percentage}
      </span>
    </div>
  );
}

export default function DoughnutChartLabels({ labelDatas }) {
  return (
    <div className="flex flex-col gap-2 flex-grow min-w-[220px]">
      {labelDatas.map((i) => (
        <RowItem
          key={i.label}
          label={i.label}
          bgColor={i.bgColor}
          percentage={i.percent ? `${(i.percent * 100).toFixed(2)}%` : ""}
          count={i.count}
        />
      ))}
    </div>
  );
}
