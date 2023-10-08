import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function ProposerItem({ proposer }) {
  return (
    <ItemWrapper>
      <span>Proposer:</span>
      <AddressUser
        add={proposer}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
