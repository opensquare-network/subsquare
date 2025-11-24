import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isAddress } from "@polkadot/util-crypto";
import { useChain } from "next-common/context/chain";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";
import { useMemo } from "react";

export default function useIsPureProxy(address) {
  const chain = useChain();

  const isSupportedChain = useMemo(() => {
    return isKusamaChain(chain) || isPolkadotChain(chain);
  }, [chain]);

  const isValidAddress = useMemo(() => {
    return address !== "" && isAddress(address);
  }, [address]);

  const { value: isPure, loading } = useAsync(async () => {
    if (!isSupportedChain || !isValidAddress) {
      return false;
    }

    try {
      const { result } = await backendApi.fetch(`/proxies/pure/${address}`);
      return !!result;
    } catch (error) {
      console.error("Failed to check pure proxy:", error);
      return false;
    }
  }, [address, isSupportedChain, isValidAddress]);

  return { isPure: isPure ?? false, loading };
}
