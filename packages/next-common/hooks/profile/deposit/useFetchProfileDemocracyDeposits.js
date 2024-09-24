import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isAddress } from "@polkadot/util-crypto";
import { queryAddressDeposits as queryDemocracyAddressDeposits } from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";
import { setProfileDemocracyDeposits } from "next-common/store/reducers/profile/deposits/democracy";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export default function useFetchProfileDemocracyDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!isAddress(address) || !api.query?.democracy || !hasDemocracyModule) {
      dispatch(setProfileDemocracyDeposits([]));
      return;
    }

    queryDemocracyAddressDeposits(api, address).then((data) => {
      dispatch(setProfileDemocracyDeposits(data));
    });
  }, [api, address, dispatch, hasDemocracyModule]);
}
