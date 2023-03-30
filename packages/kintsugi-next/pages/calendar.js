import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { flex, flex_col, gap_y, m_x } from "next-common/styles/tailwindcss";
import styled from "styled-components";
import FullCalendar from "next-common/components/calendar/fullCalendar";
import DayEvents from "next-common/components/calendar/dayEvents";
import { useState } from "react";
import { smcss } from "next-common/utils/responsive";
import useScheduled from "next-common/hooks/useScheduled";
import { useCalendarUserEvents } from "next-common/hooks/calendar";
import { adminsApi } from "next-common/services/url";

const Wrapper = styled.div`
  ${flex}
  ${flex_col}
  ${gap_y(16)}
  ${smcss(m_x(16))}
`;

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
    <HomeLayout>
      <Wrapper>
        <TitleContainer>Calendar</TitleContainer>

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
      </Wrapper>
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  const { result: admins } = await nextApi.fetch(adminsApi);

  return {
    props: {
      admins: admins ?? [],
    },
  };
});
