import React from "react";
import { FULLCALENDAR_CATEGORY_COLORS } from "./consts";

export default function FullCalendarCategory({
  category,
  onlyDot = false,
  color,
}) {
  const categoryColor = color ?? FULLCALENDAR_CATEGORY_COLORS[category];

  return (
    <span className="inline-flex items-center">
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: categoryColor || "var(--textTertiary)" }}
      />
      {!onlyDot && category && (
        <span className="text12Medium text-textSecondary ml-2">{category}</span>
      )}
    </span>
  );
}
