import { queryPeopleIdentities } from "next-common/services/gql/identity";
import { useCallback, useState, useEffect } from "react";
import { defaultPageSize } from "next-common/utils/constants";
import { useContextApi } from "next-common/context/api";
import useCall from "next-common/utils/hooks/useCall";

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

export function useOnchainPeopleChainIdentityList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const api = useContextApi();
  const { value, loaded } = useCall(
    api?.query?.identity?.identityOf?.entries,
    [],
  );

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const results = (value || []).map(([storageKey, storageValue]) => {
      const address = storageKey?.args[0]?.toString();

      return {
        address,
        ...storageValue?.toJSON(),
      };
    });

    setData(results);
    setIsLoading(false);
  }, [loaded, value]);

  return {
    isLoading,
    data,
  };
}
