import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  setIsLoadingClassLocks,
  setMyReferendaClassLocks,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { useContextApi } from "next-common/context/api";

export default function useSubClassLocks() {
  const address = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !api.query.convictionVoting || !address) {
      return;
    }

    let unsub;
    dispatch(setIsLoadingClassLocks(true));
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
      .then((result) => (unsub = result))
      .finally(() => {
        dispatch(setIsLoadingClassLocks(false));
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api, address, dispatch]);
}
