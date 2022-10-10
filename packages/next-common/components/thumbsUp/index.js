import React, { useState } from "react";
import styled, { css } from "styled-components";

import ThumbUpIcon from "../../assets/imgs/icons/thumb-up.svg";
import UnfoldIcon from "../../assets/imgs/icons/unfold.svg";
import FoldIcon from "../../assets/imgs/icons/fold.svg";
import Flex from "../styled/flex";
import Loading from "../loading";

const ActionItem = styled(Flex)`
  cursor: default;
  white-space: nowrap;

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

export default function useThumbsUp({
  disabled,
  count,
  noHover,
  highlight,
  toggleThumbUp,
  thumbUpLoading,
}) {
  const [showThumbsUpList, setShowThumbsUpList] = useState(false);

  const ThumbsUpComponent = (
    <>
      <ActionItem
        noHover={noHover}
        highlight={highlight}
        onClick={() => toggleThumbUp && toggleThumbUp()}
      >
        {thumbUpLoading ? <Loading size={14} /> : disabled ? <DisabledThumbUp /> : <ThumbUpIcon />}
        <div>Up{count > 0 ? ` ${count}` : ``}</div>
      </ActionItem>
      {count > 0 && (
        <UnfoldWrapper onClick={() => setShowThumbsUpList(!showThumbsUpList)}>
          {showThumbsUpList ? <UnfoldIcon /> : <FoldIcon />}
        </UnfoldWrapper>
      )}
    </>
  );

  return {
    ThumbsUpComponent,
    showThumbsUpList,
  };
}
