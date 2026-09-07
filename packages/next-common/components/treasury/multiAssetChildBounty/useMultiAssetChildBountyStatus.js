import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export default function useMultiAssetChildBountyStatus(
  parentBountyId,
  childBountyId,
) {
  const papi = useContextPapiApi();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const subscription = papi.query.MultiAssetBounties.ChildBounties.watchValue(
      parentBountyId,
      childBountyId,
    ).subscribe(({ value }) => {
      setStatus(value?.status ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe?.();
  }, [papi, parentBountyId, childBountyId]);

  return { status, loading };
}
