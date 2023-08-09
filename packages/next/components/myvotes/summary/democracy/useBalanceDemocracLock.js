import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useEffect, useState } from "react";

export default function useBalanceDemocracLock() {
  const api = useApi();
  const realAddress = useRealAddress();
  const [democracyLock, setDemocracLock] = useState();

  useEffect(() => {
    if (!api || !realAddress) {
      return;
    }

    let unsub;
    api.query.balances
      .locks(realAddress, (rawLocks) => {
        const democracLock = rawLocks.find(
          (lock) => lock.id.toHuman() === "democrac",
        );
        if (democracLock) {
          setDemocracLock(democracLock.amount.toString());
        }
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, realAddress]);

  return democracyLock;
}
