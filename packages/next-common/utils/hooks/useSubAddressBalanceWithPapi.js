import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import { useContextPapiApi } from "next-common/context/papi";

export default function useSubAddressBalanceWithPapi(address) {
  const papi = useContextPapiApi();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!papi || !address) {
      return;
    }

    const sub = papi.query.System.Account.watchValue(address).subscribe(
      (account) => {
        const balance = new BigNumber(account?.data?.free || 0)
          .plus(account?.data?.reserved || 0)
          .toString();
        setBalance(balance);
        setIsLoading(false);
      },
    );

    return () => {
      sub?.unsubscribe?.();
    };
  }, [papi, address]);

  return { balance, isLoading };
}
