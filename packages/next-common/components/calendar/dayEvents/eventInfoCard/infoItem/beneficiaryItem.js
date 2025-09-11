import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function BeneficiaryItem({ beneficiary }) {
  return (
    <ItemWrapper>
      <span>Beneficiary:</span>
      <AddressUser
        add={beneficiary}
        className="text12Medium text-[var(--sapphire500)]"
        showAvatar={false}
      />
    </ItemWrapper>
  );
}
