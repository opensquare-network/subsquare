import { useState } from "react";
import {
  GET_IDENTITIES,
  LIMIT,
} from "next-common/components/header/search/constant/index";
import useRefCallback from "next-common/hooks/useRefCallback";
import { useChain } from "next-common/context/chain";
import { getIdentitySearchClient } from "next-common/components/header/search/utils/index";

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
