import { useLazyQuery } from "@apollo/client";
import { useState, useCallback } from "react";
import { useChainSettings } from "next-common/context/chain";
import {
  GET_IDENTITIES,
  LIMIT,
} from "next-common/components/header/search/constant/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { useChain } from "next-common/context/chain";
import { getIdentitySearchClient } from "next-common/components/header/search/utils/index";

export const useIdentityLazyQuery = createModuleLazyQuery("identity");

function createModuleLazyQuery(module) {
  return function useModuleLazyQuery(query, options) {
    const [data, setData] = useState(null);
    const { modules = {} } = useChainSettings();
    const [fn, lazyQueryResult] = useLazyQuery(query, {
      ...options,
      onCompleted(d) {
        setData(d);
        options?.onCompleted?.(d);
      },
    });
    const mod = modules?.[module];

    const fetcher = useCallback(
      async (fetchOptions) => {
        if (mod) {
          return fn(fetchOptions);
        }
      },
      [fn, mod],
    );

    lazyQueryResult.data = data;

    return [fetcher, lazyQueryResult];
  };
}

export function useLazySearchIdentities(searchValue) {
  return useIdentityLazyQuery(GET_IDENTITIES, {
    variables: {
      limit: LIMIT,
      offset: 0,
      search: searchValue,
      isNoFetchOnSearchEmpty: true,
    },
  });
}

export default function useSearchIdentities() {
  const [isIdentitiesLoading, setIsIdentitiesLoading] = useState(false);
  const chain = useChain();
  const identityClient = getIdentitySearchClient(chain);

  const fetchIdentities = useRefCallback(async (searchValue) => {
    try {
      setIsIdentitiesLoading(true);
      const { data } =
        (await identityClient?.query?.({
          query: GET_IDENTITIES,
          variables: {
            limit: LIMIT,
            offset: 0,
            search: searchValue,
          },
        })) ?? {};
      return data;
    } finally {
      setIsIdentitiesLoading(false);
    }
  });

  return [fetchIdentities, isIdentitiesLoading];
}
