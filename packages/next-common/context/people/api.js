import { getPeopleChain } from "next-common/utils/chain";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useChain } from "../chain";
import getChainSettings from "next-common/utils/consts/settings";
import { getChainApi } from "next-common/utils/getChainApi";

const PeopleApiContext = createContext(null);

export function PeopleApiProvider({ children }) {
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

export const MemoizedPeopleApiContext = memo(PeopleApiProvider);

export function usePeopleApi() {
  const { api } = useContext(PeopleApiContext) || {};
  return api;
}
