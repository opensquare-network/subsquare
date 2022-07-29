import React from "react";
import styled, { css } from "styled-components";

import ReplyIcon from "../assets/imgs/icons/reply.svg";
import ThumbUpIcon from "../assets/imgs/icons/thumb-up.svg";
import Edit from "./edit";
import UnfoldIcon from "../assets/imgs/icons/unfold.svg";
import FoldIcon from "../assets/imgs/icons/fold.svg";
import Flex from "./styled/flex";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
  color: ${(props) => props.theme.textSecondary};
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

const UnfoldWrapper = styled(Item)`
  margin-left: 7px !important;
`;

export default function Actions({
  onReply,
  noHover,
  highlight,
  toggleThumbUp,
  count,
  edit,
  setIsEdit,
  showThumbsUpList,
  setShowThumbsUpList,
}) {
  return (
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
      <Item
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbUp && toggleThumbUp()}
      >
        <ThumbUpIcon />
        <div>Up{count > 0 ? ` ${count}` : ``}</div>
      </Item>
      {count > 0 && (
        <UnfoldWrapper onClick={() => setShowThumbsUpList(!showThumbsUpList)}>
          {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
        </UnfoldWrapper>
      )}
      {edit && <Edit edit={edit} setIsEdit={setIsEdit} alwaysShow />}
    </Wrapper>
  );
}
