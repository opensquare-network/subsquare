import React from "react";
import FieldLoading from "next-common/components/icons/fieldLoading";
import isEmpty from "lodash.isempty";
import { cn } from "next-common/utils";

export default function SpendPeriod({ summary }) {
  if (isEmpty(summary)) {
    return <FieldLoading />;
  }

  return (
    <>
      {(summary?.spendPeriod || []).map((item, index) => (
        <span className={index % 2 === 1 ? "unit" : ""} key={index}>
          {item}
        </span>
      ))}
      {(summary?.totalPeriod || []).map((item, index) => (
        <span
          className={cn(
            index % 2 === 1 ? "unit total" : "total",
            "max-sm:hidden",
          )}
          key={index}
        >
          {item}
        </span>
      ))}
    </>
  );
}
