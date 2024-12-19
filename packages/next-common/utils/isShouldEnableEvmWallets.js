import isEvmChain, { isDisabledEvmWallet } from "./isEvmChain";
import isMixedChain from "./isMixedChain";

export default function isShouldEnableEvmWallets() {
  return (isEvmChain() || isMixedChain()) && !isDisabledEvmWallet();
}
