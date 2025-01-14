import { useChainSettings } from "next-common/context/chain";
import {
  polkadotJs,
  subWallet,
  talisman,
  polkagate,
  polkagateSnap,
  nova,
  mimir,
  signet,
} from "next-common/utils/consts/connect";
import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "next-common/utils/isEvmChain";

export function useSubstrateWallets() {
  const chainSettings = useChainSettings();
  const isSubstrateThroughEvm =
    isEvmChain() && isSupportSubstrateThroughEthereumAddress();

  let singleSigWallets = [
    polkadotJs,
    !isSubstrateThroughEvm && subWallet,
    talisman,
    !isSubstrateThroughEvm && polkagate,
    !isSubstrateThroughEvm && polkagateSnap,
    !isSubstrateThroughEvm && nova,
  ].filter(Boolean);
  let multiSigWallets = [];

  if (isEvmChain()) {
    multiSigWallets = [];
  } else {
    multiSigWallets = [
      chainSettings?.multisigWallets?.signet && signet,
      chainSettings?.multisigWallets?.mimir && mimir,
    ].filter(Boolean);
  }

  const allWallets = [...singleSigWallets, ...multiSigWallets];

  return {
    singleSigWallets,
    multiSigWallets,
    allWallets,
  };
}
