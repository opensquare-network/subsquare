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
  const [isAutoRenewalsLoaded, setAutoRenewalsLoaded] = useState(false);
  const [isPotentialRenewalsLoaded, setPotentialRenewalsLoaded] =
    useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    const subscription = api.query.Broker.AutoRenewals.watchValue().subscribe({
      next: ({ value }) => {
        setAutoRenewals(value ?? []);
        setAutoRenewalsLoaded(true);
      },
      error: (error) => {
        console.error("Failed to watch coretime auto renewals:", error);
        setAutoRenewals([]);
        setAutoRenewalsLoaded(true);
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
        next: ({ entries }) => {
          setPotentialRenewals(entries ?? []);
          setPotentialRenewalsLoaded(true);
        },
        error: (error) => {
          console.error("Failed to watch coretime potential renewals:", error);
          setPotentialRenewals([]);
          setPotentialRenewalsLoaded(true);
        },
      });

    return () => subscription.unsubscribe();
  }, [api]);

  return useMemo(
    () => ({
      autoRenewByCore: buildAutoRenewalIndex(autoRenewals),
      renewalByCore: buildRenewalIndex(potentialRenewals, renewalWhen),
      loading: !isAutoRenewalsLoaded || !isPotentialRenewalsLoaded,
    }),
    [
      autoRenewals,
      potentialRenewals,
      renewalWhen,
      isAutoRenewalsLoaded,
      isPotentialRenewalsLoaded,
    ],
  );
}
