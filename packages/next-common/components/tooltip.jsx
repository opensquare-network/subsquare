import React from "react";
import styled from "styled-components";
import * as RadixTooltip from "@radix-ui/react-tooltip";

import Icon from "next-common/assets/imgs/icons/circle-question.svg";
import clsx from "clsx";

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
  side,
  sideOffset = 2,
  keepTooltipOpenAfterClick,
  icon,
}) {
  const [open, setOpen] = React.useState(false);

  const tooltipTrigger = children ? (
    <div className={clsx("inline-block", className)} style={style}>
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

  const rootProps = { delayDuration: 0 };
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
