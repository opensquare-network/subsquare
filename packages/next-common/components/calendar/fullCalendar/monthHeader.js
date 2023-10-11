import React from "react";

/**
 * @param {import("react-big-calendar").HeaderProps}
 */
export default function FullCalendarMonthHeader({ label }) {
  const [first, ...rest] = label;

  return (
    <div className="text12Bold text-textTertiary uppercase text-left">
      {first}
      <span className="max-sm:hidden">{rest.join("")}</span>
    </div>
  );
}
