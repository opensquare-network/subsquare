import { useMemo } from "react";

function extractAccountInfo(accountData) {
  if (!accountData) {
    return null;
  }

  const { data: { free, reserved } = {} } = accountData.account || {};
  const { lockedBalance, availableBalance } = accountData.balanceAll || {};
  const { stakingLedger } = accountData.stakingInfo || {};

  return {
    data: {
      free: free?.toBigInt().toString(),
      reserved: reserved?.toBigInt().toString(),
      total: (free?.toBigInt() + reserved?.toBigInt()).toString(),
      transferrable: availableBalance?.toBigInt().toString(),
      lockedBalance: lockedBalance?.toBigInt().toString(),
      bonded: stakingLedger?.active?.toBigInt().toString(),
    },
    detail: accountData.account?.toJSON(),
  };
}

export default function useAccountInfo(accountData) {
  return useMemo(() => {
    if (!accountData) {
      return null;
    }
    return extractAccountInfo(accountData);
  }, [accountData]);
}
