import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDemocracyDeposits } from "next-common/store/reducers/myOnChainData/deposits/myDemocracyDeposits";
import { useChainSettings } from "next-common/context/chain";
import { useContextApi } from "next-common/context/api";

export async function queryAddressDeposits(api, address) {
  const entries = await api.query.democracy.depositOf.entries();
  return entries.reduce((result, [storageKey, optionalStorage]) => {
    const proposalIndex = storageKey.args[0].toNumber();
    if (!optionalStorage.isSome) {
      return result;
    }

    const storage = optionalStorage.unwrap();
    const rawDepositors = storage[0];
    const depositors = rawDepositors.map((i) => i.toString());
    const eachDepositValue = storage[1].toString();
    const depositCount = depositors.filter(
      (depositor) => depositor === address,
    ).length;

    if (depositCount > 0) {
      return [
        ...result,
        {
          proposalIndex,
          depositCount,
          eachDepositValue,
        },
      ];
    } else {
      return result;
    }
  }, []);
}

export default function useFetchMyDemocracyDeposits() {
  const realAddress = useRealAddress();
  const api = useContextApi();
  const dispatch = useDispatch();
  const {
    modules: { democracy },
  } = useChainSettings();
  const hasDemocracyModule = democracy && !democracy?.archived;

  useEffect(() => {
    if (!api || !realAddress || !api.query?.democracy || !hasDemocracyModule) {
      return;
    }

    queryAddressDeposits(api, realAddress).then((data) => {
      dispatch(setDemocracyDeposits(data));
    });
  }, [api, realAddress, dispatch, hasDemocracyModule]);
}
