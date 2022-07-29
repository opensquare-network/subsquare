import React, { useState } from "react";
import styled from "styled-components";

import ThumbUpIcon from "next-common/assets/imgs/icons/thumb-up.svg";
import UnfoldIcon from "next-common/assets/imgs/icons/unfold.svg";
import FoldIcon from "next-common/assets/imgs/icons/fold.svg";
import Flex from "next-common/components/styled/flex";
import User from "next-common/components/user";

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

const ActionItem = styled(Flex)`
  cursor: default;

  color: ${(props) => props.theme.textTertiary};
  > svg {
    path {
      fill: ${(props) => props.theme.textTertiary};
    }
  }

  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;

  :not(:first-child) {
    margin-left: 17px;
  }

  > svg {
    margin-right: 8px;
  }
`;

const UnfoldWrapper = styled(ActionItem)`
  margin-left: 7px !important;

  cursor: pointer;

  :hover {
    color: ${(props) => props.theme.textSecondary};
    > svg {
      path {
        fill: ${(props) => props.theme.textSecondary};
      }
    }
  }
`;

const DisabledThumbUp = styled(ThumbUpIcon)`
  & > path {
    fill: ${(props) => props.theme.textPlaceholder} !important;
  }
`;

export default function Actions({ chain, reactions }) {
  const count = reactions?.length;
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  return (
    <>
      <Wrapper>
        <ActionItem>
          <DisabledThumbUp />
          <div>Up{count > 0 ? ` ${count}` : ``}</div>
        </ActionItem>
        {count > 0 && (
          <UnfoldWrapper onClick={() => setShowThumbsUpList(!showThumbsUpList)}>
            {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
          </UnfoldWrapper>
        )}
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
