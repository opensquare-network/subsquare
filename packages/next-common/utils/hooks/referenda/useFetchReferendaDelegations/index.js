import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import getAddressTrackDelegations from "./addressDelegations";
import { useDispatch } from "react-redux";
import { setProfileReferendaDelegations } from "next-common/store/reducers/profile/referendaDelegations";

export default function useFetchReferendaDelegations(address) {
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!address) {
      dispatch(setProfileReferendaDelegations([]));
      return;
    }

    dispatch(setProfileReferendaDelegations(null));
    getAddressTrackDelegations(api, address).then((delegations) => {
      dispatch(setProfileReferendaDelegations(delegations));
    });
  }, [api, address, dispatch]);
}
