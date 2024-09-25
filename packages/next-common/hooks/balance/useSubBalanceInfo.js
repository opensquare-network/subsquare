import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { useMemo } from "react";
import useSubStorage from "../common/useSubStorage";
import calcTransferable from "next-common/utils/account/transferable";
import { useChainSettings } from "next-common/context/chain";

export function useSubBalanceInfo(address) {
  const { decimals, symbol, name } = useChainSettings();
  const existentialDeposit = useQueryExistentialDeposit();

  const { result } = useSubStorage("system", "account", [address]);
  const accountInfo = result?.data?.toJSON();

  return useMemo(() => {
    if (!accountInfo) {
      return null;
    }

    const { free, reserved } = accountInfo;
    const balance = (free + reserved).toString();
    const transferrable = calcTransferable(accountInfo, existentialDeposit);

    return {
      balance,
      transferrable,
      decimals,
      symbol,
      name,
    };
  }, [accountInfo, decimals, existentialDeposit, name, symbol]);
}
