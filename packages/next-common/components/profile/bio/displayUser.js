import { isEthereumAddress } from "@polkadot/util-crypto";
import { AddressUser } from "next-common/components/user";
import { isPolkadotAddress } from "next-common/utils/viewfuncs";
import { Username } from "./styled";

export default function DisplayUser({ id }) {
  if (isPolkadotAddress(id) || isEthereumAddress(id)) {
    return <AddressUser add={id} showAvatar={false} fontSize={16} />;
  }

  return <Username>{id}</Username>;
}
