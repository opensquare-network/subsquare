// https://ant.design/components/descriptions, Display multiple read-only fields in groups.

import React from "react";
import { cn } from "next-common/utils";

export default function Descriptions({ title = "", items = [] }) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="m-0 mb-2 text14Bold text-textPrimary">{title}</h3>
      )}

      {items?.length && (
        <div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "h-11",
                "flex justify-between items-center text-textPrimary",
                "border-t border-neutral300 first:border-t-0",
              )}
            >
              <div className="text14Medium">{item.label}</div>
              <div className="text14Medium">{item.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
