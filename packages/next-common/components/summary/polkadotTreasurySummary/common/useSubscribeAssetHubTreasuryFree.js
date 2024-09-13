import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeFellowshipTreasury(api, address) {
  const [free, setFree] = useState(0);

  const { loading } = useSubStorage("system", "account", [address], {
    api,
    callback: useCallback((account) => {
      const free = new BigNumber(account.data.free.toJSON()).toString();
      setFree(free);
    }, []),
  });

  return { free, isLoading: loading };
}
