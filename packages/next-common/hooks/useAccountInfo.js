import { useMemo } from "react";
import useOnChainAccountData from "./useOnChainAccountData";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import calcTransferable from "next-common/utils/account/transferable";

function extractAccountInfo(accountData, existentialDeposit) {
  if (!accountData) {
    return null;
  }

  const { data: { free, reserved } = {} } = accountData.account || {};
  const { lockedBalance } = accountData.balanceAll || {};
  const { stakingLedger } = accountData.stakingInfo || {};

  return {
    data: {
      free: free?.toBigInt().toString(),
      reserved: reserved?.toBigInt().toString(),
      total: (free?.toBigInt() + reserved?.toBigInt()).toString(),
      transferrable: calcTransferable(accountData.account.data, existentialDeposit),
      lockedBalance: lockedBalance?.toBigInt().toString(),
      bonded: stakingLedger?.active?.toBigInt().toString(),
    },
    detail: accountData.account?.toJSON(),
  };
}

export default function useAccountInfo(address) {
  const accountData = useOnChainAccountData(address);
  const existentialDeposit = useSelector(existentialDepositSelector);
  return useMemo(() => {
    if (!accountData) {
      return null;
    }
    return extractAccountInfo(accountData, existentialDeposit);
  }, [accountData]);
}
