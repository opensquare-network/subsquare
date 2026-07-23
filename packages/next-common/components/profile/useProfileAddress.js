import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { isEthereumAddress } from "@polkadot/util-crypto";
import { usePageProps } from "next-common/context/page";
import { isUnsupportedAddress } from "next-common/utils/addressType";

export default function useProfileAddress() {
  const { id, user } = usePageProps();

  if (isPolkadotAddress(id) || isEthereumAddress(id)) {
    return isUnsupportedAddress(id) ? null : id;
  }

  if (user?.address && !isUnsupportedAddress(user.address)) {
    return user.address;
  }

  return null;
}
