import dayjs from "dayjs";
import React from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
import styled from "styled-components";
import EventInfoCard from "./eventInfoCard";
import { useCalendarEvents } from "../../../hooks/calendar";

dayjs.extend(advancedFormat);

const Wrapper = styled.div``;

export default function DayEvents({ selectedDate }) {
  const events = useCalendarEvents(selectedDate, "day");
  console.log(events);

  return (
    <Wrapper>
      <div>Day events {dayjs(selectedDate).format("MMMM Do, YYYY")}</div>
      {events.map((event) => (
        <EventInfoCard key={event._id} event={event} />
      ))}
    </Wrapper>
  );
}
