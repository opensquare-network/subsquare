import { cn } from "next-common/utils";
import { getPercentageValue } from "next-common/components/fellowship/statistics/common";
import { normalizeSalaryAssetValue } from "next-common/components/collectives/salaryAssetValues";
import Tooltip from "next-common/components/tooltip";
import BigNumber from "bignumber.js";

const amountFormat = {
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
};

function formatUsdAmount(value) {
  return new BigNumber(value || 0).toFormat(2, amountFormat);
}

function formatUsdLabelAmount(value) {
  const amount = new BigNumber(value || 0);
  const abbreviations = [
    { value: new BigNumber("1000000000000000"), suffix: "Q" },
    { value: new BigNumber("1000000000000"), suffix: "T" },
    { value: new BigNumber("1000000000"), suffix: "B" },
    { value: new BigNumber("1000000"), suffix: "M" },
    { value: new BigNumber("1000"), suffix: "K" },
  ];

  const abbreviation = abbreviations.find((item) =>
    amount.isGreaterThanOrEqualTo(item.value),
  );

  if (!abbreviation) {
    return amount.toFormat(2, amountFormat);
  }

  return `${amount.dividedBy(abbreviation.value).toFormat(2, amountFormat)}${
    abbreviation.suffix
  }`;
}

function tooltipContent(salary) {
  const value = normalizeSalaryAssetValue(salary);
  const parts = [];
  if (new BigNumber(value.usdt || 0).gt(0)) {
    parts.push(<div key="usdt">{formatUsdAmount(value.usdt)} USDT</div>);
  }
  if (new BigNumber(value.hollar || 0).gt(0)) {
    parts.push(<div key="hollar">{formatUsdAmount(value.hollar)} HOLLAR</div>);
  }
  return parts.length > 0 ? parts : null;
}

function RowItem({ bgColor, label, percentage, count }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn("w-3 h-3 rounded-xs shrink-0")}
        style={{ backgroundColor: bgColor }}
      />
      <span className="w-12 text-textSecondary text12Medium">{label}</span>
      <Tooltip content={tooltipContent(count.salary)}>
        <span className="text12Medium text-textTertiary ml-auto">
          {formatUsdLabelAmount(count.count)} USD
        </span>
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
          count={{ count: i.count, salary: i.salary }}
        />
      ))}
    </div>
  );
}
