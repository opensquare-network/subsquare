import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setMyReferendaClassLocks } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";

export default function useSubClassLocks() {
  const address = useRealAddress();
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api?.query?.convictionVoting
      ?.classLocksFor(address, (rawLocks) => {
        const normalized = rawLocks.map((rawLock) => {
          return {
            trackId: rawLock[0].toNumber(),
            locked: rawLock[1].toString(),
          };
        });

        dispatch(setMyReferendaClassLocks(normalized));
      })
      .then((result) => (unsub = result));

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address, dispatch]);
}
