import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import {
  useTreasuryPapiPallet,
} from "next-common/context/treasury";
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
    const sub = papi.query[treasuryPallet].Spends.watchValue(index).subscribe(
      (value) => {
        setSpend(value ?? null);
        setLoading(false);
      },
    );

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, index, treasuryPallet]);

  return { spend, loading };
}
