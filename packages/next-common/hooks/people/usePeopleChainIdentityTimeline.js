import { queryPeopleIdentityTimeline } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";
import { sortIdentityTimeline } from "next-common/components/profile/identityTimeline";

export default function usePeopleChainIdentityTimeline(account) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await queryPeopleIdentityTimeline(account);
      const sortedTimeline = sortIdentityTimeline(result?.data);
      setData(sortedTimeline);
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
