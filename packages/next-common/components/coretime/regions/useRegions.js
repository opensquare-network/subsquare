import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import { formatRegionEntry } from "./utils";

export default function useRegions() {
  const api = useContextPapiApi();
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      api.query.Broker.Regions.getEntries(),
      api.query.Broker.Status.getValue(),
      api.constants.Broker.TimeslicePeriod(),
    ])
      .then(([entries, status, timeslicePeriod]) => {
        if (cancelled) {
          return;
        }

        const formattedRegions = entries
          .map((entry) =>
            formatRegionEntry(entry, status.last_timeslice, timeslicePeriod),
          )
          .sort((a, b) => b.begin - a.begin || a.core - b.core);

        setRegions(formattedRegions);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to query coretime regions:", error);
          setRegions([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api]);

  return { regions, loading };
}
