import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import useThumbsUp from "next-common/components/thumbsUp";
import { GreyPanel } from "next-common/components/styled/containers/greyPanel";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
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

export default function Actions({ reactions }) {
  const filtered = (reactions || []).filter(
    (reaction) => reaction.reaction === 1,
  );
  const count = filtered.length;

  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    disabled: true,
    count,
    noHover: true,
    highlight: false,
  });
  return (
    <>
      <Wrapper>{ThumbsUpComponent}</Wrapper>
      {showThumbsUpList && count > 0 && (
        <GreyWrapper style={{ marginTop: 10 }}>
          {reactions
            .filter((r) => r.user)
            .map((r, index) => (
              <GreyItem key={index}>
                <User user={r.user} fontSize={12} showAvatar={false} noEvent />
              </GreyItem>
            ))}
        </GreyWrapper>
      )}
    </>
  );
}
