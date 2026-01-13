import { useMemo, useState } from "react";
import { useChain } from "next-common/context/chain";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isPolkadotChain, isKusamaChain } from "next-common/utils/chain";

function useIdentityApi(address = "") {
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
  const identityApi = useIdentityApi(address);
  const [isLoading, setIsLoading] = useState(true);

  const { value } = useAsync(async () => {
    setIsLoading(true);
    if (!identityApi) {
      return {};
    }

    try {
      const resp = await backendApi.fetch(identityApi);
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
  }, [identityApi]);

  return {
    data: value,
    isLoading,
  };
}
