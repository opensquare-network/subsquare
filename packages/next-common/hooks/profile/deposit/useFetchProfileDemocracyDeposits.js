import useProfileAddress from "next-common/components/profile/useProfileAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { isAddress } from "@polkadot/util-crypto";
import { queryAddressDeposits as queryDemocracyAddressDeposits } from "next-common/hooks/account/deposit/useFetchMyDemocracyDeposits";
import { setProfileDemocracyDeposits } from "next-common/store/reducers/profile/deposits/democracy";
import { useChainSettings } from "next-common/context/chain";

export default function useFetchProfileDemocracyDeposits() {
  const address = useProfileAddress();
  const api = useApi();
  const dispatch = useDispatch();
  const { noDemocracyModule } = useChainSettings();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!isAddress(address) || !api.query?.democracy || noDemocracyModule) {
      dispatch(setProfileDemocracyDeposits([]));
      return;
    }

    queryDemocracyAddressDeposits(api, address).then((data) => {
      dispatch(setProfileDemocracyDeposits(data));
    });
  }, [api, address, dispatch]);
}
