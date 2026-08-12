import { useCallback } from "react";
import { useContextApi } from "next-common/context/api";
import { useChain } from "next-common/context/chain";
import { useAssetHubApi } from "next-common/hooks/chain/useAssetHubApi";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import buildHydrationCrossChainTx from "./teleportFromHydration";

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

export function useGetHydrationCrossChainTx({
  sourceApi,
  sourceChain,
  destinationChain,
}) {
  return useCallback(
    (transferToAddress, amount, symbol) => {
      if (!sourceApi) {
        throw new Error("Chain network is not connected yet");
      }

      return buildHydrationCrossChainTx({
        sourceApi,
        sourceChain,
        destinationChain,
        transferToAddress,
        amount,
        symbol,
      });
    },
    [sourceApi, sourceChain, destinationChain],
  );
}
