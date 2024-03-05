import { useChain } from "next-common/context/chain";
import getEndpointFromLocalStorage from "next-common/services/chain/apis/endpointLocalStorage";
import { useMemo } from "react";
import { getEnvEndpoints } from "next-common/store/reducers/nodeSlice";
import getChainSettings from "next-common/utils/consts/settings";

export default function useCandidateNodes() {
  const chain = useChain();
  const nodes = getEnvEndpoints() || getChainSettings(chain).endpoints;
  const savedEndpoint = getEndpointFromLocalStorage(chain);

  return useMemo(() => {
    const chainNodes = nodes.map((item) => item.url);
    const first3Nodes = chainNodes.slice(0, 3);
    const candidates = new Set(first3Nodes);
    if (savedEndpoint && chainNodes.includes(savedEndpoint)) {
      candidates.add(savedEndpoint);
    }

    return [...candidates];
  }, [savedEndpoint, nodes]);
}
