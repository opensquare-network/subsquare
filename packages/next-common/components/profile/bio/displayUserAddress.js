import { isEthereumAddress } from "@polkadot/util-crypto";
import Copyable from "next-common/components/copyable";
import { AddressWrapper, Tertiary } from "./styled";
import AccountLinks from "next-common/components/links/accountLinks";

export default function DisplayUserAddress({ address }) {
  if (!address) {
    return null;
  }
  return (
    <AddressWrapper>
      <Copyable copyText={address}>
        <Tertiary>{address}</Tertiary>
      </Copyable>
      {!isEthereumAddress(address) && <AccountLinks address={address} />}
    </AddressWrapper>
  );
}
