import isEvmChain, { isEvmWalletDisabled } from "./isEvmChain";
import isMixedChain from "./isMixedChain";

export default function shouldEnableEvmWallets() {
  return (isEvmChain() || isMixedChain()) && !isEvmWalletDisabled();
}
