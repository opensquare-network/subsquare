import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export function useChildBountyStatus(parentBountyId, childBountyId) {
  const papi = useContextPapiApi();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!papi || !parentBountyId || !childBountyId) {
      return;
    }

    setLoading(true);
    const sub = papi.query.ChildBounties.ChildBounties.watchValue(
      parentBountyId,
      childBountyId,
    ).subscribe((value) => {
      setResult(value ?? null);
      setLoading(false);
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, parentBountyId, childBountyId]);

  if (loading || !result) {
    return null;
  }

  return result.status ?? null;
}
