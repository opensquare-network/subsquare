import {
  isCollectivesChain,
  isKusamaChain,
  isPolkadotChain,
} from "next-common/utils/chain";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useChain } from "../chain";
import getChainSettings from "next-common/utils/consts/settings";
import { getChainApi } from "next-common/utils/getChainApi";
import Chains from "next-common/utils/consts/chains";

const CoretimeApiContext = createContext(null);

export default function CoretimeApiProvider({ children }) {
  const [api, setApi] = useState(null);
  const chain = useChain();
  const coretimeChain = useMemo(() => getCoretimeChain(chain), [chain]);

  useEffect(() => {
    if (coretimeChain) {
      const endpointUrls = getChainSettings(coretimeChain)?.endpoints?.map(
        (item) => item.url,
      );
      if (endpointUrls?.length > 0) {
        getChainApi(endpointUrls).then(setApi);
      }
    }
  }, [coretimeChain]);

  useEffect(() => {
    return () => {
      if (api) {
        api.disconnect?.();
      }
    };
  }, [api]);

  return (
    <CoretimeApiContext.Provider value={{ api }}>
      {children}
    </CoretimeApiContext.Provider>
  );
}

export function useCoretimeApi() {
  const { api } = useContext(CoretimeApiContext) || {};
  return api;
}

function getCoretimeChain(chain) {
  if (isPolkadotChain(chain) || isCollectivesChain(chain)) {
    return Chains.polkadotCoretime;
  }

  if (isKusamaChain(chain)) {
    return Chains.kusamaCoretime;
  }

  return null;
}
