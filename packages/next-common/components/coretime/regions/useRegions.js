import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextApi } from "next-common/context/api";
import { useContextPapiApi } from "next-common/context/papi";
import useCoretimeStatus from "next-common/context/coretime/status";
import { formatRegionEntry } from "./utils";

const isSameEntry = (a, b) =>
  a === b ||
  (a.keyArgs.length === b.keyArgs.length &&
    a.keyArgs.every((arg, i) => arg === b.keyArgs[i]) &&
    a.value === b.value);

export default function useRegions() {
  const api = useContextPapiApi();
  const contextApi = useContextApi();
  const status = useCoretimeStatus();
  const lastTimeslice = status?.lastTimeslice;
  const timeslicePeriod =
    contextApi?.consts.broker?.timeslicePeriod?.toNumber();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEntries([]);
    setLoading(true);
    if (!api) {
      return;
    }

    const subscription = api.query.Broker.Regions.watchEntries().subscribe({
      next: ({ entries: newEntries }) => {
        setLoading(false);
        setEntries((prev) =>
          prev.length === newEntries.length &&
          newEntries.every((entry, idx) => isSameEntry(entry, prev[idx]))
            ? prev
            : newEntries,
        );
      },
      error: (error) => {
        console.error("Failed to watch coretime regions:", error);
        setEntries([]);
        setLoading(false);
      },
    });

    return () => subscription.unsubscribe();
  }, [api]);

  const regions = useMemo(() => {
    if (isNil(lastTimeslice) || isNil(timeslicePeriod)) {
      return [];
    }
    return entries
      .map((entry) => formatRegionEntry(entry, lastTimeslice, timeslicePeriod))
      .sort((a, b) => b.begin - a.begin || a.core - b.core);
  }, [entries, lastTimeslice, timeslicePeriod]);

  return {
    regions,
    loading: loading || isNil(lastTimeslice) || isNil(timeslicePeriod),
  };
}
