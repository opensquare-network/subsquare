import React from "react";
import { useThemeSetting } from "../../../../../context/theme";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function FinderItem({ finder }) {
  const theme = useThemeSetting();
  return (
    <ItemWrapper>
      <span>Finder:</span>
      <User
        add={finder}
        fontSize={12}
        showAvatar={false}
        color={theme.secondarySapphire500}
      />
    </ItemWrapper>
  );
}
