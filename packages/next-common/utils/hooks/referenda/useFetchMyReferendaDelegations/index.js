import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  myReferendaDelegationsTrigger,
  setMyReferendaDelegations,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import getAddressTrackDelegations from "../useFetchProfileReferendaDelegations/addressDelegations";
import { useContextApi } from "next-common/context/api";

// The refresh is triggered from the in-block event of a transaction; read the
// state once more shortly after so a lagging node best block can not leave the
// list stale.
const REFRESH_RETRY_DELAY = 3000;

export default function useFetchMyReferendaDelegations() {
  const api = useContextApi();
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const trigger = useSelector(myReferendaDelegationsTrigger);

  useEffect(() => {
    if (!api || !realAddress) {
      dispatch(setMyReferendaDelegations([]));
      return;
    }

    let cancelled = false;
    const fetchDelegations = () => {
      return getAddressTrackDelegations(api, realAddress)
        .then((delegations) => {
          if (!cancelled) {
            dispatch(setMyReferendaDelegations(delegations));
          }
        })
        .catch(() => {});
    };

    fetchDelegations();

    const timer =
      trigger > 0 ? setTimeout(fetchDelegations, REFRESH_RETRY_DELAY) : null;

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [api, realAddress, dispatch, trigger]);
}
