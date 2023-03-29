import dayjs from "dayjs";
import React from "react";
import advancedFormat from "dayjs/plugin/advancedFormat";
import styled from "styled-components";
import { NeutralPanel } from "../../styled/containers/neutralPanel";
import {
  flex,
  flex_col,
  gap_y,
  m,
  m_l,
  p_x,
  p_y,
  text_primary,
  text_tertiary,
} from "../../../styles/tailwindcss";
import {
  p_12_normal,
  p_16_bold,
  shadow_100,
} from "../../../styles/componentCss";
import Divider from "../../styled/layout/divider";
import DayEventTimelines from "./timelines";
import {
  useCalendarEvents,
  useCalendarUserEvents,
} from "../../../hooks/calendar";

dayjs.extend(advancedFormat);

const Wrapper = styled(NeutralPanel)`
  ${p_x(24)}
  ${p_y(20)}
  ${shadow_100}
  ${flex}
  ${flex_col}
  ${gap_y(16)}
`;

const Title = styled.h2`
  ${m(0)}
  ${p_16_bold}
  ${text_primary}
`;
const TitleDate = styled.small`
  ${m_l(12)}
  ${p_12_normal}
  ${text_tertiary}
`;

export default function DayEvents({ selectedDate, futureEvents = [] }) {
  const [dayEvents, loading] = useCalendarEvents(selectedDate, "day");
  const [dayUserEvents, loadingUserEvents] = useCalendarUserEvents(
    selectedDate,
    "day",
  );
  const dayFutureEvents = futureEvents.filter((event) => {
    return dayjs(event.indexer.blockTime).isSame(selectedDate, "day");
  });

  return (
    <Wrapper>
      <Title>
        Event
        <TitleDate>{dayjs(selectedDate).format("MMMM Do, YYYY")}</TitleDate>
      </Title>

      <Divider />

      <DayEventTimelines
        events={dayEvents}
        userEvents={dayUserEvents}
        loading={loading || loadingUserEvents}
        futureEvents={dayFutureEvents}
      />
    </Wrapper>
  );
}
