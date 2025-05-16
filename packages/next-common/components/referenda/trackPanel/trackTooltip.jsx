import React, { memo } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { cn } from "next-common/utils";
import DesktopOnly from "next-common/components/responsive/desktopOnly";
import TrackStreamlinedDetails from "./trackStreamlinedDetails";
import { isNil } from "lodash-es";

function TrackTooltip({ trackId, children, className = "", style = {} }) {
  if (isNil(trackId) || !children) {
    return null;
  }

  const tooltipTrigger = (
    <div className={cn("inline-block", className)} style={style}>
      {children}
    </div>
  );

  return (
    <DesktopOnly>
      <div className="flex items-center max-sm:hidden">
        <HoverCard.Root>
          <HoverCard.Trigger asChild>{tooltipTrigger}</HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              side="right"
              sideOffset={0}
              align="end"
              className="pl-2 z-50"
            >
              <TrackStreamlinedDetails trackId={trackId} />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </div>
    </DesktopOnly>
  );
}

export default memo(TrackTooltip);
