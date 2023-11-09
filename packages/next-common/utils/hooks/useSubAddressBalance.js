import BigNumber from "bignumber.js";
import { useChain } from "next-common/context/chain";
import { useEffect, useState } from "react";

export default function useSubAddressBalance(api, address) {
  const chain = useChain();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    let unsub;

    api.query.system
      .account(address, (account) => {
        const balance = new BigNumber(account.data.free.toJSON())
          .plus(account.data.reserved.toJSON())
          .toString();

        setBalance(balance);
        setIsLoading(false);
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, chain, address]);

  return { balance, isLoading };
}
