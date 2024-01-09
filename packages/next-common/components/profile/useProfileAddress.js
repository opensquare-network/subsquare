import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";

export default function useProfileAddress() {
  const { id, user } = usePageProps();
  return isPolkadotAddress(id) || isEthereumAddress(id) ? id : user?.address;
}
