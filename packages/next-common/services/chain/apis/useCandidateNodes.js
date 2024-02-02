import { useChain } from "next-common/context/chain";
import getEndpointFromLocalStorage from "next-common/services/chain/apis/endpointLocalStorage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { nodesSelector } from "next-common/store/reducers/nodeSlice";

export default function useCandidateNodes() {
  const chain = useChain();
  const nodes = useSelector(nodesSelector);
  const savedEndpoint = getEndpointFromLocalStorage(chain);
  const chainNodes = nodes.map((item) => item.url);

  return useMemo(() => {
    const first3Nodes = chainNodes.slice(0, 3);
    const candidates = new Set(first3Nodes);
    if (savedEndpoint && chainNodes.includes(savedEndpoint)) {
      candidates.add(savedEndpoint);
    }

    return [...candidates];
  }, [savedEndpoint, chainNodes]);
}
