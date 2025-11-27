import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isAddress } from "@polkadot/util-crypto";
import { useChain } from "next-common/context/chain";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import { useMemo } from "react";

export function useIsRelativesApiAvailable(address) {
  const chain = useChain();

  const isSupportedChain = useMemo(() => {
    return isKusamaChain(chain) || isPolkadotChain(chain);
  }, [chain]);

  const isValidAddress = useMemo(() => {
    return address !== "" && isAddress(address);
  }, [address]);

  return useMemo(() => {
    return isSupportedChain && isValidAddress;
  }, [isSupportedChain, isValidAddress]);
}

export default function useIsPureProxy(address) {
  const isRelativesApiAvailable = useIsRelativesApiAvailable(address);

  const { value: isPure, loading } = useAsync(async () => {
    if (!isRelativesApiAvailable) {
      return false;
    }

    try {
      const { result } = await backendApi.fetch(`/proxies/pure/${address}`);
      return !!result;
    } catch (error) {
      return false;
    }
  }, [address, isRelativesApiAvailable]);

  return { isPure: isPure ?? false, loading };
}
