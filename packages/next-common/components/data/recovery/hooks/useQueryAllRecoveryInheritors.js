import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useQueryAllRecoveryInheritors() {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  const fetch = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!api?.query.recovery?.inheritor) {
      setLoading(false);
      setData([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery.inheritor
      .entries()
      .then((entries) => {
        if (cancelled) return;

        const result = entries.map(([storageKey, value]) => {
          const account = storageKey.args?.[0]?.toString();
          const jsonValue = value.toJSON();

          const inheritancePriority = parseInt(jsonValue?.[0]) || 0;
          const inheritor = jsonValue?.[1] || "";
          const consideration = jsonValue?.[2] || {};
          const depositor = consideration.depositor || "";
          const ticket = parseInt(consideration.ticket) || 0;

          return {
            account,
            inheritancePriority,
            inheritor,
            depositor,
            ticket,
          };
        });

        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to query recovery inheritors", error);
        if (!cancelled) {
          setData([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, fetchCount]);

  return { data, loading, fetch };
}
