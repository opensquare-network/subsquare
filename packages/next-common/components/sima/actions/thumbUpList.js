import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import AddressUser from "next-common/components/user/addressUser";

export default function ThumbUpList({ reactions }) {
  if (!reactions || reactions.length == 0) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      {reactions.map((r, index) => (
        <GreyItem key={index}>
          <AddressUser add={r.proposer} fontSize={12} showAvatar={false} />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}
