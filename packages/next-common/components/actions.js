import React from "react";
import styled, { css } from "styled-components";

import ReplyIcon from "../assets/imgs/icons/reply.svg";
import ContentMenu from "./contentMenu";
import Flex from "./styled/flex";
import User from "next-common/components/user";
import useThumbsUp from "./thumbsUp";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
  color: ${(props) => props.theme.textSecondary};
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

const Item = styled(Flex)`
  cursor: default;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: ${(props) => props.theme.textSecondary};
        > svg {
          path {
            fill: ${(props) => props.theme.textSecondary};
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: ${(props) => props.theme.textSecondary};
          > svg {
            path {
              fill: ${(props) => props.theme.textSecondary};
            }
          }
        `
      : css`
          color: ${(props) => props.theme.textTertiary};
          > svg {
            path {
              fill: ${(props) => props.theme.textTertiary};
            }
          }
        `}

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

export default function Actions({
  chain,
  onReply,
  noHover,
  highlight,
  toggleThumbUp,
  reactions,
  edit,
  setIsEdit,
  onCopy,
}) {
  const count = reactions?.length;

  const { ThumbsUpComponent, showThumbsUpList } = useThumbsUp({
    count,
    noHover,
    highlight,
    toggleThumbUp,
  });

  return (
    <>
      <Wrapper>
        <Item
          onClick={() => {
            if (!noHover) {
              onReply && onReply();
            }
          }}
          noHover={noHover}
        >
          <ReplyIcon />
          <div>Reply</div>
        </Item>
        {ThumbsUpComponent}
        <ContentMenu
          edit={edit}
          setIsEdit={setIsEdit}
          onCopy={onCopy}
          alwaysShow
        />
      </Wrapper>

      {showThumbsUpList && reactions?.length > 0 && (
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
