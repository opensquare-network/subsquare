import React from "react";
import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";
import { p_12_normal } from "next-common/styles/componentCss";
import { cursor_pointer } from "next-common/styles/tailwindcss";

const QuestionIcon = styled(Icon)`
  path {
    fill: ${(props) => props.theme.textPlaceholder};
  }
`;

const LabelWrapper = styled.div`
  ${cursor_pointer};
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
  const tooltipTrigger = children ? (
    <div className={className}>{children}</div>
  ) : (
    <LabelWrapper>{label ? label : <QuestionIcon />}</LabelWrapper>
  );

  const tooltipContent = content && (
    <RadixTooltip.Portal>
      <TooltipContent sideOffset={5}>
        {content}
        <TooltipArrow />
      </TooltipContent>
    </RadixTooltip.Portal>
  );

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={0}>
        <RadixTooltip.Trigger asChild>{tooltipTrigger}</RadixTooltip.Trigger>

        {tooltipContent}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
