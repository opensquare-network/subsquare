import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import { useMemo } from "react";
import useSubStorage from "../common/useSubStorage";
import calcTransferable from "next-common/utils/account/transferable";

export function useSubAsset(address) {
  const existentialDeposit = useQueryExistentialDeposit();

  const { result: accountInfo } = useSubStorage("system", "account", [address]);

  return useMemo(() => {
    if (!accountInfo) {
      return null;
    }

    const { free, reserved } = accountInfo;
    const balance = (free + reserved).toString();
    const transferrable = calcTransferable(accountInfo, existentialDeposit);

    return { balance, transferrable };
  }, [accountInfo, existentialDeposit]);
}
