import { usePageProps } from "next-common/context/page";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { useChain } from "next-common/context/chain";
import { encodeAddressToChain } from "next-common/services/address";

export default function useFellowshipMemberDetailAddr() {
  const { id } = usePageProps();
  const chain = useChain();
  if (isPolkadotAddress(id)) {
    return encodeAddressToChain(id, chain);
  }

  return id;
}
