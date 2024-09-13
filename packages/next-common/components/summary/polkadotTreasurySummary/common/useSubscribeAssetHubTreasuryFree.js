import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useSubscribeFellowshipTreasuryFree(api, address) {
  const [free, setFree] = useState(0);

  useSubStorage("system", "account", [address], {
    api,
    callback: useCallback((accountData) => {
      const free = accountData.data.free.toJSON();
      setFree(free);
    }, []),
  });

  return { free, isLoading: false };
}
