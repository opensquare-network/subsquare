import { useEffect, useState, useMemo } from "react";
import useMyRelatedSwitch from "../../common/useMyRelatedSwitch";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useSearchComponent from "../../common/useSearchComponent";
import useSearchByAddressIdentity from "./useSearchByAddressIdentity";
import { isSameAddress } from "next-common/utils";

export default function useFilterAllProxies(proxies = [], initialLoading) {
  const { isOn: isMyRelated } = useMyRelatedSwitch();
  const [isLoading, setIsLoading] = useState(true);
  const address = useRealAddress();

  const { search = "" } = useSearchComponent();
  const searchedProxies = useSearchByAddressIdentity(search, proxies);

  const filteredProxies = useMemo(() => {
    if (initialLoading) {
      return;
    }

    let filteredProxies = searchedProxies;

    if (isMyRelated && address) {
      filteredProxies = searchedProxies.filter(({ delegator, items }) => {
        return (
          isSameAddress(delegator, address) ||
          items.some(({ delegatee }) => isSameAddress(delegatee, address))
        );
      });
    }

    return filteredProxies;
  }, [initialLoading, searchedProxies, isMyRelated, address]);

  useEffect(() => {
    if (initialLoading) {
      return;
    }

    setIsLoading(false);
  }, [initialLoading, filteredProxies]);

  return { filteredProxies, total: filteredProxies?.length, isLoading };
}
