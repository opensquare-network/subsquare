import React from "react";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function BeneficiaryItem({ beneficiary }) {
  return (
    <ItemWrapper>
      <span>Beneficiary:</span>
      <User
        add={beneficiary}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
