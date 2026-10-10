import { useEffect, useMemo, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import useCoretimeSale from "next-common/context/coretime/sale/provider";
import { buildAutoRenewalIndex, buildRenewalIndex } from "./renewalInfoUtils";

export default function useCoretimeRenewalInfo() {
  const api = useContextPapiApi();
  const sale = useCoretimeSale();
  const renewalWhen = sale?.info?.regionBegin;
  const [autoRenewals, setAutoRenewals] = useState([]);
  const [potentialRenewals, setPotentialRenewals] = useState([]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const subscription = api.query.Broker.AutoRenewals.watchValue().subscribe({
      next: ({ value }) => setAutoRenewals(value ?? []),
      error: (error) => {
        console.error("Failed to watch coretime auto renewals:", error);
        setAutoRenewals([]);
      },
    });

    return () => subscription.unsubscribe();
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const subscription =
      api.query.Broker.PotentialRenewals.watchEntries().subscribe({
        next: ({ entries }) => setPotentialRenewals(entries ?? []),
        error: (error) => {
          console.error("Failed to watch coretime potential renewals:", error);
          setPotentialRenewals([]);
        },
      });

    return () => subscription.unsubscribe();
  }, [api]);

  return useMemo(
    () => ({
      autoRenewByCore: buildAutoRenewalIndex(autoRenewals),
      renewalByCore: buildRenewalIndex(potentialRenewals, renewalWhen),
    }),
    [autoRenewals, potentialRenewals, renewalWhen],
  );
}
