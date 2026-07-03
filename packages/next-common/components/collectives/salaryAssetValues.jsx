import BigNumber from "bignumber.js";
import ValueDisplay from "next-common/components/valueDisplay";

export function normalizeSalaryAssetValue(value = {}) {
  if (typeof value === "string" || typeof value === "number") {
    return { usdt: value.toString(), hollar: "0" };
  }

  return {
    usdt: value.usdt || value.usdtSalary || value.usdtTotalSalary || "0",
    hollar:
      value.hollar || value.hollarSalary || value.hollarTotalSalary || "0",
  };
}

export function isPositiveAmount(value) {
  return new BigNumber(value || 0).gt(0);
}

export default function SalaryAssetValues({
  salary,
  align = "right",
  className = "",
}) {
  const value = normalizeSalaryAssetValue(salary);
  const hasUsdt = isPositiveAmount(value.usdt);
  const hasHollar = isPositiveAmount(value.hollar);

  if (!hasUsdt && !hasHollar) {
    return <span className="text-textTertiary">-</span>;
  }

  return (
    <div
      className={`flex flex-col gap-1 ${
        align === "right" ? "items-end" : "items-start"
      } ${className}`}
    >
      {hasUsdt && (
        <ValueDisplay value={value.usdt} symbol="USDT" showVerySmallNumber />
      )}
      {hasHollar && (
        <ValueDisplay
          value={value.hollar}
          symbol="HOLLAR"
          showVerySmallNumber
        />
      )}
    </div>
  );
}
