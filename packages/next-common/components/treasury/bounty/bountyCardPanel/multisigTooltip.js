import React, { memo } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "next-common/utils";
import PartnerList from "./partnerList";

function MultisigTooltip({ children, className = "", style = {} }) {
  if (!children) {
    return null;
  }

  const tooltipTrigger = (
    <div className={cn("inline-block", className)} style={style}>
      {children}
    </div>
  );

  return (
    <div className="flex items-center">
      <HoverCard.Root>
        <HoverCard.Trigger asChild>{tooltipTrigger}</HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            side="top"
            sideOffset={0}
            align="end"
            className="pl-2 z-50"
          >
            <PartnerList />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </div>
  );
}

export default memo(MultisigTooltip);
