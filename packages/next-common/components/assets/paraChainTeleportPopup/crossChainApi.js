import { useContextApi } from "next-common/context/api";
import { usePolkadotApi } from "next-common/context/polkadotApi";
import Chains from "next-common/utils/consts/chains";
import teleportFromRelayChainToAssetHub, {
  getParaChainId,
} from "./teleportFromRelayChainToAssetHub";
import teleportFromAssetHubToRelayChain from "./teleportFromAssetHubToRelayChain";
import { useCallback } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";

export function useChainApi(chain) {
  const currChain = useChain();
  const api = useContextApi();
  const polkadotApi = usePolkadotApi();
  const assetHubApi = useAssetHubApi();

  if (currChain !== chain) {
    if (chain === Chains.polkadot) {
      return polkadotApi;
    } else if (chain === Chains.polkadotAssetHub) {
      return assetHubApi;
    }
  } else {
    return api;
  }

  throw new Error("Unsupported chain");
}

export function useGetTeleportTxFunc({
  sourceApi,
  sourceChain,
  destinationChain,
}) {
  return useCallback(
    (transferToAddress, amount) => {
      if (!sourceApi) {
        throw new Error("Chain network is not connected yet");
      }

      if (sourceChain === Chains.polkadot) {
        const paraChainId = getParaChainId(destinationChain);
        return teleportFromRelayChainToAssetHub({
          sourceApi,
          transferToAddress,
          amount,
          paraChainId,
        });
      } else if (destinationChain === Chains.polkadot) {
        return teleportFromAssetHubToRelayChain({
          sourceApi,
          transferToAddress,
          amount,
        });
      }

      throw new Error("Unsupported teleport direction");
    },
    [sourceApi, sourceChain, destinationChain],
  );
}
