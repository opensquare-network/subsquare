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
import isEvmChain from "next-common/utils/isEvmChain";

export function useSubstrateWallets() {
  const chainSettings = useChainSettings();

  let singleSigWallets = [
    polkadotJs,
    subWallet,
    talisman,
    polkagate,
    polkagateSnap,
    nova,
  ];
  let multisigWallets = [];

  if (isEvmChain()) {
    multisigWallets = [];
  } else {
    multisigWallets = [
      chainSettings?.multisigWallets?.signet && signet,
      chainSettings?.multisigWallets?.mimir && mimir,
    ].filter(Boolean);
  }

  const allWallets = [...singleSigWallets, ...multisigWallets];

  return {
    singleSigWallets,
    multisigWallets,
    allWallets,
  };
}
