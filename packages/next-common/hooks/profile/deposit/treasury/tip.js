import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  useChainSettings,
  useMenuHasTreasuryTips,
} from "next-common/context/chain";
import { setProfileTipDeposits } from "next-common/store/reducers/profile/deposits/treasury";
import { queryAddressDeposits as queryAddressTipDeposits } from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits/useFetchMyTreasuryTipDeposits";
import { useContextApi } from "next-common/context/api";
import useProfileAddress from "next-common/components/profile/useProfileAddress";

export default function useFetchProfileTreasuryTipDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const hasTreasuryTips = useMenuHasTreasuryTips();
  const { hasTipsModule } = useChainSettings();

  const prevAddress = useRef(address);
  const prevApi = useRef(api);

  useEffect(() => {
    if (prevAddress.current === address && prevApi.current === api) {
      return;
    }

    prevAddress.current = address;
    prevApi.current = api;

    if (!hasTreasuryTips || !hasTipsModule) {
      dispatch(setProfileTipDeposits([]));
      return;
    }

    if (!api || !address || !api.query?.tips) {
      return;
    }

    queryAddressTipDeposits(api, address).then((data) => {
      dispatch(setProfileTipDeposits(data));
    });
  }, [api, address, dispatch, hasTreasuryTips, hasTipsModule]);
}
