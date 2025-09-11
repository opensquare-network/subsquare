import React from "react";
import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";
import { cn } from "next-common/utils";

const IconWrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  svg path {
    fill: var(--textDisabled);
  }
`;

export default function Tooltip({
  content,
  children,
  label,
  className,
  style,
  contentClassName,
  side,
  sideOffset = 2,
  keepTooltipOpenAfterClick,
  icon,
  delayDuration = 0,
}) {
  const [open, setOpen] = React.useState(false);

  const tooltipTrigger = children ? (
    <div className={cn("inline-block", className)} style={style}>
      {children}
    </div>
  ) : (
    <IconWrapper>{label ? label : icon || <Icon />}</IconWrapper>
  );

  const tooltipContent = content && (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        side={side}
        className={cn(
          "z-[1000000] rounded py-1.5 px-3",
          "text12Normal text-textPrimaryContrast break-words",
          "bg-tooltipBg",
          "[&_.value-display-symbol]:text-inherit",
          contentClassName,
        )}
      >
        {content}
        <RadixTooltip.Arrow className="fill-tooltipBg" />
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );

  const rootProps = { delayDuration };
  if (keepTooltipOpenAfterClick) {
    rootProps.open = open;
  }

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root {...rootProps}>
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
