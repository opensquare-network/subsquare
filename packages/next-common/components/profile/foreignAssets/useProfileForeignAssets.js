import { useMemo } from "react";
import { encodeAddress } from "@polkadot/util-crypto";
import { useChain } from "next-common/context/chain";
import { getChainSs58Format } from "next-common/utils/chain";
import useForeignAssets from "next-common/hooks/foreignAssets/useForeignAssets";

export default function useProfileForeignAssets(address) {
  const chain = useChain();

  const realAddress = useMemo(() => {
    if (!address || !chain) {
      return null;
    }

    try {
      const ss58Format = getChainSs58Format(chain);
      return encodeAddress(address, ss58Format);
    } catch (error) {
      console.error("Failed to encode address:", error);
      return null;
    }
  }, [address, chain]);

  const { assets, loading } = useForeignAssets(realAddress);

  return { assets, loading };
}
