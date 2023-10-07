import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function BeneficiaryItem({ beneficiary }) {
  return (
    <ItemWrapper>
      <span>Beneficiary:</span>
      <AddressUser
        add={beneficiary}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
