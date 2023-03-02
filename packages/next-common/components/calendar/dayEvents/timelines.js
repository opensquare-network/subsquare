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
  text_tertiary,
  w,
  w_full,
} from "../../../styles/tailwindcss";

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
const TimeItem = styled.div`
  ${flex}
  ${gap_x(8)}
  ${items_center}
`;
const TimeWrapper = styled.div``;

function Time({ children, hour }) {
  return (
    <TimeWrapper>
      <TimeItem>
        <TimeLineHour>{String(hour).padStart(2, "0")}:00</TimeLineHour>
        <TimeLineSolid />
      </TimeItem>
      {children && <TimeLineContent>{children}</TimeLineContent>}
    </TimeWrapper>
  );
}

export default function DayEventsTimeline({ events = [] }) {
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
        <Time key={n} hour={n}>
          {/* TODO: event card */}
          {eventInHourGrpup[n]?.map((event) => {
            return <div key={event._id}>{event.data.postTitle}</div>;
          })}
        </Time>
      ))}
    </div>
  );
}
