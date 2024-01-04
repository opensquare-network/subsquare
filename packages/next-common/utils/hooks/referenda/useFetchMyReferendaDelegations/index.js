import useApi from "next-common/utils/hooks/useApi";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import getAddressTrackDelegations from "./addressDelegations";
import { useDispatch, useSelector } from "react-redux";
import {
  myReferendaDelegationsTrigger,
  setMyReferendaDelegations,
} from "next-common/store/reducers/myOnChainData/referenda/myReferendaDelegations";

export default function useFetchMyReferendaDelegations() {
  const api = useApi();
  const realAddress = useRealAddress();
  const dispatch = useDispatch();
  const trigger = useSelector(myReferendaDelegationsTrigger);

  useEffect(() => {
    if (!api || !realAddress) {
      dispatch(setMyReferendaDelegations([]));
      return;
    }

    getAddressTrackDelegations(api, realAddress).then((delegations) => {
      dispatch(setMyReferendaDelegations(delegations));
    });
  }, [api, realAddress, dispatch, trigger]);
}
