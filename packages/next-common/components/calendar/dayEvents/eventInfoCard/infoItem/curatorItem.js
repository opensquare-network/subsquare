import React from "react";
import { ItemWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function CuratorItem({ curator }) {
  return (
    <ItemWrapper>
      <span>Curator:</span>
      <AddressUser
        add={curator}
        className="text12Medium text-[var(--sapphire500)]"
        showAvatar={false}
      />
    </ItemWrapper>
  );
}
