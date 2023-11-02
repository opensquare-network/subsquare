import FullCalendar from "next-common/components/calendar/fullCalendar";
import DayEvents from "next-common/components/calendar/dayEvents";
import { useCallback, useState } from "react";
import useScheduled from "next-common/hooks/useScheduled";
import {
  useCalendarUserEvents,
  useCalendarUserEventsSummary,
} from "next-common/hooks/calendar";
import ListLayout from "next-common/components/layout/ListLayout";
import { cn } from "next-common/utils";
import { getServerSidePropsWithTracks } from "next-common/services/serverSide/serverSidePropsWithTracks";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(date);
  const futureEvents = useScheduled();
  const [dayUserEvents, loadingDayUserEvents, refreshDayUserEvents] =
    useCalendarUserEvents(selectedDate, "day");
  const [monthUserEvents, , refreshMonthUserEvents] =
    useCalendarUserEventsSummary(selectedDate, "month");

  const refresh = useCallback(() => {
    refreshDayUserEvents();
    refreshMonthUserEvents();
  }, [refreshDayUserEvents, refreshMonthUserEvents]);

  return (
    <ListLayout title="Calendar">
      <div className={cn("flex flex-col gap-y-4", "max-sm:mx-4")}>
        {/* calendar component */}
        <FullCalendar
          date={date}
          setDate={setDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          futureEvents={futureEvents}
          monthUserEvents={monthUserEvents}
          refresh={refresh}
        />

        {/* events component */}
        <DayEvents
          selectedDate={selectedDate}
          futureEvents={futureEvents}
          dayUserEvents={dayUserEvents}
          loadingDayUserEvents={loadingDayUserEvents}
          refresh={refresh}
        />
      </div>
    </ListLayout>
  );
}

export const getServerSideProps = getServerSidePropsWithTracks;
