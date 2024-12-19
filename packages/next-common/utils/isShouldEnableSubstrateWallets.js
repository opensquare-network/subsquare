import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "./isEvmChain";
import isMixedChain from "./isMixedChain";

export default function isShouldEnableSubstrateWallets() {
  return (
    (!isMixedChain() && !isEvmChain()) ||
    isMixedChain() ||
    (isEvmChain() && isSupportSubstrateThroughEthereumAddress())
  );
}
