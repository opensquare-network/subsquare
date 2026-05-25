import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";
import { useChain } from "next-common/context/chain";
import { extractAddressFromXcmAccountLocation } from "next-common/utils/xcm/address";

export default function CuratorItem({ curator }) {
  const chain = useChain();
  const address = extractAddressFromXcmAccountLocation(curator, chain);

  if (!address) {
    return null;
  }

  return (
    <ItemWrapper>
      <span>Curator:</span>
      <AddressUser
        add={address}
        className="text12Medium text-sapphire500"
        showAvatar={false}
      />
    </ItemWrapper>
  );
}
