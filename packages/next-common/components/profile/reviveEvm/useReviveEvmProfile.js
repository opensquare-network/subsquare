import { useMemo } from "react";
import { decodeAddress, encodeAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import { useChainSettings } from "next-common/context/chain";
import useReviveOriginalAccount from "next-common/hooks/profile/useReviveOriginalAccount";
import { reviveEvmToSubstrateAddress } from "next-common/utils/evm/revive";

// Resolves the substrate account an EVM profile belongs to: the account that
// registered the pallet-revive mapping, or the account derived from the address.
export default function useReviveEvmProfile() {
  const { id } = usePageProps();
  const { ss58Format } = useChainSettings();
  const { address: mappedAddress, isResolved } = useReviveOriginalAccount(id);

  return useMemo(() => {
    const substrateAddress = mappedAddress
      ? encodeAddress(decodeAddress(mappedAddress), ss58Format)
      : reviveEvmToSubstrateAddress(id, ss58Format);

    return { evmAddress: id, substrateAddress, isResolving: !isResolved };
  }, [id, mappedAddress, isResolved, ss58Format]);
}
