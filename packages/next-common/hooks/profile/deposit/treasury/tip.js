import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useChainSettings } from "next-common/context/chain";
import { setProfileTipDeposits } from "next-common/store/reducers/profile/deposits/treasury";
import { queryAddressDeposits as queryAddressTipDeposits } from "next-common/hooks/account/deposit/useFetchMyTreasuryDeposits/useFetchMyTreasuryTipDeposits";
import { useContextApi } from "next-common/context/api";

export default function useFetchProfileTreasuryTipDeposits() {
  const address = useProfileAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryTips = !!treasury?.tips || !treasury?.tips?.archived;

  useEffect(() => {
    if (!hasTreasuryTips) {
      dispatch(setProfileTipDeposits([]));
      return;
    }

    if (!api || !address || !api.query?.tips) {
      return;
    }

    queryAddressTipDeposits(api, address).then((data) => {
      dispatch(setProfileTipDeposits(data));
    });
  }, [api, address, dispatch, hasTreasuryTips]);
}
