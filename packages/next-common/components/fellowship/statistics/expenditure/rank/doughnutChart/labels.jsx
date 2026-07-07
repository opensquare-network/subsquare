import { cn } from "next-common/utils";
import { getPercentageValue } from "next-common/components/fellowship/statistics/common";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import BigNumber from "bignumber.js";

function tooltipContent(salary) {
  const value = normalizeSalaryAssetValue(salary);
  const parts = [];
  if (new BigNumber(value.usdt || 0).gt(0)) {
    parts.push(
      <ValueDisplay
        key="usdt"
        value={value.usdt}
        symbol="USDT"
        showTooltip={false}
      />,
    );
  }
  if (new BigNumber(value.hollar || 0).gt(0)) {
    parts.push(
      <ValueDisplay
        key="hollar"
        value={value.hollar}
        symbol="HOLLAR"
        showTooltip={false}
      />,
    );
  }
  return parts.length > 0 ? parts : null;
}

function RowItem({ bgColor, label, percentage, salary }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-3 h-3 rounded-xs shrink-0")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-12 text-textSecondary text12Medium">{label}</span>
      <Tooltip
        content={tooltipContent(salary)}
        className="text12Medium text-textTertiary ml-auto"
      >
        <ValueDisplay value={salary.total} symbol="USD" showTooltip={false} />
      </Tooltip>
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
