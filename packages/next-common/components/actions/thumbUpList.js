import React from "react";
import { GreyItem, GreyWrapper } from "./styled";
import SystemUser from "../user/systemUser";
import AddressUser from "../user/addressUser";
import { SystemThumbUp } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";

export default function ThumbUpList({ reactions, type = "up" }) {
  if (!reactions || reactions.length == 0) {
    return null;
  }

  return (
    <GreyWrapper style={{ marginTop: 10 }}>
      <div className="inline-flex text12Medium text-textTertiary gap-1 mr-4">
        <SystemThumbUp
          className={cn("w-4 h-4 shrink-0", type === "down" && "scale-y-[-1]")}
        />
        <span>:</span>
      </div>
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
