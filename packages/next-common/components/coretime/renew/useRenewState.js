import { isNil } from "lodash-es";
import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import { usePageProps } from "next-common/context/page";

export default function useRenewState(core) {
  const papi = useContextPapiApi();
  const { coretimeSale } = usePageProps();
  const renewalWhen = coretimeSale?.info?.regionBegin;
  const [renewal, setRenewal] = useState(null);

  useEffect(() => {
    setRenewal(null);
    if (!papi || isNil(renewalWhen)) {
      return;
    }

    const subscription = papi.query.Broker.PotentialRenewals.watchValue(
      { core, when: renewalWhen },
      { at: "best" },
    ).subscribe({
      next: ({ value }) => {
        setRenewal(value?.completion?.type === "Complete" ? value : null);
      },
      error: (error) => {
        console.error("Failed to watch Coretime renewal:", error);
        setRenewal(null);
      },
    });

    return () => subscription.unsubscribe();
  }, [papi, core, renewalWhen]);

  return renewal;
}
