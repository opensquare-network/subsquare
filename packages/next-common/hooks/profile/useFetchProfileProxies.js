import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { queryProxies } from "next-common/services/gql/proxy";
import { useCallback, useState, useEffect } from "react";
import { defaultPageSize } from "next-common/utils/constants";

export default function useFetchProfileProxies({
  delegator,
  delegatee,
  page = 1,
  pageSize = defaultPageSize,
  isActive = true,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await queryProxies(
        { isActive, delegator, delegatee },
        page,
        pageSize,
      );
      setData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [isActive, delegator, delegatee, page, pageSize]);

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
    page: 1,
    pageSize: 100,
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
    page: 1,
    pageSize: 100,
  });

  return {
    isLoading,
    data,
  };
}
