import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { useContextPapiApi } from "next-common/context/papi";

export default function useSubTreasurySpend(index) {
  const papi = useContextPapiApi();
  const [loading, setLoading] = useState(true);
  const [spend, setSpend] = useState();
  const treasuryPallet = useTreasuryPapiPallet();

  useEffect(() => {
    if (!papi || isNil(index)) {
      return;
    }

    setLoading(true);
    // `payout` removes the spend from storage in the block it is executed in.
    // Watch the best block instead of the default finalized block: PAPI handles
    // re-orgs for us, and the deletion shows up ~1 block after the tx lands,
    // instead of keeping the Payout button enabled until finalization (or until
    // the scanner updates the post state).
    const sub = papi.query[treasuryPallet].Spends.watchValue(index, {
      at: "best",
    }).subscribe(({ value }) => {
      setSpend(value ?? null);
      setLoading(false);
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, index, treasuryPallet]);

  return { spend, loading };
}
