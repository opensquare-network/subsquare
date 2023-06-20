import React from "react";
import User from "../../../../user";
import { ItemWrapper } from "./styled";

export default function FinderItem({ finder }) {
  return (
    <ItemWrapper>
      <span>Finder:</span>
      <User
        add={finder}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
