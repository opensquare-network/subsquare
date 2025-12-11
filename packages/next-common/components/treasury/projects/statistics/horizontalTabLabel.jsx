import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { cn } from "next-common/utils";

export default function HorizontalTabLabel({ category, categories, isActive }) {
  const totalFiat = useMemo(() => {
    return categories.map((category) => category.totalFiat);
  }, [categories]);

  const maxTotalFiat = useMemo(() => {
    return BigNumber.max(...totalFiat);
  }, [totalFiat]);

  const percentage = useMemo(() => {
    return BigNumber(category.totalFiat)
      .dividedBy(maxTotalFiat)
      .multipliedBy(100)
      .toFixed(2);
  }, [category.totalFiat, maxTotalFiat]);

  return (
    <div
      className={cn(
        "flex items-center gap-x-2 text14Bold",
        isActive ? "text-theme500" : "text-textPrimary",
      )}
    >
      <span className="w-[3px] h-3 bg-theme300 flex items-end rounded-sm overflow-hidden">
        <span
          className="block w-full h-full bg-theme500"
          style={{ height: `${percentage}%` }}
        />
      </span>
      {category?.label}
    </div>
  );
}
