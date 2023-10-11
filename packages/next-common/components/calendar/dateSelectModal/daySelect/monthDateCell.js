import React from "react";
import dayjs from "dayjs";
import noop from "lodash.noop";
import isToday from "dayjs/plugin/isToday";
import { cn } from "next-common/utils";

dayjs.extend(isToday);

export default function CalendarMonthDateCell({
  label,
  date,
  selectedDate,
  setSelectedDate = noop,
}) {
  label = Number(label);

  const day = dayjs(date);
  const isToday = day.isToday();
  const isSelectedDay = day.isSame(selectedDate, "day");
  const isPast = day.isBefore(dayjs(), "day");
  const isSameMonth = day.isSame(selectedDate, "month");

  function onCellClick() {
    setSelectedDate(date);
  }

  return (
    <div
      className={cn(
        "w-full h-8",
        "flex flex-col justify-between",
        "p-2 rounded",
        "text-left",
        "hover:bg-neutral200",
        isToday && "border border-neutral500",
        isSelectedDay && "bg-neutral300",
      )}
      role="button"
      onClick={onCellClick}
    >
      <span
        className={cn(
          "text12Bold text-textSecondary text-center",
          "m-0",
          isSameMonth && "text-textTertiary",
          isPast && "text-textDisabled",
        )}
      >
        {label}
      </span>
    </div>
  );
}
