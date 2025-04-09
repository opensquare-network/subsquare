import { useMemo, useState } from "react";
import { useChain } from "next-common/context/chain";
import useProfileAddress from "next-common/components/profile/useProfileAddress";
import nextApi from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";

function useIdentityApi() {
  const address = useProfileAddress();
  const chain = useChain();

  return useMemo(() => {
    if (
      !chain &&
      !address &&
      !isPolkadotChain(chain) &&
      !isKusamaChain(chain)
    ) {
      return null;
    }

    return `https://id2.statescan.io/${chain}/identity/${address}`;
  }, [chain, address]);
}

export default function useFetchIdentityInfo() {
  const identityApi = useIdentityApi();
  const [isLoading, setIsLoading] = useState(true);

  const { value } = useAsync(async () => {
    setIsLoading(true);
    if (!identityApi) {
      return {};
    }

    try {
      const resp = await nextApi.fetch(identityApi);
      const { subs = [], info } = resp?.result || {};

      return {
        subs,
        info,
      };
    } catch (error) {
      return {};
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    data: value,
    isLoading,
  };
}
