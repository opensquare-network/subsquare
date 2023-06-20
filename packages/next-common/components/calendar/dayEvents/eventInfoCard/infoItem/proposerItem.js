import React from "react";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function ProposerItem({ proposer }) {
  return (
    <ItemWrapper>
      <span>Proposer:</span>
      <User
        add={proposer}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
