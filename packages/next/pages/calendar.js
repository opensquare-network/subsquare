import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import FullCalendar from "next-common/components/calendar/fullCalendar";
import DayEvents from "next-common/components/calendar/dayEvents";
import { useCallback, useState } from "react";
import useScheduled from "next-common/hooks/useScheduled";
import {
  useCalendarUserEvents,
  useCalendarUserEventsSummary,
} from "next-common/hooks/calendar";
import { ssrNextApi as nextApi } from "next-common/services/nextApi";
import { adminsApi } from "next-common/services/url";
import ListLayout from "next-common/components/layout/ListLayout";
import clsx from "clsx";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";

export default withLoginUserRedux(() => {
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
      <div className={clsx("flex flex-col gap-y-4", "max-sm:mx-4")}>
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
});

export const getServerSideProps = withLoginUser(async () => {
  const tracksProps = await fetchOpenGovTracksProps();
  const { result: admins } = await nextApi.fetch(adminsApi);

  return {
    props: {
      ...tracksProps,
      admins: admins ?? [],
    },
  };
});
