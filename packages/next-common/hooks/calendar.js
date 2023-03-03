import { useEffect, useMemo, useState } from "react";
import { calendarEventsApi, calendarEventsSummaryApi } from "../services/url";
import useIsMounted from "../utils/hooks/useIsMounted";
import nextApi from "../services/nextApi";
import dayjs from "dayjs";

/**
 * @param {dayjs.OpUnitType} unit
 */
function useFetchCalendarEvents(endpoint, date, unit) {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);

  const [begin_time, end_time] = useMemo(() => {
    const d = dayjs(date);
    return [d.startOf(unit).valueOf(), d.endOf(unit).valueOf()];
  }, [date]);

  const cachedKey = useMemo(
    () => `${begin_time}_${end_time}_${unit}`,
    [begin_time, end_time, unit]
  );
  // {cachedKey: Event[]}
  const [cachedEvents, setCachedEvents] = useState({});

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

  return useMemo(
    () => [cachedEvents[cachedKey], loading],
    [cachedKey, cachedEvents, loading]
  );
}

/**
 * @description returns events summary
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEventsSummary(date, unit) {
  const [events, loading] = useFetchCalendarEvents(
    calendarEventsSummaryApi,
    date,
    unit
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
    unit
  );
  return [events, loading];
}
