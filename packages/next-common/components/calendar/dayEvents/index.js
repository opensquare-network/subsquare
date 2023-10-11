import dayjs from "dayjs";
import React from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import Divider from "../../styled/layout/divider";
import DayEventTimelines from "./timelines";
import { useCalendarEvents } from "../../../hooks/calendar";

dayjs.extend(advancedFormat);

export default function DayEvents({
  selectedDate,
  futureEvents = [],
  dayUserEvents = [],
  loadingDayUserEvents,
  refresh,
}) {
  const [dayEvents, loading] = useCalendarEvents(selectedDate, "day");
  const dayFutureEvents = futureEvents.filter((event) => {
    return dayjs(event.indexer.blockTime).isSame(selectedDate, "day");
  });

  return (
    <NeutralPanel className="flex flex-col px-6 py-5 gap-y-4">
      <h2 className="text16Bold text-textPrimary">
        Event
        <small className="ml-3 text12Medium text-textTertiary">
          {dayjs(selectedDate).format("MMMM Do, YYYY")}
        </small>
      </h2>

      <Divider />

      <DayEventTimelines
        events={dayEvents}
        userEvents={dayUserEvents}
        futureEvents={dayFutureEvents}
        loading={loading || loadingDayUserEvents}
        refresh={refresh}
      />
    </NeutralPanel>
  );
}
