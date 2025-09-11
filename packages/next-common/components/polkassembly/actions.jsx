import React, { useState } from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import ThumbsUp from "next-common/components/thumbsUp";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";
import PolkassemblyUser from "next-common/components/user/polkassemblyUser";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
`;

const GreyWrapper = styled(GreyPanel)`
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: var(--textSecondary);
  }
`;

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
