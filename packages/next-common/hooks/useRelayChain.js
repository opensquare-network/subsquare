import { useChain } from "next-common/context/chain";
import { getRelayChain } from "next-common/utils/chain";
import getChainSettings from "next-common/utils/consts/settings";
import { useMemo } from "react";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export function useRelayChain() {
  const chain = useChain();
  return getRelayChain(chain);
}

export function useRelayChainEndpoints() {
  const relayChain = useRelayChain();

  const endpointConfig = useMemo(() => {
    const relayChainSettings = getChainSettings(relayChain);
    if (isAssetHubMigrated()) {
      return relayChainSettings?.relayChainEndpoints;
    }
    return relayChainSettings?.endpoints;
  }, [relayChain]);

  return useMemo(
    () => endpointConfig?.map?.((item) => item.url),
    [endpointConfig],
  );
}
