import useApi from "next-common/utils/hooks/useApi";
import { useEffect } from "react";
import getAddressTrackDelegations from "./addressDelegations";
import { useDispatch } from "react-redux";
import { setReferendaDelegations } from "next-common/store/reducers/myOnChainData/referenda/referendaDelegations";

export default function useFetchReferendaDelegations(address) {
  const api = useApi();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!api || !address) {
      dispatch(setReferendaDelegations([]));
      return;
    }

    getAddressTrackDelegations(api, address).then((delegations) => {
      dispatch(setReferendaDelegations(delegations));
    });
  }, [api, address, dispatch]);
}
