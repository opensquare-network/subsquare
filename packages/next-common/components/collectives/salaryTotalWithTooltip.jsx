import BigNumber from "bignumber.js";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import {
  isPositiveAmount,
  normalizeSalaryAssetValue,
} from "./salaryAssetValues";

export function salaryAssetTooltipContent(value = {}) {
  const parts = [];

  if (isPositiveAmount(value.usdt)) {
    parts.push(
      <div key="usdt">
        <ValueDisplay value={value.usdt} symbol="USDT" showTooltip={false} />
      </div>,
    );
  }

  if (isPositiveAmount(value.hollar)) {
    parts.push(
      <div key="hollar">
        <ValueDisplay
          value={value.hollar}
          symbol="HOLLAR"
          showTooltip={false}
        />
      </div>,
    );
  }

  return parts.length > 0 ? parts : null;
}

export default function SalaryTotalWithTooltip({ salary, className }) {
  const value = normalizeSalaryAssetValue(salary);
  const total = new BigNumber(value.usdt).plus(value.hollar).toString();

  return (
    <Tooltip content={salaryAssetTooltipContent(value)}>
      <ValueDisplay
        value={total}
        prefix="$"
        showTooltip={false}
        className={className}
      />
    </Tooltip>
  );
}
