import dayjs from "dayjs";
import groupBy from "lodash.groupby";
import React from "react";
import styled from "styled-components";
import { p_12_medium, p_14_normal } from "../../../styles/componentCss";
import {
  bg_theme,
  flex,
  gap_x,
  h,
  items_center,
  justify_center,
  m,
  m_l,
  p_b,
  p_t,
  p_y,
  text_tertiary,
  w,
  w_full,
} from "../../../styles/tailwindcss";
import EventInfoCard from "./eventInfoCard";
import Loading from "../../loading";

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

const StatusWrapper = styled.div`
  ${flex}
  ${items_center}
  ${justify_center}
  ${h(44)}
`;

const NoData = styled.p`
  ${p_14_normal}
  ${text_tertiary}
  ${m(0)}
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

export default function DayEventTimelines({ events = [], loading }) {
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

  if (loading) {
    return (
      <StatusWrapper>
        <Loading />
      </StatusWrapper>
    );
  }

  if (!events.length) {
    return (
      <StatusWrapper>
        <NoData>No current events</NoData>
      </StatusWrapper>
    );
  }

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
