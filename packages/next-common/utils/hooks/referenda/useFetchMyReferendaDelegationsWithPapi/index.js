import { useEffect } from "react";
import { useContextPapiApi } from "next-common/context/papi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch, useSelector } from "react-redux";
import {
  myReferendaDelegationsTrigger,
  setMyReferendaDelegations,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";
import getAddressTrackDelegationsWithPapi from "../useFetchProfileReferendaDelegations/addressDelegationsWithPapi";

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

    getAddressTrackDelegationsWithPapi(papi, realAddress).then((delegations) => {
      dispatch(setMyReferendaDelegations(delegations));
    });
  }, [papi, realAddress, dispatch, trigger]);
}
