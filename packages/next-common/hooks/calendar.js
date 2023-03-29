import { useEffect, useState } from "react";
import {
  calendarEventsApi,
  calendarEventsSummaryApi,
  calendarUserEventsApi,
  calendarUserEventsSummaryApi,
} from "../services/url";
import useIsMounted from "../utils/hooks/useIsMounted";
import nextApi from "../services/nextApi";
import dayjs from "dayjs";

/**
 * @param {dayjs.OpUnitType} unit
 */
function useFetchCalendarEvents(endpoint, date, unit) {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [cachedEvents, setCachedEvents] = useState({});

  const d = dayjs(date);
  const begin_time = d.startOf(unit).valueOf();
  const end_time = d.endOf(unit).valueOf();
  const cachedKey = `${endpoint}_${begin_time}_${end_time}_${unit}`;

  useEffect(() => {
    if (isMounted.current) {
      setLoading(true);
      nextApi
        .fetch(endpoint, { begin_time, end_time })
        .then(({ result }) => {
          if (result) {
            setCachedEvents({
              ...cachedEvents,
              [cachedKey]: result,
            });
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isMounted, begin_time, end_time, cachedKey]);

  return [cachedEvents[cachedKey], loading];
}

/**
 * @description returns events summary
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEventsSummary(date, unit) {
  const [events, loading] = useFetchCalendarEvents(
    calendarEventsSummaryApi,
    date,
    unit,
  );
  return [events, loading];
}

/**
 * @description returns events
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEvents(date, unit) {
  const [events, loading] = useFetchCalendarEvents(
    calendarEventsApi,
    date,
    unit,
  );
  return [events, loading];
}

export function useCalendarUserEventsSummary(date, unit) {
  const [events, loading] = useFetchCalendarEvents(
    calendarUserEventsSummaryApi,
    date,
    unit,
  );
  return [events, loading];
}

export function useCalendarUserEvents(date, unit) {
  const [events, loading] = useFetchCalendarEvents(
    calendarUserEventsApi,
    date,
    unit,
  );
  return [events, loading];
}
