import React from "react";

export default function CalendarMonthHeader({ label }) {
  const [first] = label;

  return (
    <div className="text12Bold text-textTertiary uppercase text-center">
      {first}
    </div>
  );
}
