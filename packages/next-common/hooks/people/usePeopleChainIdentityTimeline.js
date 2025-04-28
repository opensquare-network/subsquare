import { queryPeopleIdentityTimeline } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";

export default function usePeopleChainIdentityTimeline(account) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await queryPeopleIdentityTimeline(account);

      setData(result?.data);
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    data,
  };
}
