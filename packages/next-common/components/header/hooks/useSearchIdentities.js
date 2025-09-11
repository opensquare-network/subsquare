import { useState } from "react";
import {
  GET_IDENTITIES,
  LIMIT,
  OFFSET,
} from "next-common/components/header/search/constant";
import useRefCallback from "next-common/hooks/useRefCallback";
import { useChain } from "next-common/context/chain";
import { getIdentitySearchClient } from "next-common/components/header/search/utils/index";
import { isNil } from "lodash-es";

export default function useSearchIdentities() {
  const [isIdentitiesLoading, setIsIdentitiesLoading] = useState(false);
  const chain = useChain();

  const fetchIdentities = useRefCallback(async (searchValue) => {
    try {
      const identityClient = getIdentitySearchClient(chain);
      if (isNil(identityClient)) return null;

      setIsIdentitiesLoading(true);
      const { data } =
        (await identityClient?.query?.({
          query: GET_IDENTITIES,
          variables: {
            limit: LIMIT,
            offset: OFFSET,
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
