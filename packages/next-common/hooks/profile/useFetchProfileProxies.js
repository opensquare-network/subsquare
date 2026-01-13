import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { queryProxies } from "next-common/services/gql/proxy";
import { useCallback, useState, useEffect } from "react";

export default function useFetchProfileProxies({
  delegator,
  delegatee,
  // isActive = true,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await queryProxies({ delegator, delegatee });
      const items = (result || []).map((item) => {
        item["type"] = item?.proxyType;
        return item;
      });

      setData({
        items,
        total: items?.length || 0,
      });
    } catch (e) {
      console.error(e);
      setData({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [delegator, delegatee]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    data,
  };
}

export function useFetchMyProfileProxies() {
  const profileAddress = useProfileAddress();
  const { data, isLoading } = useFetchProfileProxies({
    delegator: profileAddress,
  });

  return {
    isLoading,
    data,
  };
}

export function useFetchReceivedProfileProxies() {
  const profileAddress = useProfileAddress();
  const { data, isLoading } = useFetchProfileProxies({
    delegatee: profileAddress,
  });

  return {
    isLoading,
    data,
  };
}
