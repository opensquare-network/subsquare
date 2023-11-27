import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useApi from "next-common/utils/hooks/useApi";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import BigNumber from "bignumber.js";
import { setTipDeposits } from "next-common/store/reducers/myOnChainData/deposits/myTreasuryDeposits";
import { useMenuHasTreasuryTips } from "next-common/context/chain";

async function queryAddressDeposits(api, address) {
  const entries = await api.query.tips.tips.entries();
  return entries.reduce((result, [storageKey, optionalStorage]) => {
    if (!optionalStorage.isSome) {
      return result;
    }

    const hash = storageKey.args[0].toString();
    const storage = optionalStorage.unwrap();
    const finder = storage.finder.toString();
    const deposit = storage.deposit.toString();
    if (new BigNumber(deposit).lte(0) || finder !== address) {
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
  const api = useApi();
  const dispatch = useDispatch();
  const hasTreasuryTips = useMenuHasTreasuryTips();

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
