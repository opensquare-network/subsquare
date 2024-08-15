import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";
import { getPercentageValue } from "next-common/components/fellowship/statistics/common";

function getSalaryValue(count, decimals, symbol) {
  return count ? (
    <ValueDisplay value={toPrecision(count, decimals)} symbol={symbol} />
  ) : (
    `0 ${symbol}`
  );
}

function RowItem({ bgColor, label, percentage, count, decimals, symbol }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-[12px] h-[12px] rounded-[2px]")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-[48px] text-textSecondary text12Medium ">{label}</span>
      <span className="text12Medium text-textTertiary">{count}</span>
      <span className="ml-auto text12Medium text-textTertiary">
        {percentage}
      </span>
    </div>
  );
}

export default function DoughnutChartLabels({ labelDataArr }) {
  const { symbol, decimals } = useSalaryAsset();
  return (
    <div className="flex flex-col gap-2 flex-grow min-w-[220px]">
      {labelDataArr.map((i) => (
        <RowItem
          key={i.label}
          label={i.label}
          bgColor={i.bgColor}
          percentage={getPercentageValue(i.percent)}
          count={getSalaryValue(i.count, decimals, symbol)}
          symbol={symbol}
          decimals={decimals}
        />
      ))}
    </div>
  );
}
