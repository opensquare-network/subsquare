import { BN } from "@polkadot/util";
import { useChain, useChainSettings } from "next-common/context/chain";

export default function useChainPreimageDepositSettings() {
  const { preimage } = useChainSettings();
  if (preimage) {
    const { baseDeposit = 0, byteDeposit = 0 } = preimage;
    return {
      baseDeposit: new BN(baseDeposit),
      byteDeposit: new BN(byteDeposit),
    };
  }
  return preimage;
}

export function usePreimageDeposit(byteLen = 0) {
  const chain = useChain();
  const settings = useChainPreimageDepositSettings();
  if (!settings) {
    throw new Error(`No preimage deposit settings for ${chain}`);
  }

  if (BigInt(byteLen) <= 0) {
    return 0;
  }

  const { baseDeposit, byteDeposit } = settings;
  return (
    BigInt(baseDeposit) +
    BigInt(byteDeposit) * BigInt(byteLen)
  ).toString();
}
