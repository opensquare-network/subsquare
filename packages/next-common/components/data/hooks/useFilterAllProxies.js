import { useState, useMemo } from "react";
import useMyRelatedSwitch from "./useMyRelatedSwitch";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function useFilterAllProxies(proxies = [], initialLoading) {
  const { isOn: isMyRelated } = useMyRelatedSwitch();
  const [isLoading, setIsLoading] = useState(false);
  const address = useRealAddress();

  const filteredProxies = useMemo(() => {
    setIsLoading(true);

    if (initialLoading || !proxies.length || !address) {
      return;
    }

    let filteredProxies = proxies;

    if (isMyRelated) {
      filteredProxies = proxies.filter(({ delegator, items }) => {
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
  }, [initialLoading, proxies, isMyRelated, address]);

  return { filteredProxies, total: filteredProxies?.length, isLoading };
}
