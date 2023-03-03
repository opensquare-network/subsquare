import React from "react";
import { useThemeSetting } from "../../../../../context/theme";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function ProposerItem({ proposer }) {
  const theme = useThemeSetting();
  return (
    <ItemWrapper>
      <span>Proposer:</span>
      <User
        add={proposer}
        fontSize={12}
        showAvatar={false}
        color={theme.secondaryBlue500}
      />
    </ItemWrapper>
  );
}
