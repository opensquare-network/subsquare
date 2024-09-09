import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export default function useSubAddressBalance(address) {
  const [balance, setBalance] = useState(0);
  const { loading } = useSubStorage(
    "system",
    "account",
    [address],
    {
      callback: useCallback((account) => {
        const balance = new BigNumber(account.data.free.toJSON())
          .plus(account.data.reserved.toJSON())
          .toString();
        setBalance(balance);
      }, []),
    },
  );

  return { balance, isLoading: loading };
}
