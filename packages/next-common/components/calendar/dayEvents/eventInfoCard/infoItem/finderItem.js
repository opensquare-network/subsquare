import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function FinderItem({ finder }) {
  return (
    <ItemWrapper>
      <span>Finder:</span>
      <AddressUser
        add={finder}
        fontSize={12}
        showAvatar={false}
        color="var(--sapphire500)"
      />
    </ItemWrapper>
  );
}
