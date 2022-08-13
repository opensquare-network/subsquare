import React from "react";
import styled from "styled-components";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";
import useThumbsUp from "next-common/components/thumbsUp";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
`;

const GreyWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 22px;
  padding: 8px 12px;
  background: ${(props) => props.theme.grey100Bg};
  border-radius: 4px;
  margin-top: 16px;
`;

const GreyItem = styled.div`
  display: inline-block;
  margin-right: 12px;

  > .username {
    color: ${(props) => props.theme.textSecondary};
  }
`;

export default function Actions({ chain, reactions }) {
  const count = reactions?.length;

  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({ disabled: true, count, noHover: true, highlight: false });
  return (
    <>
      <Wrapper>
        {ThumbsUpComponent}
      </Wrapper>
      {showThumbsUpList && count > 0 && (
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
      )}
    </>
  );
}
