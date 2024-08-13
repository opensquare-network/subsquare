import { cn } from "next-common/utils";
import ValueDisplay from "next-common/components/valueDisplay";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { toPrecision } from "next-common/utils";

function SalaryValueDisplay(count, decimals, symbol) {
  return count ? (
    <ValueDisplay value={toPrecision(count, decimals)} symbol={symbol} />
  ) : (
    ""
  );
}

function RowItem({
  bgColor,
  label,
  percentage,
  count,
  index,
  decimals,
  symbol,
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-[12px] h-[12px] rounded-[2px]")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-[48px] text-textSecondary text12Medium ">{label}</span>
      <span className="text12Medium text-textTertiary">
        {index === 0
          ? `0 ${symbol}`
          : SalaryValueDisplay(count, decimals, symbol)}
      </span>
      <span className="ml-auto text12Medium text-textTertiary">
        {index === 0 ? "0%" : percentage}
      </span>
    </div>
  );
}

export default function DoughnutChartLabels({ labelDatas }) {
  const { symbol, decimals } = useSalaryAsset();
  return (
    <div className="flex flex-col gap-2 flex-grow min-w-[220px]">
      {labelDatas.map((i, index) => (
        <RowItem
          key={i.label}
          label={i.label}
          bgColor={i.bgColor}
          percentage={i.percent ? `${(i.percent * 100).toFixed(2)}%` : ""}
          count={i.count}
          index={index}
          symbol={symbol}
          decimals={decimals}
        />
      ))}
    </div>
  );
}
