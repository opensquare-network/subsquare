import { useEffect, useMemo, useState } from "react";
import { calendarEventsSummaryApi } from "../services/url";
import useIsMounted from "../utils/hooks/useIsMounted";
import nextApi from "../services/nextApi";
import dayjs from "dayjs";

/**
 * @description returns events summary
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEventsSummary(date, unit) {
  const [events, setEvents] = useState([]);
  const isMounted = useIsMounted().current;

  const [begin_time, end_time] = useMemo(() => {
    const d = dayjs(date);
    return [d.startOf(unit).valueOf(), d.endOf(unit).valueOf()];
  }, [date]);

  useEffect(() => {
    if (isMounted) {
      nextApi
        .fetch(calendarEventsSummaryApi, { begin_time, end_time })
        .then(({ result }) => {
          if (result) {
            setEvents(result);
          }
        });
    }
  }, [isMounted, begin_time, end_time]);

  return events;
}
