import { useMemo } from "react";
import { backendApi } from "next-common/services/nextApi";
import { useAsync } from "react-use";
import { isAddress } from "@polkadot/util-crypto";
import { useChain } from "next-common/context/chain";
import { isKusamaChain, isPolkadotChain } from "next-common/utils/chain";

export default function useMultisigAddress(address) {
  const chain = useChain();

  const isSupportedChain = useMemo(() => {
    return isKusamaChain(chain) || isPolkadotChain(chain);
  }, [chain]);

  const isValidAddress = useMemo(() => {
    return address !== "" && isAddress(address);
  }, [address]);

  const { value: result, loading } = useAsync(async () => {
    if (!isSupportedChain || !isValidAddress) {
      return false;
    }

    try {
      const { result } = await backendApi.fetch(
        `/multisig/addresses/${address}`,
      );

      return result ?? null;
    } catch (error) {
      return null;
    }
  }, [address, isSupportedChain, isValidAddress]);

  return { result, loading };
}
