import { useEffect } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  myReferendaDelegationsTrigger,
  setMyReferendaDelegations,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import getAddressTrackDelegationsWithPapi from "../useFetchProfileReferendaDelegations/addressDelegationsWithPapi";

// The refresh is triggered from the in-block event of a transaction. PAPI's
// best block can still lag behind that event for a moment, so read the state
// once more shortly after the trigger changes.
const REFRESH_RETRY_DELAY = 3000;

export default function useFetchMyReferendaDelegationsWithPapi() {
  const papi = useContextPapiApi();
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const trigger = useSelector(myReferendaDelegationsTrigger);

  useEffect(() => {
    if (!papi || !realAddress) {
      dispatch(setMyReferendaDelegations([]));
      return;
    }

    let cancelled = false;
    const fetchDelegations = () => {
      return getAddressTrackDelegationsWithPapi(papi, realAddress)
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
  }, [papi, realAddress, dispatch, trigger]);
}
