import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";
import { useChain } from "next-common/context/chain";
import { extractAddressFromXcmAccountLocation } from "next-common/utils/xcm/address";

export default function BeneficiaryItem({ beneficiary }) {
  const chain = useChain();
  const address = extractAddressFromXcmAccountLocation(beneficiary, chain);

  if (!address) {
    return null;
  }

  return (
    <ItemWrapper>
      <span>Beneficiary:</span>
      <AddressUser
        add={address}
        className="text12Medium text-sapphire500"
        showAvatar={false}
      />
    </ItemWrapper>
  );
}
