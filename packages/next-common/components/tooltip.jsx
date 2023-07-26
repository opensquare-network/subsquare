import React from "react";
import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";
import { cursor_pointer } from "next-common/styles/tailwindcss";
import clsx from "clsx";

const QuestionIcon = styled(Icon)`
  path {
    fill: var(--textDisabled);
  }
`;

const LabelWrapper = styled.div`
  ${cursor_pointer};
`;

/**
 * @param {object} props
 * @param {RadixTooltip.TooltipContentProps['side']} props.side
 * @param {RadixTooltip.TooltipContentProps['sideOffset']} props.sideOffset
 */
export default function Tooltip({
  content,
  children,
  label,
  className,
  side,
  sideOffset = 2,
}) {
  const [open, setOpen] = React.useState(false);

  const tooltipTrigger = children ? (
    <div className={clsx("inline-block", className)}>{children}</div>
  ) : (
    <LabelWrapper>{label ? label : <QuestionIcon />}</LabelWrapper>
  );

  const tooltipContent = content && (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        side={side}
        className={clsx(
          "z-[10000] rounded py-1.5 px-3",
          "text12Normal text-textPrimaryContrast break-words",
          "bg-tooltipBg",
        )}
      >
        {content}
        <RadixTooltip.Arrow className="fill-tooltipBg" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root open={open} delayDuration={0}>
        <RadixTooltip.Trigger
          asChild
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          {tooltipTrigger}
        </RadixTooltip.Trigger>

        {tooltipContent}
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
