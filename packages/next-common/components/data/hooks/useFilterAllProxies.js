import { useState, useMemo } from "react";
import useMyRelatedSwitch from "./useMyRelatedSwitch";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useAllProxiesSearch from "./useAllProxiesSearch";
import useSearchByAddressIdentity from "./useSearchByAddressIdentity";

export default function useFilterAllProxies(proxies = [], initialLoading) {
  const { isOn: isMyRelated } = useMyRelatedSwitch();
  const [isLoading, setIsLoading] = useState(true);
  const address = useRealAddress();

  const { search = "" } = useAllProxiesSearch();
  const searchedProxies = useSearchByAddressIdentity(search, proxies);

  const filteredProxies = useMemo(() => {
    setIsLoading(true);

    if (initialLoading) {
      return;
    }

    let filteredProxies = searchedProxies;

    if (isMyRelated) {
      filteredProxies = searchedProxies.filter(({ delegator, items }) => {
        return (
          delegator === address ||
          items.some(({ delegatee }) => delegatee === address)
        );
      });
    }

    setTimeout(() => {
      setIsLoading(false);
    });

    return filteredProxies;
  }, [initialLoading, searchedProxies, isMyRelated]);

  return { filteredProxies, total: filteredProxies?.length, isLoading };
}
