import {
  isCollectivesChain,
  isKusamaChain,
  isPolkadotChain,
  isWestendChain,
  isPaseoChain,
} from "next-common/utils/chain";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useChain } from "../chain";
import getChainSettings from "next-common/utils/consts/settings";
import { getChainApi } from "next-common/utils/getChainApi";
import Chains from "next-common/utils/consts/chains";

const PeopleApiContext = createContext(null);

export default function PeopleApiProvider({ children }) {
  const [api, setApi] = useState(null);
  const chain = useChain();
  const peopleChain = useMemo(() => getPeopleChain(chain), [chain]);

  useEffect(() => {
    if (peopleChain) {
      const endpointUrls = getChainSettings(peopleChain)?.endpoints?.map(
        (item) => item.url,
      );
      if (endpointUrls?.length > 0) {
        getChainApi(endpointUrls).then(setApi);
      }
    }
  }, [peopleChain]);

  useEffect(() => {
    return () => {
      if (api) {
        api.disconnect?.();
      }
    };
  }, [api]);

  return (
    <PeopleApiContext.Provider value={{ api }}>
      {children}
    </PeopleApiContext.Provider>
  );
}

export function usePeopleApi() {
  const { api } = useContext(PeopleApiContext) || {};
  return api;
}

function getPeopleChain(chain) {
  if (isPolkadotChain(chain) || isCollectivesChain(chain)) {
    return Chains.polkadotPeople;
  }

  if (isKusamaChain(chain)) {
    return Chains.kusamaPeople;
  }

  if (isWestendChain(chain)) {
    return Chains.westendPeople;
  }

  if (isPaseoChain(chain)) {
    return Chains.paseoPeople;
  }

  return null;
}
