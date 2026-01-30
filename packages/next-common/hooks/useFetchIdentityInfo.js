import { useMemo, useState } from "react";
import { useChain } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";

function useIdentityApiUrl(address = "") {
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

export default function useFetchIdentityInfo(address = "") {
  const identityApiUrl = useIdentityApiUrl(address);
  const [isLoading, setIsLoading] = useState(true);

  const { value } = useAsync(async () => {
    setIsLoading(true);
    if (!identityApiUrl) {
      return {};
    }

    try {
      const resp = await backendApi.fetch(identityApiUrl);
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
  }, [identityApiUrl]);

  return {
    data: value,
    isLoading,
  };
}
