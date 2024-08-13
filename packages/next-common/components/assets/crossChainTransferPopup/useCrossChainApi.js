import { useContextApi } from "next-common/context/api";
import { usePolkadotApi } from "next-common/context/polkadotApi";
import Chains from "next-common/utils/consts/chains";
import teleportFromRelayChainToAssetHub from "./teleportFromRelayChainToAssetHub";
import teleportFromAssetHubToRelayChain from "./teleportFromAssetHubToRelayChain";
import { useCallback } from "react";

function useChainApi(chain) {
  const api = useContextApi();
  const polkadotApi = usePolkadotApi();

  if (chain === Chains.polkadot) {
    return polkadotApi;
  } else if (chain === Chains.polkadotAssetHub) {
    return api;
  }

  throw new Error("Unsupported chain");
}

export default function useCrossChainApi({ sourceChain, destinationChain }) {
  const sourceApi = useChainApi(sourceChain);
  const destinationApi = useChainApi(destinationChain);

  const teleport = useCallback(
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

  return {
    sourceApi,
    destinationApi,
    teleport,
  };
}
