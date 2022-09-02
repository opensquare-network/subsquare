import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import User from "../user";

export default function ThumbUpList({ showThumbsUpList, reactions, chain }) {
  if (!showThumbsUpList || !(reactions?.length > 0)) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      {reactions
        .filter((r) => r.user)
        .map((r, index) => (
          <GreyItem key={index}>
            <User
              user={r.user}
              fontSize={12}
              chain={chain}
              showAvatar={false}
            />
          </GreyItem>
        ))}
    </GreyWrapper>
  );
}
