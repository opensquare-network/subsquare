import { useChain } from "next-common/context/chain";
import getEndpointFromLocalStorage from "next-common/services/chain/apis/endpointLocalStorage";
import getChainSettings from "next-common/utils/consts/settings";
import { useEffect } from "react";
import newApi from "next-common/services/chain/apis/new";

export default function useConnectApis() {
  const chain = useChain();
  const savedEndpoint = getEndpointFromLocalStorage(chain);
  const settings = getChainSettings(chain);
  const chainNodes = settings.endpoints;

  useEffect(() => {
    const first3Nodes = chainNodes.slice(0, 3);
    const candidates = new Set(first3Nodes);
    if (savedEndpoint) {
      candidates.add(savedEndpoint);
    }

    for (const endpoint of candidates) {
      newApi(chain, endpoint.url);
    }
  }, [chain, savedEndpoint, chainNodes]);
}
