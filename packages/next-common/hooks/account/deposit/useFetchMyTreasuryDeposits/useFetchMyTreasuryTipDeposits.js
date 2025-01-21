import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { setTipDeposits } from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";
import { isSameAddress } from "next-common/utils";

export async function queryAddressDeposits(api, address) {
  const entries = await api.query.tips.tips.entries();
  return entries.reduce((result, [storageKey, optionalStorage]) => {
    if (!optionalStorage.isSome) {
      return result;
    }

    const hash = storageKey.args[0].toString();
    const storage = optionalStorage.unwrap();
    const finder = storage.finder.toString();
    const deposit = storage.deposit.toString();
    if (new BigNumber(deposit).lte(0) || !isSameAddress(finder, address)) {
      return result;
    }

    return [
      ...result,
      {
        hash,
        deposit,
      },
    ];
  }, []);
}

export default function useFetchMyTreasuryTipDeposits() {
  const realAddress = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { treasury },
  } = useChainSettings();
  const hasTreasuryTips = !!treasury?.tips && !treasury?.tips?.archived;

  useEffect(() => {
    if (!hasTreasuryTips) {
      dispatch(setTipDeposits([]));
      return;
    }

    if (!api || !realAddress || !api.query?.tips) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      dispatch(setTipDeposits(data));
    });
  }, [api, realAddress, dispatch, hasTreasuryTips]);
}
