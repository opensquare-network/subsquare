import { cn, toPrecision } from "next-common/utils";
import React from "react";
import ValueDisplay from "next-common/components/valueDisplay";

function SalaryDisplay({ className = "", value = 0, decimals, symbol }) {
  return (
    <div>
      <p className="flex items-center pb-2 text-textPrimary text14Medium font-bold">
        Salary
      </p>
      <div
        className={cn(
          "flex",
          "items-center",
          "rounded-[8px]",
          "bg-neutral200",
          "justify-between",
          "text-textPrimary",
          "text14Medium",
          "border-[1px]",
          "border-neutral400",
          className,
        )}
      >
        <ValueDisplay
          className="flex-1 px-4 py-2.5"
          key="value"
          value={toPrecision(value, decimals)}
        />
        <span className="px-4 py-2.5 border-l border-neutral300">{symbol}</span>
      </div>
    </div>
  );
}
export default React.memo(SalaryDisplay);
