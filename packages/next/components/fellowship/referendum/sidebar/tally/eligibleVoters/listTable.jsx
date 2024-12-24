import React from "react";
import { cn } from "next-common/utils";
import { SystemLoading } from "@osn/icons/subsquare";

export default function ListTable({
  rows = [],
  columns = [],
  className = "",
  loading = false,
  noDataText = "No data",
}) {
  if (loading) {
    return (
      <SystemLoading className="w-5 h-5 mt-2 mb-6 mx-auto [&_path]:stroke-textDisabled" />
    );
  }

  if (rows.length === 0) {
    return (
      <div className="text-textTertiary text14Medium text-center px-4 py-2.5">
        {noDataText}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {rows.map((row, rowIdx) => (
        <div
          key={rowIdx}
          className={cn(
            "w-full flex items-center py-2.5 px-4 rounded-[8px] space-x-4",
            row?.className,
          )}
        >
          {columns.map((column, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                "w-full text14Medium text-textSecondary",
                column.className,
              )}
              style={column?.style}
            >
              {column?.render
                ? column.render(row[column.key], row)
                : row[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
