import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useBalanceDemocracLock() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [democracyLock, setDemocracLock] = useState(0);

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
