import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function ProposerItem({ proposer }) {
  return (
    <ItemWrapper>
      <span>Proposer:</span>
      <AddressUser
        add={proposer}
        className="text12Medium text-textPrimary"
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
