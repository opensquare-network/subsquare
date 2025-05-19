import { queryPeopleIdentities } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";
import { defaultPageSize } from "next-common/utils/constants";

export default function usePeopleChainIdentityList({
  search = "",
  page = 1,
  pageSize = defaultPageSize,
} = {}) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    let total = 0;

    try {
      const result = await queryPeopleIdentities(search, page, pageSize);

      setData(result?.data);
    } catch (e) {
      console.error(e);
      setData({ identities: [], total });
    } finally {
      setIsLoading(false);
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    data,
  };
}
