import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const UpcomingEventsContext = createContext(null);

function compareEventsByTime(a, b) {
  return (
    (a.timeLeftMs ?? Number.MAX_SAFE_INTEGER) -
    (b.timeLeftMs ?? Number.MAX_SAFE_INTEGER)
  );
}

export function UpcomingEventsProvider({ children }) {
  const [eventsBySource, setEventsBySource] = useState({});

  const setSourceEvents = useCallback((source, events = []) => {
    setEventsBySource((previous) => {
      if (previous[source] === events) {
        return previous;
      }

      return {
        ...previous,
        [source]: events,
      };
    });
  }, []);

  const clearSourceEvents = useCallback((source) => {
    setEventsBySource((previous) => {
      if (!previous[source]) {
        return previous;
      }

      const next = { ...previous };
      delete next[source];
      return next;
    });
  }, []);

  const events = useMemo(() => {
    return Object.values(eventsBySource).flat().sort(compareEventsByTime);
  }, [eventsBySource]);

  const value = useMemo(
    () => ({
      events,
      setSourceEvents,
      clearSourceEvents,
    }),
    [events, setSourceEvents, clearSourceEvents],
  );

  return (
    <UpcomingEventsContext.Provider value={value}>
      {children}
    </UpcomingEventsContext.Provider>
  );
}

export function useUpcomingEventsContext() {
  const context = useContext(UpcomingEventsContext);

  if (!context) {
    throw new Error("No upcoming events provider set");
  }

  return context;
}

export function UpcomingEventsSource({ source, events }) {
  const { setSourceEvents, clearSourceEvents } = useUpcomingEventsContext();

  useEffect(() => {
    setSourceEvents(source, events);
  }, [source, events, setSourceEvents]);

  useEffect(() => {
    return () => clearSourceEvents(source);
  }, [source, clearSourceEvents]);

  return null;
}
