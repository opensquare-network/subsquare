import React from "react";
import styled, { css } from "styled-components";

import ReplyIcon from "../assets/imgs/icons/reply.svg";
import ThumbUpIcon from "../assets/imgs/icons/thumb-up.svg";
import Edit from "./edit";
import UnfoldIcon from "../assets/imgs/icons/unfold.svg";
import FoldIcon from "../assets/imgs/icons/fold.svg";
import Flex from "./styled/flex";
import useDarkMode from "../utils/hooks/useDarkMode";

const Wrapper = styled(Flex)`
  align-items: flex-start;
  flex-wrap: wrap;
  margin-top: 16px;
  height: 22px;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      div {
        color: rgba(255, 255, 255, 0.25);
      }
    `};
`;

const Item = styled(Flex)`
  cursor: default;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;
      :hover {
        color: #506176;
        > svg {
          path {
            fill: #506176;
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: #506176;
          > svg {
            path {
              fill: #506176;
            }
          }
        `
      : css`
          color: #9da9bb;
          > svg {
            path {
              fill: #9da9bb;
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
  const [theme] = useDarkMode();

  return (
    <Wrapper theme={theme}>
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
        <div>Up ({count ?? 0})</div>
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
