// https://ant.design/components/descriptions, Display multiple read-only fields in groups.

import React from "react";
import { cn } from "next-common/utils";

export default function Descriptions({
  title = "",
  items = [],
  bordered = true,
  className,
}) {
  if (!items?.length) {
    return null;
  }

  return (
    <div className={cn("descriptions w-full", className)}>
      {title && (
        <h3 className="m-0 mb-2 text14Bold text-textPrimary">{title}</h3>
      )}

      {items?.length && (
        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "descriptions-item",
                "h-11",
                "flex justify-between items-center text-textPrimary",
                bordered && "border-t border-neutral300 first:border-t-0",
                item.className,
              )}
            >
              <div className="descriptions-item-label text14Medium">
                {item.label}
              </div>
              <div className="descriptions-item-value text14Medium">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
