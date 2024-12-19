import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "./isEvmChain";

export default function isShouldEnableSubstrateWallets() {
  return !isEvmChain() || isSupportSubstrateThroughEthereumAddress();
}
