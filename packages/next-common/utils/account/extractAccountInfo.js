import calcTransferable from "./transferable";

export function extractAccountInfo(accountData, existentialDeposit) {
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
      transferrable: calcTransferable(
        accountData.account.data,
        existentialDeposit,
      ),
      lockedBalance: lockedBalance?.toBigInt().toString(),
      bonded: stakingLedger?.active?.toBigInt().toString(),
    },
    detail: accountData.account?.toJSON(),
  };
}
