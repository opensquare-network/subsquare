import { useContextApi } from "next-common/context/api";
import { useChain } from "next-common/context/chain";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";

// Resolves the api for the two chains involved in the Asset Hub <-> Hydration
// cross-chain transfer: the current chain and Asset Hub.
export function useChainApi(chain) {
  const currChain = useChain();
  const currChainApi = useContextApi();
  const assetHubChain = useAssetHubChain();
  const assetHubApi = useAssetHubApi();

  if (chain === currChain) {
    return currChainApi;
  } else if (chain === assetHubChain) {
    return assetHubApi;
  }

  throw new Error("Unsupported chain");
}
