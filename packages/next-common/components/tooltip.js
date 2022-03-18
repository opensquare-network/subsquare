import React from "react";
import styled, { css } from "styled-components";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";

const Wrapper = styled.span`
  display: inline-block;
  position: relative;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  height: 12px;
  color: rgba(17, 17, 17, 0.65);
  > svg {
    cursor: pointer;
  }
  :hover {
    color: #111111;
    > svg {
      stroke-opacity: 1;
    }
    > * {
      display: block;
    }
  }
`;

const PopupWrapper = styled.div`
  cursor: auto;
  display: none;
  position: absolute;
  padding-bottom: 10px;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
  z-index: 1;
  ${(p) =>
    p.isCopy &&
    css`
      cursor: pointer;
    `}
`;

const Popup = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: max-content;
  max-width: 220px;
  padding: 6px 12px;
  font-size: 12px;
  line-height: 16px;
  color: #ffffff !important;
  word-wrap: break-word;
  text-align: center;
`;

const Triangle = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.65);
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
`;

const ChildrenWrapper = styled.div`
  position: relative;
  display: inline-block;
  :hover {
    > * {
      display: block;
    }
  }
`;

export default function Tooltip({ content, children, label }) {
  return (
    <>
      {children ? (
        <ChildrenWrapper>
          {children}
          {content && (
            <PopupWrapper>
              <Popup>
                {content}
                <Triangle />
              </Popup>
            </PopupWrapper>
          )}
        </ChildrenWrapper>
      ) : (
        <Wrapper>
          {label && label}
          {!label && <Icon />}
          {content && (
            <PopupWrapper>
              <Popup>
                {content}
                <Triangle />
              </Popup>
            </PopupWrapper>
          )}
        </Wrapper>
      )}
    </>
  );
}
