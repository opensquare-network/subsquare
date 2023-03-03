import dayjs from "dayjs";
import groupBy from "lodash.groupby";
import React from "react";
import styled from "styled-components";
import { p_12_medium } from "../../../styles/componentCss";
import {
  bg_theme,
  flex,
  gap_x,
  h,
  items_center,
  m_l,
  p_b,
  text_tertiary,
  w,
  w_full,
} from "../../../styles/tailwindcss";
import EventInfoCard from "./eventInfoCard";

const TimeLineHour = styled.div`
  ${w(40)}
  ${p_12_medium}
  ${text_tertiary}
  text-align: right;
`;
const TimeLineSolid = styled.div`
  ${w_full}
  ${h(1)}
  ${bg_theme("grey100Bg")}
`;
const TimeLineContent = styled.div`
  ${m_l(48)}
`;
const TimelineItem = styled.div`
  ${flex}
  ${gap_x(8)}
  ${items_center}
`;
const TimelineWrapper = styled.div`
  ${p_b(16)}
`;

function Timeline({ children, hour }) {
  return (
    <TimelineWrapper>
      <TimelineItem>
        <TimeLineHour>{String(hour).padStart(2, "0")}:00</TimeLineHour>
        <TimeLineSolid />
      </TimelineItem>
      {children && <TimeLineContent>{children}</TimeLineContent>}
    </TimelineWrapper>
  );
}

export default function DayEventTimelines({ events = [] }) {
  const hrs = Array.from({ length: 25 }).map((_, i) => i);

  const eventInHourKey = "eventInHourKey";
  const eventInHourGrpup = groupBy(
    events.map((event) => {
      return {
        ...event,
        [eventInHourKey]: dayjs(event.indexer.blockTime).get("hour"),
      };
    }),
    eventInHourKey
  );

  return (
    <div>
      {hrs.map((n) => (
        <Timeline key={n} hour={n}>
          {eventInHourGrpup[n]?.map((event) => {
            return <EventInfoCard key={event._id} event={event} />;
          })}
        </Timeline>
      ))}
    </div>
  );
}
