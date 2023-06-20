import dayjs from "dayjs";
import groupBy from "lodash.groupby";
import React from "react";
import styled from "styled-components";
import { p_12_medium, p_14_normal } from "../../../styles/componentCss";
import {
  flex,
  gap_x,
  h,
  items_center,
  justify_center,
  m,
  m_l,
  p_b,
  w,
  w_full,
} from "../../../styles/tailwindcss";
import EventInfoCard from "./eventInfoCard";
import FutureEventInfoCard from "./futureEventInfoCard";
import Loading from "../../loading";
import { EventType } from "./eventInfoCard/utils";
import { FutureEventType } from "./futureEventInfoCard/futureEventType";
import UserEventInfoCard from "./userEventInfoCard";

const TimeLineHour = styled.div`
  ${w(40)}
  ${p_12_medium}
  color: var(--textTertiary);
  text-align: right;
`;
const TimeLineSolid = styled.div`
  ${w_full}
  ${h(1)}
  background-color: var(--neutral200);
`;
const TimeLineContent = styled.div`
  ${m_l(48)}
  & > :not(:first-child) {
    margin-top: 8px;
  }
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
  color: var(--textTertiary);
  ${m(0)}
`;

function joinSortedEvents(events, userEvents, futureEvents) {
  const allEvents = [...events, ...userEvents, ...futureEvents];
  const sortedEvents = allEvents.sort((a, b) => {
    const aTime = a.indexer?.blockTime || a.timestamp;
    const bTime = b.indexer?.blockTime || b.timestamp;
    return aTime - bTime;
  });
  return sortedEvents;
}

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

export default function DayEventTimelines({
  events = [],
  userEvents = [],
  futureEvents = [],
  loading,
  refresh,
}) {
  const hrs = Array.from({ length: 25 }).map((_, i) => i);

  const eventInHourKey = "eventInHourKey";
  const eventInHourGroup = groupBy(
    events.map((event) => {
      return {
        ...event,
        [eventInHourKey]: dayjs(event.indexer.blockTime).get("hour"),
      };
    }),
    eventInHourKey,
  );

  const userEventInHourGroup = groupBy(
    userEvents.map((event) => {
      return {
        ...event,
        category: "User Event",
        type: "userEvent",
        [eventInHourKey]: dayjs(event.timestamp).get("hour"),
      };
    }),
    eventInHourKey,
  );

  const futureEventInHourGroup = groupBy(
    futureEvents.map((event) => {
      return {
        ...event,
        [eventInHourKey]: dayjs(event.indexer.blockTime).get("hour"),
      };
    }),
    eventInHourKey,
  );

  if (loading) {
    return (
      <StatusWrapper>
        <Loading />
      </StatusWrapper>
    );
  }

  if (!events.length && !futureEvents.length && !userEvents.length) {
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
          {joinSortedEvents(
            eventInHourGroup[n] || [],
            userEventInHourGroup[n] || [],
            futureEventInHourGroup[n] || [],
          ).map((event, index) => {
            if (Object.values(EventType).includes(event.type)) {
              return <EventInfoCard key={event._id} event={event} />;
            }
            if (Object.values(FutureEventType).includes(event.type)) {
              return <FutureEventInfoCard key={index} event={event} />;
            }
            return (
              <UserEventInfoCard
                key={event._id}
                event={event}
                refresh={refresh}
              />
            );
          })}
        </Timeline>
      ))}
    </div>
  );
}
