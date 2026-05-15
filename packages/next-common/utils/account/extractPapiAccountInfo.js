import BigNumber from "bignumber.js";
import calcTransferable from "./transferable";

export function extractPapiAccountInfo(accountData, existentialDeposit) {
  if (!accountData) {
    return null;
  }

  const { account, lockedBalance, stakingLedger } = accountData;
  const free = account?.data?.free;
  const reserved = account?.data?.reserved;
  const frozen = account?.data?.frozen;

  return {
    data: {
      free: free?.toString(),
      reserved: reserved?.toString(),
      total: ((free ?? 0n) + (reserved ?? 0n)).toString(),
      transferrable: calcTransferable(
        {
          free: free?.toString(),
          reserved: reserved?.toString(),
          frozen: frozen?.toString(),
        },
        existentialDeposit,
      ),
      lockedBalance: lockedBalance?.toString(),
      bonded: stakingLedger?.active?.toString(),
    },
  };
}

export function extractPapiKintsugiAccountInfo(
  accountData,
  existentialDeposit,
) {
  if (!accountData) {
    return null;
  }

  const { free, reserved, frozen } = accountData;

  return {
    data: {
      free: free?.toString(),
      reserved: reserved?.toString(),
      total: ((free ?? 0n) + (reserved ?? 0n)).toString(),
      transferrable: calcTransferable(
        {
          free: free?.toString(),
          reserved: reserved?.toString(),
          frozen: frozen?.toString(),
        },
        existentialDeposit,
      ),
      lockedBalance: BigNumber.max(
        reserved?.toString() ?? 0,
        frozen?.toString() ?? 0,
      ).toString(),
    },
  };
}
