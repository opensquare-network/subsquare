import { useContextApi } from "next-common/context/api";
import { useRelayChainApi } from "next-common/context/relayChain";
import teleportFromRelayChainToParaChain, {
  getParaChainId,
} from "./teleportFromRelayChainToParaChain";
import teleportFromParaChainToRelayChain from "./teleportFromParaChainToRelayChain";
import { useCallback } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";
import { isRelayChain } from "next-common/utils/chain";
import { useRelayChain } from "next-common/hooks/useRelayChain";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import Chains from "next-common/utils/consts/chains";
import { useCollectivesApi } from "next-common/context/collectives/api";

export function useChainApi(chain) {
  const currChain = useChain();
  const currChainApi = useContextApi();

  const replyChain = useRelayChain();
  const relayChainApi = useRelayChainApi();

  const assetHubChain = useAssetHubChain();
  const assetHubApi = useAssetHubApi();

  const collectivesApi = useCollectivesApi();

  if (chain === currChain) {
    return currChainApi;
  } else if (chain === replyChain) {
    return relayChainApi;
  } else if (chain === assetHubChain) {
    return assetHubApi;
  } else if (chain === Chains.collectives) {
    return collectivesApi;
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

      if (isRelayChain(sourceChain)) {
        const paraChainId = getParaChainId(destinationChain);
        return teleportFromRelayChainToParaChain({
          sourceApi,
          transferToAddress,
          amount,
          paraChainId,
        });
      } else if (isRelayChain(destinationChain)) {
        return teleportFromParaChainToRelayChain({
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
