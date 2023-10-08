import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import SystemUser from "../user/systemUser";

export default function ThumbUpList({ showThumbsUpList, reactions }) {
  if (!showThumbsUpList || !(reactions?.length > 0)) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      {reactions
        .filter((r) => r.user)
        .map((r, index) => (
          <GreyItem key={index}>
            <SystemUser user={r.user} fontSize={12} showAvatar={false} />
          </GreyItem>
        ))}
    </GreyWrapper>
  );
}
