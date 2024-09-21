import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useChainSettings } from "next-common/context/chain";
import {
  setProfileBountyBonds,
  setProfileBountyCuratorDeposits,
} from "next-common/store/reducers/profile/deposits/treasury";
import { queryAddressDeposits as queryAddressBountyDeposits } from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits/useFetchMyTreasuryBountyDeposits";
import { useContextApi } from "next-common/context/api";

export default function useFetchProfileTreasuryBountyDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryBounties = !!treasury?.bounties;

  useEffect(() => {
    if (!hasTreasuryBounties) {
      dispatch(setProfileBountyBonds([]));
      dispatch(setProfileBountyCuratorDeposits([]));
      return;
    }

    if (!api || !address || !api.query?.bounties) {
      return;
    }

    queryAddressBountyDeposits(api, address).then((data) => {
      const { bonds, curatorDeposits } = data;
      dispatch(setProfileBountyBonds(bonds));
      dispatch(setProfileBountyCuratorDeposits(curatorDeposits));
    });
  }, [api, address, dispatch, hasTreasuryBounties]);
}
