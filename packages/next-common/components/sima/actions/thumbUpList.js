import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import SystemUser from "next-common/components/user/systemUser";

export default function ThumbUpList({ reactions }) {
  if (!reactions || reactions.length == 0) {
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
