import { useMemo } from "react";
import useOnChainAccountData from "./useOnChainAccountData";
import { existentialDepositSelector } from "next-common/store/reducers/chainSlice";
import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";

function calcTransferable(info, existentialDeposit) {
  const { free, frozen, reserved } = info;
  const frozenReserveDif = BigNumber(frozen).minus(reserved);
  return BigNumber(free || 0).minus(BigNumber.max(frozenReserveDif, existentialDeposit)).toString();
}

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
