import Copyable from "next-common/components/copyable";
import { AddressWrapper, Tertiary } from "./styled";

export default function DisplayUserAddress({ address }) {
  if (!address) {
    return null;
  }
  return (
    <AddressWrapper>
      <Copyable copyText={address}>
        <Tertiary>{address}</Tertiary>
      </Copyable>
    </AddressWrapper>
  );
}
