import useProfileAddress from "next-common/components/profile/useProfileAddress";
import { queryProxies } from "next-common/services/gql/proxy";
import { useCallback, useState, useEffect } from "react";
import { defaultPageSize } from "next-common/utils/constants";

// Fetch all proxies by front-end for a given address without pagination.
export default function useFetchProfileProxies({
  delegator,
  delegatee,
  pageSize = defaultPageSize,
  isActive = true,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({ items: [], total: 0 });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let allItems = [];
    let currentPage = 1;
    let total = 0;

    try {
      while (allItems.length < total || currentPage === 1) {
        const result = await queryProxies(
          { isActive, delegator, delegatee },
          currentPage,
          pageSize,
        );

        const pageData = result?.data;

        if (!pageData) {
          break;
        }

        total = pageData.total || 0;
        const items = pageData.items || [];
        allItems = [...allItems, ...items];

        if (items.length < pageSize || allItems.length >= total) {
          break;
        }

        currentPage += 1;
      }

      setData({
        items: allItems,
        total,
      });
    } catch (e) {
      console.error(e);
      setData({ items: allItems, total });
    } finally {
      setIsLoading(false);
    }
  }, [isActive, delegator, delegatee, pageSize]);

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
    pageSize: 100,
  });

  return {
    isLoading,
    data,
  };
}
