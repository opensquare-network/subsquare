import { useChain } from "next-common/context/chain";
import getEndpointFromLocalStorage from "next-common/services/chain/apis/endpointLocalStorage";
import getChainSettings from "next-common/utils/consts/settings";
import { useMemo } from "react";

export default function useCandidateNodes() {
  const chain = useChain();
  const savedEndpoint = getEndpointFromLocalStorage(chain);
  const settings = getChainSettings(chain);
  const chainNodes = settings.endpoints.map((item) => item.url);

  return useMemo(() => {
    const first3Nodes = chainNodes.slice(0, 3);
    const candidates = new Set(first3Nodes);
    if (savedEndpoint) {
      candidates.add(savedEndpoint);
    }

    return [...candidates];
  }, [savedEndpoint, chainNodes]);
}
