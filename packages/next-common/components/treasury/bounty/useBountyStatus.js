import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export function useBountyStatus(bountyIndex) {
  const papi = useContextPapiApi();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!papi || !bountyIndex) {
      return;
    }

    setLoading(true);
    const sub = papi.query.Bounties.Bounties.watchValue(bountyIndex).subscribe(
      ({ value }) => {
        setResult(value ?? null);
        setLoading(false);
      },
    );

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, bountyIndex]);

  if (loading || !result) {
    return null;
  }

  return result.status ?? null;
}
