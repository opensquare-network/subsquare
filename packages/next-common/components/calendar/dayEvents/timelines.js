import dayjs from "dayjs";
import { groupBy } from "lodash-es";
import React from "react";
import EventInfoCard from "./eventInfoCard";
import FutureEventInfoCard from "./futureEventInfoCard";
import Loading from "../../loading";
import { EventType } from "./eventInfoCard/utils";
import { FutureEventType } from "./futureEventInfoCard/futureEventType";
import UserEventInfoCard from "./userEventInfoCard";
import tw from "tailwind-styled-components";

const StatusWrapper = tw.div`
  flex items-center justify-center
  h-11
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
    <div className="pb-4">
      <div className="flex gap-x-2 items-center">
        <div className="w-10 text12Medium text-textTertiary text-right">
          {String(hour).padStart(2, "0")}:00
        </div>
        <hr className="w-full border-neutral200" />
      </div>
      {children && <div className="ml-12 space-y-2">{children}</div>}
    </div>
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
        <p className="text14Medium m-0 text-textTertiary">No current events</p>
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
