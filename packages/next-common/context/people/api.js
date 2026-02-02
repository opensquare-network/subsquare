import { getRelayChain } from "next-common/utils/chain";
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

export function getPeopleChain(chain) {
  if (getRelayChain(chain) === Chains.polkadot) {
    return Chains.polkadotPeople;
  }

  if (getRelayChain(chain) === Chains.kusama) {
    return Chains.kusamaPeople;
  }

  if (getRelayChain(chain) === Chains.westend) {
    return Chains.westendPeople;
  }

  if (getRelayChain(chain) === Chains.paseo) {
    return Chains.paseoPeople;
  }

  return null;
}
