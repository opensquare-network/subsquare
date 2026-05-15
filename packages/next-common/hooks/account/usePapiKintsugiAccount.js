import { useSymbol } from "next-common/context/chain";
import { useContextPapiApi } from "next-common/context/papi";
import { useEffect, useMemo, useState } from "react";

export default function usePapiKintsugiAccount(address) {
  const papi = useContextPapiApi();
  const symbol = useSymbol();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const tokenSymbol = useMemo(() => {
    return { token: symbol };
  }, [symbol]);

  useEffect(() => {
    if (!papi || !address) {
      return;
    }

    setData(null);
    setIsLoading(true);

    const sub = papi.query.Tokens.Accounts.watchValue(
      address,
      tokenSymbol,
    ).subscribe((data) => {
      // console.log("Received PAPI Kintsugi account data:", data);
      setData(data.value ?? null);
      setIsLoading(false);
    });

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, address, tokenSymbol]);

  return { data, isLoading };
}
