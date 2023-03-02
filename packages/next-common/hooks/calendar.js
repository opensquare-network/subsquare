import { useEffect, useMemo, useState } from "react";
import { calendarEventsApi, calendarEventsSummaryApi } from "../services/url";
import useIsMounted from "../utils/hooks/useIsMounted";
import nextApi from "../services/nextApi";
import dayjs from "dayjs";

/**
 * @param {dayjs.OpUnitType} unit
 */
function useFetchCalendarEvents(endpoint, date, unit) {
  const [events, setEvents] = useState([]);
  const isMounted = useIsMounted().current;

  const [begin_time, end_time] = useMemo(() => {
    const d = dayjs(date);
    return [d.startOf(unit).valueOf(), d.endOf(unit).valueOf()];
  }, [date]);

  useEffect(() => {
    if (isMounted) {
      nextApi.fetch(endpoint, { begin_time, end_time }).then(({ result }) => {
        if (result) {
          setEvents(result);
        }
      });
    }
  }, [isMounted, begin_time, end_time]);

  return events;
}

/**
 * @description returns events summary
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEventsSummary(date, unit) {
  const events = useFetchCalendarEvents(calendarEventsSummaryApi, date, unit);
  return events;
}

/**
 * @description returns events
 * @param {dayjs.OpUnitType}
 */
export function useCalendarEvents(date, unit) {
  const events = useFetchCalendarEvents(calendarEventsApi, date, unit);
  return events;
}
