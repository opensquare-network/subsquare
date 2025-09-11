import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import { GreyItem, GreyWrapper } from "next-common/components/actions/styled";

export default function SimaThumbUpList({ reactions }) {
  if (!reactions || reactions.length == 0) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      {reactions.map((r, index) => (
        <GreyItem key={index}>
          <AddressUser
            add={r.proposer}
            className="text12Medium text-textPrimary"
            showAvatar={false}
          />
        </GreyItem>
      ))}
    </GreyWrapper>
  );
}
