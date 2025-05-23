import { BN } from "@polkadot/util";
import { useChainSettings } from "next-common/context/chain";

export default function usePreimageDeposit() {
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

export function getPreimageDeposit(preimage, length = 1) {
  return preimage.baseDeposit.add(preimage.byteDeposit?.mul(new BN(length)));
}
