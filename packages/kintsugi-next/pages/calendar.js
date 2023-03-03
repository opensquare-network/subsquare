import HomeLayout from "next-common/components/layout/HomeLayout";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import { withLoginUser, withLoginUserRedux } from "next-common/lib";
import { flex, flex_col, gap_y } from "next-common/styles/tailwindcss";
import styled from "styled-components";
import FullCalendar from "next-common/components/calendar/fullCalendar";
import DayEvents from "next-common/components/calendar/dayEvents";
import { useState } from "react";

const Wrapper = styled.div`
  ${flex}
  ${flex_col}
  ${gap_y(16)}
`;

export default withLoginUserRedux(() => {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(date);

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
        />

        {/* events component */}
        <DayEvents selectedDate={selectedDate} />
      </Wrapper>
    </HomeLayout>
  );
});

export const getServerSideProps = withLoginUser(async () => {
  return {
    props: {},
  };
});
