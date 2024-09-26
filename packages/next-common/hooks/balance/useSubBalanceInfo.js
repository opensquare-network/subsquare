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
    const info = {
      balance: 0,
      transferrable: 0,
      decimals,
      symbol,
      name,
    };

    if (!accountInfo) {
      return info;
    }

    const { free, reserved } = accountInfo;
    const balance = (free + reserved).toString();
    const transferrable = calcTransferable(accountInfo, existentialDeposit);

    info.balance = balance;
    info.transferrable = transferrable;

    return info;
  }, [accountInfo, decimals, existentialDeposit, name, symbol]);
}
