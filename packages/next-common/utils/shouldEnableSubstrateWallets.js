import isEvmChain, {
  isSupportSubstrateThroughEthereumAddress,
} from "./isEvmChain";

export default function shouldEnableSubstrateWallets() {
  return !isEvmChain() || isSupportSubstrateThroughEthereumAddress();
}
