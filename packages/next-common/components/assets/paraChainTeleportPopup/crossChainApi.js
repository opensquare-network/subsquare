import { useContextApi } from "next-common/context/api";
import { useRelayChainApi } from "next-common/context/relayChainApi";
import teleportFromRelayChainToAssetHub, {
  getParaChainId,
} from "./teleportFromRelayChainToAssetHub";
import teleportFromAssetHubToRelayChain from "./teleportFromAssetHubToRelayChain";
import { useCallback } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";
import {
  isAssetHubChain,
  isWestendChain,
  isPolkadotChain,
  isKusamaChain,
} from "next-common/utils/chain";

const isRelayChain = (chain) =>
  isPolkadotChain(chain) || isWestendChain(chain) || isKusamaChain(chain);

export function useChainApi(chain) {
  const currChain = useChain();
  const api = useContextApi();
  const relayChainApi = useRelayChainApi();
  const assetHubApi = useAssetHubApi();

  if (currChain === chain) {
    return api;
  } else if (isRelayChain(chain)) {
    return relayChainApi;
  } else if (isAssetHubChain(chain)) {
    return assetHubApi;
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
        return teleportFromRelayChainToAssetHub({
          sourceApi,
          transferToAddress,
          amount,
          paraChainId,
        });
      } else if (isRelayChain(destinationChain)) {
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
