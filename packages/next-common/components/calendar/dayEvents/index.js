import dayjs from "dayjs";
import React from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

export default function DayEvents({ selectedDate }) {
  return <div>Day events {dayjs(selectedDate).format("MMMM Do, YYYY")}</div>;
}
