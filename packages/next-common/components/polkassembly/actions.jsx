import React, { useState } from "react";
import ThumbsUp from "next-common/components/thumbsUp";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";
import { Wrapper, GreyWrapper, GreyItem } from "./styled";

export default function PolkassemblyActions({ reactions, extraActions }) {
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);
  const thumbsUpReactions = (reactions || []).filter((r) => r.reaction === 1);

  return (
    <>
      <Wrapper>
        <ThumbsUp
          disabled={true}
          count={thumbsUpReactions.length}
          noHover={true}
          highlight={false}
          showThumbsUpList={showThumbsUpList}
          setShowThumbsUpList={setShowThumbsUpList}
        />
        {extraActions}
      </Wrapper>
      {showThumbsUpList && thumbsUpReactions.length > 0 && (
        <GreyWrapper style={{ marginTop: 10 }}>
          {reactions
            .filter((r) => r.user)
            .map((r, index) => (
              <GreyItem key={index}>
                <PolkassemblyUser
                  user={r.user}
                  className="text12Medium text-textPrimary"
                  showAvatar={false}
                />
              </GreyItem>
            ))}
        </GreyWrapper>
      )}
    </>
  );
}
