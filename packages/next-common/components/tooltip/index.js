import React from "react";
import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";
import { p_12_normal } from "next-common/styles/componentCss";

const QuestionIcon = styled(Icon)`
  path {
    fill: ${(props) => props.theme.textPlaceholder};
  }
`;

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
    color: ${(props) => props.theme.textPrimary};
    > svg {
      stroke-opacity: 1;
    }
    > * {
      display: block;
    }
  }
`;

const PopupWrapper = styled.div`
  display: none;
  position: absolute;
  padding-bottom: 10px;
  left: 50%;
  bottom: 100%;
  transform: translateX(-50%);
  z-index: 1;
`;

const Popup = styled.div`
  position: relative;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: max-content;
  padding: 6px 12px;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.textContrast} !important;
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

const TooltipContent = styled(RadixTooltip.Content)`
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  padding: 6px 12px;
  color: ${(props) => props.theme.textContrast} !important;
  word-wrap: break-word;
  ${p_12_normal};
`;

const TooltipArrow = styled(RadixTooltip.Arrow)`
  fill: rgba(0, 0, 0, 0.65);
`;

export default function Tooltip({ content, children, label, className }) {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0}>
        {children ? (
          <>
            <RadixTooltip.Trigger asChild>
              <div>{children}</div>
            </RadixTooltip.Trigger>

            {content && (
              <RadixTooltip.Portal>
                <TooltipContent sideOffset={5}>
                  {content}
                  <TooltipArrow />
                </TooltipContent>
              </RadixTooltip.Portal>
            )}
          </>
        ) : (
          ""
        )}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );

  // eslint-disable-next-line no-unreachable
  return (
    <>
      {children ? (
        <ChildrenWrapper className={className}>
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
          {!label && <QuestionIcon />}
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
