import { useContextApi } from "next-common/context/api";
import { useRelayChainApi } from "next-common/context/polkadotApi";
import Chains from "next-common/utils/consts/chains";
import teleportFromRelayChainToAssetHub from "./teleportFromRelayChainToAssetHub";
import teleportFromAssetHubToRelayChain from "./teleportFromAssetHubToRelayChain";
import { useCallback } from "react";
import { useAssetHubApi } from "next-common/context/assetHub";
import { useChain } from "next-common/context/chain";
import {
  isAssetHubChain,
  isWestendChain,
  isPolkadotChain,
} from "next-common/utils/chain";

export function useChainApi(chain) {
  const currChain = useChain();
  const api = useContextApi();
  const relayChainApi = useRelayChainApi();
  const assetHubApi = useAssetHubApi();

  if (currChain !== chain) {
    if (isPolkadotChain(chain) || isWestendChain(chain)) {
      return relayChainApi;
    } else if (isAssetHubChain(chain)) {
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

      if (
        sourceChain === Chains.polkadot &&
        destinationChain === Chains.polkadotAssetHub
      ) {
        return teleportFromRelayChainToAssetHub({
          sourceApi,
          transferToAddress,
          amount,
        });
      } else if (
        sourceChain === Chains.polkadotAssetHub &&
        destinationChain === Chains.polkadot
      ) {
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
