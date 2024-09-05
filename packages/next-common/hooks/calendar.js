import { useCallback, useEffect, useState } from "react";
import {
  calendarEventsApi,
  calendarEventsSummaryApi,
  calendarUserEventsApi,
  calendarUserEventsSummaryApi,
} from "../services/url";
import { useMountedState } from "react-use";
import nextApi from "../services/nextApi";
import dayjs from "dayjs";

/**
 * @param {dayjs.OpUnitType} unit
 */
function useFetchCalendarEvents(endpoint, date, unit) {
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(false);
  const [cachedEvents, setCachedEvents] = useState({});

  const d = dayjs(date);
  const begin_time = d.startOf(unit).valueOf();
  const end_time = d.endOf(unit).valueOf();
  const cachedKey = `${endpoint}_${begin_time}_${end_time}_${unit}`;

  const refresh = useCallback(async () => {
    const { result } = await nextApi.fetch(endpoint, { begin_time, end_time });
    if (result) {
      setCachedEvents((events) => {
        return {
          ...events,
          [cachedKey]: result,
        };
      });
    }
  }, [endpoint, begin_time, end_time, cachedKey]);

  useEffect(() => {
    if (isMounted()) {
      setLoading(true);
      refresh().finally(() => {
        setLoading(false);
      });
    }
  }, [isMounted, refresh]);

  return [cachedEvents[cachedKey], loading, refresh];
}

/**
 * @description returns events summary
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEventsSummary(date, unit) {
  return useFetchCalendarEvents(calendarEventsSummaryApi, date, unit);
}

/**
 * @description returns events
 * @param {dayjs.OpUnitType} unit
 */
export function useCalendarEvents(date, unit) {
  return useFetchCalendarEvents(calendarEventsApi, date, unit);
}

export function useCalendarUserEventsSummary(date, unit) {
  return useFetchCalendarEvents(calendarUserEventsSummaryApi, date, unit);
}

export function useCalendarUserEvents(date, unit) {
  return useFetchCalendarEvents(calendarUserEventsApi, date, unit);
}
