import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function ProposerItem({ proposer }) {
  return (
    <ItemWrapper>
      <span>Proposer:</span>
      <AddressUser
        add={proposer}
        className="text12Medium text-[var(--sapphire500)]"
        showAvatar={false}
      />
    </ItemWrapper>
  );
}
