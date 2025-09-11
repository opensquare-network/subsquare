import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";

export default function ThumbUpList({ reactions }) {
  if (!reactions || reactions.length == 0) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      {reactions
        .filter((r) => r.user || r.proposer)
        .map((r, index) => (
          <GreyItem key={index}>
            {r.dataSource === "sima" ? (
              <AddressUser
                add={r.proposer}
                className="text12Medium text-textPrimary"
                showAvatar={false}
              />
            ) : (
              <SystemUser
                user={r.user}
                className="text12Medium text-textPrimary"
                showAvatar={false}
              />
            )}
          </GreyItem>
        ))}
    </GreyWrapper>
  );
}
