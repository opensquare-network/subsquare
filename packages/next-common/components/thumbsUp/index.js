import React from "react";
import styled, { css } from "styled-components";

import ThumbUpIcon from "../../assets/imgs/icons/thumb-up.svg";
import UnfoldIcon from "../../assets/imgs/icons/unfold.svg";
import FoldIcon from "../../assets/imgs/icons/fold.svg";
import Flex from "../styled/flex";
import Loading from "../loading";
import noop from "lodash.noop";

const ActionItem = styled(Flex)`
  cursor: default;
  white-space: nowrap;

  ${(p) =>
    !p.noHover &&
    css`
      cursor: pointer;

      :hover {
        color: var(--textSecondary);

        > svg {
          path {
            fill: var(--textSecondary);
          }
        }
      }
    `}

  ${(p) =>
    p.highlight
      ? css`
          color: var(--textSecondary);

          > svg {
            path {
              fill: var(--textSecondary);
            }
          }
        `
      : css`
          color: var(--textTertiary);

          > svg {
            path {
              fill: var(--textTertiary);
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

  > :first-child {
    margin-right: 8px;
  }
`;

const UnfoldWrapper = styled(ActionItem)`
  margin-left: 7px !important;

  cursor: pointer;

  :hover {
    color: var(--textSecondary);
    > svg {
      path {
        fill: var(--textSecondary);
      }
    }
  }
`;

const DisabledThumbUp = styled(ThumbUpIcon)`
  & > path {
    fill: var(--textDisabled) !important;
  }
`;

export default function ThumbsUp({
  disabled = false,
  count = 0,
  noHover = false,
  highlight = false,
  thumbUpLoading = false,
  toggleThumbUp = noop,
  showThumbsUpList = false,
  setShowThumbsUpList = noop,
}) {
  return (
    <>
      <ActionItem
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbUp()}
      >
        {thumbUpLoading ? (
          <Loading size={14} />
        ) : disabled ? (
          <DisabledThumbUp />
        ) : (
          <ThumbUpIcon />
        )}
        <div>Up{count > 0 ? ` ${count}` : ""}</div>
      </ActionItem>
      {count > 0 && (
        <UnfoldWrapper onClick={() => setShowThumbsUpList(!showThumbsUpList)}>
          {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
        </UnfoldWrapper>
      )}
    </>
  );
}
