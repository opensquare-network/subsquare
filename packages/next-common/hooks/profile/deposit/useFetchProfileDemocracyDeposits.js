import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { isAddress } from "@polkadot/util-crypto";
import { queryAddressDeposits as queryDemocracyAddressDeposits } from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";
import { setProfileDemocracyDeposits } from "next-common/store/reducers/profile/deposits/democracy";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function useFetchProfileDemocracyDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { democracy: hasDemocracyModule },
  } = useChainSettings();

  const prevAddress = useRef(address);
  const prevApi = useRef(api);

  useEffect(() => {
    if (prevAddress.current === address && prevApi.current === api) {
      return;
    }

    prevAddress.current = address;
    prevApi.current = api;

    if (!api) {
      return;
    }

    if (!isAddress(address) || !api.query?.democracy || !hasDemocracyModule) {
      dispatch(setProfileDemocracyDeposits([]));
      return;
    }

    let isMounted = true;

    queryDemocracyAddressDeposits(api, address).then((data) => {
      if (isMounted) {
        dispatch(setProfileDemocracyDeposits(data));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [api, address, dispatch, hasDemocracyModule]);
}
